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

    const reply = await this.callGeminiWithTools(dto.role, contents, dto.userId);
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
        name: "get_user_profile",
        description: "Lấy thông tin cá nhân của người dùng hiện tại (họ tên, email, sđt...).",
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: "get_user_booking_history",
        description: "Lấy lịch sử đặt sân gần đây của người dùng hiện tại.",
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: "get_recent_matchmaking_posts",
        description: "Lấy danh sách các bài đăng tìm đối tác giao hữu gần đây (forum/matchmaking).",
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: "check_pitch_availability",
        description: "Kiểm tra xem còn sân bóng nào trống trong một khoảng thời gian cụ thể hay không. Trả về cả sức chứa của sân (sân 5 người, sân 7 người,11 người...).",
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
        description: "Lấy danh sách các sân bóng đang hoạt động, bao gồm sức chứa (loại sân 5 người, 7 người...), địa chỉ và bảng giá. Dùng khi người dùng hỏi về danh sách sân, tìm sân theo số người, thông tin một sân hoặc giá tiền chung.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      }
    ];

    if (role === "admin") {
      tools.push({
        name: "get_revenue_statistics",
        description: "Lấy báo cáo thống kê doanh thu, số lượng booking và tỷ lệ lấp đầy, nếu hỏi tháng trước thì phải tự tính ra tháng trước là thời gian nào. CHỈ dành cho admin.",
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

  private static async callGeminiWithTools(role: Role, contents: GeminiContent[], userId: string) {
    const rawModels = process.env.GEMINI_MODEL
    const models = rawModels.split(",").map(m => m.trim()).filter(m => m.length > 0);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Chưa cấu hình GEMINI_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });

    const basePrompt = role === "admin" ? ADMIN_AI_SYSTEM_PROMPT : USER_AI_SYSTEM_PROMPT;
    const systemInstruction = `${basePrompt}\n\n${POLICY_CONTEXT}\n\nHôm nay là ngày: ${new Date().toISOString().split('T')[0]}\nMúi giờ: GMT+7.`;

    let lastError: any;

    for (const model of models) {
      try {
        const currentContents = [...contents];

        let response = await ai.models.generateContent({
          model,
          contents: currentContents,
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
            } else if (call.name === "get_user_profile") {
              toolResult = await this.getUserProfileContext(userId);
            } else if (call.name === "get_user_booking_history") {
              toolResult = await this.getUserBookingHistoryContext(userId);
            } else if (call.name === "get_recent_matchmaking_posts") {
              toolResult = await this.getRecentMatchmakingPostsContext();
            } else {
              toolResult = "Không tìm thấy công cụ hoặc bạn không có quyền.";
            }
          } catch (error: any) {
            toolResult = `Lỗi khi thực thi công cụ: ${error.message}`;
          }

          currentContents.push(
            { role: "model", parts: [{ functionCall: call }] },
            { role: "user", parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] }
          );

          response = await ai.models.generateContent({
            model,
            contents: currentContents,
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
      } catch (error: any) {
        console.error(`Lỗi với Model ${model}:`, error.message);
        lastError = error;
      }
    }

    throw new ApiError(StatusCodes.BAD_GATEWAY, `Tất cả các Model đều bị lỗi. Lỗi cuối: ${lastError?.message || "Không xác định"}`);
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

  const categoryStr = pitch.pitchCategory ? `Sân ${pitch.pitchCategory} người` : "không rõ";
  return `- ${pitch.namePitch} | Loại sân: ${categoryStr} | Địa chỉ: ${pitch.address ?? "chưa có địa chỉ"} | Giá: ${prices || "chưa cấu hình"}`;
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

    return `Sân trống ngày ${date} từ ${startTimeStr} đến ${endTimeStr}:\n${pitches.map((pitch) => {
      const categoryStr = pitch.pitchCategory ? `Sân ${pitch.pitchCategory} người` : "không rõ";
      return `- ${pitch.namePitch} | Loại sân: ${categoryStr} | Địa chỉ: ${pitch.address ?? "chưa có địa chỉ"}`;
    }).join("\n")}`;
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

  private static async getUserProfileContext(userId: string) {
    const user = await prisma.users.findUnique({ where: { userId } });
    if (!user) return "Không tìm thấy thông tin người dùng.";
    return `Thông tin người dùng:
- Họ tên: ${user.fullName}
- Email: ${user.email}
- SĐT: ${user.phone ?? 'chưa cập nhật'}
- Chức vụ: ${user.role}
`;
  }

  private static async getUserBookingHistoryContext(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { pitch: true }
    });
    if (!bookings.length) return "Người dùng chưa có lịch sử đặt sân nào gần đây.";
    return `Lịch sử 5 lần đặt sân gần nhất của người dùng:
${bookings.map(b => `- Mã đặt sân: ${b.bookId} | Sân: ${b.pitch?.namePitch ?? 'không rõ'} | Thời gian: ${b.startTime?.toLocaleString('vi-VN')} đến ${b.endTime?.toLocaleString('vi-VN')} | Trạng thái: ${b.status}`).join("\n")}
`;
  }

  private static async getRecentMatchmakingPostsContext() {
    const posts = await prisma.post.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { users: true }
    });
    if (!posts.length) return "Hiện tại không có bài đăng tìm đối tác nào.";
    return `5 bài đăng tìm đối tác giao hữu gần nhất:
${posts.map(p => `- Người đăng: ${p.users?.fullName ?? 'ẩn danh'} | Nội dung: ${p.description} | Thời gian đăng: ${p.createdAt?.toLocaleString('vi-VN')}`).join("\n")}
`;
  }
}
