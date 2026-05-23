import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { ADMIN_AI_SYSTEM_PROMPT, POLICY_CONTEXT, USER_AI_SYSTEM_PROMPT } from "./ai.prompt.js";
import { StatisticService } from "../statistic/statistic.service.js";
import { CreateConversationInput, GetConversations, GetMessages, SendMessage } from "./ai.schema.js";
import { GoogleGenAI, Type } from "@google/genai";

type Role = "user" | "admin";
type GeminiContent = {
  role: "user" | "model";
  parts: any[];
};

export class AiService {
  static async createConversation(dto: CreateConversationInput) {
    return prisma.ai_conversation.create({
      data: {
        conversationId: uuidv4(),
        userId: dto.userId,
        title: dto.title?.trim() || "Cuộc trò chuyện mới",
      },
    });
  }

  static async getConversations(dto: GetConversations) {
    return prisma.ai_conversation.findMany({
      where: { userId: dto.userId },
      orderBy: { updatedAt: "desc" },
      include: {
        ai_message: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  static async getMessages(dto: GetMessages) {
    const conversation = await prisma.ai_conversation.findFirst({
      where: {userId: dto.userId, conversationId: dto.conversationId}
    });

    if(!conversation) throw new ApiError(403, "Cuộc hội thoại không tồn tại")

    return prisma.ai_message.findMany({
      where: { conversationId: dto.conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async sendMessage(dto: SendMessage) {
    if (!dto.content?.trim()) {
      throw new ApiError(400, "Nội dung tin nhắn không được để trống");
    }

    const conversation = await prisma.ai_conversation.findFirst({
      where: {userId: dto.userId, conversationId: dto.conversationId}
    });
    if(!conversation) throw new ApiError(403, "Cuộc hội thoại không tồn tại")

    const recentMessages = await prisma.ai_message.findMany({
      where: { conversationId: dto.conversationId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    recentMessages.reverse();

    const history: GeminiContent[] = recentMessages.map((item) => ({
      role: item.sender,
      parts: [{ text: item.content }],
    }));

    const contents: GeminiContent[] = [
      ...history,
      {
        role: "user",
        parts: [{ text: dto.content.trim() }],
      },
    ];

    const reply = await this.callGeminiWithTools(dto.role, contents);
    const [, assistantMessage] = await prisma.$transaction([
      prisma.ai_message.create({
        data: {
          messageId: uuidv4(),
          conversationId: dto.conversationId,
          sender: "user",
          content: dto.content.trim(),
        },
      }),
      prisma.ai_message.create({
        data: {
          messageId: uuidv4(),
          conversationId: dto.conversationId,
          sender: "model",
          content: reply,
        },
      }),
      prisma.ai_conversation.update({
        where: { conversationId: conversation.conversationId },
        data: {
          title: conversation.title === "Cuộc trò chuyện mới"
            ? dto.content.trim().slice(0, 80)
            : conversation.title,
        },
      }),
    ]);

    return assistantMessage;
  }

  private static getGeminiTools(role: Role) {
    const tools: any[] = [
      {
        name: "check_pitch_availability",
        description: "Kiểm tra xem còn sân bóng nào trống trong một khoảng thời gian cụ thể hay không.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Ngày muốn đặt sân, định dạng YYYY-MM-DD. Ví dụ: 2026-05-20. Nếu người dùng nói hôm nay/ngày mai, phải tự tính ra ngày chính xác." },
            startTime: { type: Type.STRING, description: "Thời gian bắt đầu, định dạng HH:mm. Ví dụ: 17:30" },
            endTime: { type: Type.STRING, description: "Thời gian kết thúc, định dạng HH:mm. Ví dụ: 19:00" },
          },
          required: ["date", "startTime", "endTime"],
        },
      },
      {
        name: "get_pitch_information",
        description: "Lấy danh sách các sân bóng đang hoạt động, bao gồm loại sân, địa chỉ và bảng giá. Dùng khi người dùng hỏi về danh sách sân, thông tin một sân hoặc giá tiền chung.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      }
    ];

    if (role === "admin") {
      tools.push({
        name: "get_revenue_statistics",
        description: "Lấy báo cáo thống kê doanh thu, số lượng booking và tỷ lệ lấp đầy. CHỈ dành cho admin.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.INTEGER, description: "Tháng (1-12)" },
            year: { type: Type.INTEGER, description: "Năm (YYYY)" }
          },
          required: ["month", "year"]
        }
      });
    }

    return [{ functionDeclarations: tools }];
  }

  private static async callGeminiWithTools(role: Role, contents: GeminiContent[]) {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const basePrompt = role === "admin" ? ADMIN_AI_SYSTEM_PROMPT : USER_AI_SYSTEM_PROMPT;
    const systemInstruction = `${basePrompt}\n\n${POLICY_CONTEXT}\n\nHôm nay là ngày: ${new Date().toISOString().split('T')[0]}\nMúi giờ: GMT+7.`;

    let response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        tools: this.getGeminiTools(role),
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      let toolResult: any;

      try {
        if (call.name === "check_pitch_availability") {
          const args = call.args as { date: string, startTime: string, endTime: string };
          toolResult = await this.getAvailabilityContextByArgs(args.date, args.startTime, args.endTime);
        } else if (call.name === "get_pitch_information") {
          toolResult = await this.getPitchInformation();
        } else if (call.name === "get_revenue_statistics" && role === "admin") {
          const args = call.args as { month: number, year: number };
          toolResult = await this.getRevenueContextByArgs(args.month, args.year);
        } else {
          toolResult = "Không tìm thấy công cụ hoặc bạn không có quyền.";
        }
      } catch (error: any) {
        toolResult = `Lỗi khi thực thi công cụ: ${error.message}`;
      }

      contents.push(
        { role: "model", parts: [{ functionCall: call }] },
        { role: "user", parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] }
      );

      response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          tools: this.getGeminiTools(role),
        },
      });
    }

    const text = response.text?.trim();
    if (!text) {
      throw new ApiError(StatusCodes.BAD_GATEWAY, "Gemini không trả về nội dung");
    }

    return text;
  }

  private static async getPitchInformation() {
    const pitches = await prisma.pitch.findMany({
      where: { status: "active" },
      include: {
        pitchprice: {
          orderBy: { startTime: "asc" },
        },
      },
      orderBy: { namePitch: "asc" },
    });

    return `Danh sách sân đang hoạt động:
${pitches.map((pitch) => {
  const prices = pitch.pitchprice.map((item) => {
    const start = item.startTime?.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const end = item.endTime?.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    return `${start}-${end}: ${item.price ?? 0}đ`;
  }).join(", ");

  return `- ${pitch.namePitch} | loại sân ${pitch.pitchCategory ?? "không rõ"} | ${pitch.address ?? "chưa có địa chỉ"} | giá: ${prices || "chưa cấu hình"}`;
}).join("\n")}`;
  }

  private static async getAvailabilityContextByArgs(date: string, startTimeStr: string, endTimeStr: string) {
    const startTime = new Date(`${date}T${startTimeStr}:00+07:00`);
    const endTime = new Date(`${date}T${endTimeStr}:00+07:00`);

    const pitches = await prisma.pitch.findMany({
      where: {
        status: "active",
        booking: {
          none: {
            status: { in: ["pending", "approved"] },
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } },
            ],
          },
        },
      },
      orderBy: { namePitch: "asc" },
    });

