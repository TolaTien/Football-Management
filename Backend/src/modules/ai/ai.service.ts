import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { ADMIN_AI_SYSTEM_PROMPT, POLICY_CONTEXT, USER_AI_SYSTEM_PROMPT } from "./ai.prompt.js";
import { StatisticService } from "../statistic/statistic.service.js";
import { CreateConversationInput, GetConversations, GetMessages, SendMessage } from "./ai.schema.js";

type Role = "user" | "admin";
type GeminiContent = {
  role: "user" | "model";
  parts: { text: string }[];
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
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const domainContext = await this.buildDomainContext(dto.role, dto.content);
    const history: GeminiContent[] = recentMessages.map((item) => ({
      role: item.sender,
      parts: [{ text: item.content }],
    }));

    const contents: GeminiContent[] = [
      ...history,
      {
        role: "user",
        parts: [{
          text: `
Ngữ cảnh hệ thống:
${domainContext}

Câu hỏi hiện tại của người dùng:
${dto.content}
          `.trim(),
        }],
      },
    ];

    const reply = await this.callGemini(dto.role, contents);

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


  private static async buildDomainContext(role: Role, message: string) {
    const normalized = message.toLowerCase();
    const [pitchInfo, availablePitchInfo, revenueInfo] = await Promise.all([
      this.getPitchInformation(),
      this.shouldCheckAvailability(normalized) ? this.getAvailabilityContext(message) : Promise.resolve(""),
      role === "admin" && this.shouldAnalyzeRevenue(normalized) ? this.getRevenueContext() : Promise.resolve(""),
    ]);

    return [
      POLICY_CONTEXT,
      pitchInfo,
      availablePitchInfo,
      revenueInfo,
    ].filter(Boolean).join("\n\n");
  }

  private static shouldCheckAvailability(message: string) {
    return ["trống", "còn sân", "sân nào", "đặt sân", "available"].some((keyword) => message.includes(keyword));
  }

  private static shouldAnalyzeRevenue(message: string) {
    return ["doanh thu", "booking", "lấp đầy", "phân tích", "thống kê"].some((keyword) => message.includes(keyword));
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

    if (!pitches.length) return "Hiện chưa có sân hoạt động trong hệ thống.";

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

  private static async getAvailabilityContext(message: string) {
    const date = this.extractDate(message);
    const timeRange = this.extractTimeRange(message);

    if (!date || !timeRange) {
      return "Để kiểm tra sân trống chính xác, cần có ngày và khung giờ cụ thể.";
    }

    const startTime = new Date(`${date}T${timeRange.start}:00+07:00`);
    const endTime = new Date(`${date}T${timeRange.end}:00+07:00`);

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
      return `Không còn sân trống ngày ${date} từ ${timeRange.start} đến ${timeRange.end}.`;
    }

    return `Sân trống ngày ${date} từ ${timeRange.start} đến ${timeRange.end}:
${pitches.map((pitch) => `- ${pitch.namePitch} | loại sân ${pitch.pitchCategory ?? "không rõ"} | ${pitch.address ?? "chưa có địa chỉ"}`).join("\n")}`;
  }

  private static extractDate(message: string) {
    const isoDate = message.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
    if (isoDate) return isoDate[0];

    const slashDate = message.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
    if (slashDate) {
      const [, day, month, year] = slashDate;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return null;
  }

  private static extractTimeRange(message: string) {
    const match = message.match(/\b(\d{1,2})(?::(\d{2}))?\s*(?:-|đến|toi|to)\s*(\d{1,2})(?::(\d{2}))?\b/i);
    if (!match) return null;

    const [, startHour, startMinute = "00", endHour, endMinute = "00"] = match;
    return {
      start: `${startHour.padStart(2, "0")}:${startMinute}`,
      end: `${endHour.padStart(2, "0")}:${endMinute}`,
    };
  }

  private static async getRevenueContext() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
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
- Tháng hiện tại: ${month}/${year}
- Doanh thu hiện tại: ${current.totalRevenue}đ
- Tổng booking thành công: ${current.totalBookings}
- Tỷ lệ lấp đầy: ${current.rate}%
- Doanh thu tháng trước: ${previousRevenue}đ
- Mức thay đổi so với tháng trước: ${changePercent === null ? "chưa đủ dữ liệu để so sánh" : `${changePercent}%`}`;
  }

  private static async callGemini(role: Role, contents: GeminiContent[]) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Chưa cấu hình GEMINI_API_KEY");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: role === "admin" ? ADMIN_AI_SYSTEM_PROMPT : USER_AI_SYSTEM_PROMPT }],
        },
        contents,
      }),
    });

    if (!response.ok) {
      throw new ApiError(StatusCodes.BAD_GATEWAY, "Không thể kết nối Gemini API");
    }

    const data = await response.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!text) {
      throw new ApiError(StatusCodes.BAD_GATEWAY, "Gemini không trả về nội dung");
    }

    return text;
  }
}