    if (!pitches.length) {
      return `Không còn sân trống ngày ${date} từ ${startTimeStr} đến ${endTimeStr}.`;
    }

    return `Sân trống ngày ${date} từ ${startTimeStr} đến ${endTimeStr}:\n${pitches.map((pitch) => `- ${pitch.namePitch} | loại sân ${pitch.pitchCategory ?? "không rõ"} | ${pitch.address ?? "chưa có địa chỉ"}`).join("\n")}`;
  }

  private static async getRevenueContextByArgs(month: number, year: number) {
    const current = await StatisticService.getMonthlyRevenue({ month, year });

    const previousMonthDate = new Date(year, month - 2, 1);
    const previous = await StatisticService.getMonthlyRevenue({
      month: previousMonthDate.getMonth() + 1,
      year: previousMonthDate.getFullYear(),
    });

    const previousRevenue = previous.totalRevenue || 0;
    const changePercent = previousRevenue === 0
      ? null
      : Number((((current.totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2));

    return `Dữ liệu doanh thu cho admin:
- Tháng được yêu cầu: ${month}/${year}
- Doanh thu: ${current.totalRevenue}đ
- Tổng booking thành công: ${current.totalBookings}
- Tỷ lệ lấp đầy: ${current.rate}%
- Doanh thu tháng trước: ${previousRevenue}đ
- Mức thay đổi so với tháng trước: ${changePercent === null ? "chưa đủ dữ liệu để so sánh" : `${changePercent}%`}`;
  }
}
