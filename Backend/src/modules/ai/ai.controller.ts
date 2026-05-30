import { Request, Response } from "express";
import { AiService } from "./ai.service.js";

class AiController {
  async createConversation(req: Request, res: Response) {
    const userId = req.user?.userId as string;
    const title = req.body.title
    const conversation = await AiService.createConversation({ userId, title});
    return res.status(201).json({ message: "Tạo cuộc hội thoại thành công", data: conversation });
  }

  async getConversations(req: Request, res: Response) {
    const userId = req.user?.userId as string;
    const conversations = await AiService.getConversations({ userId });
    return res.status(200).json({ message: "Lấy danh sách hội thoại thành công", data: conversations });
  }

  async getMessages(req: Request, res: Response) {
    const userId = req.user?.userId as string;
    const conversationId = req.params.conversationId as string;
    const messages = await AiService.getMessages({userId, conversationId});
    return res.status(200).json({ message: "Lấy lịch sử hội thoại thành công", data: messages });
  }

  async sendMessage(req: Request, res: Response) {
    const userId = req.user?.userId as string;
    const role = req.user?.role as "user" | "admin";
    const conversationId = req.params.conversationId as string;
    const content = req.body.content;
    const message = await AiService.sendMessage({ userId, role, conversationId, content });
    return res.status(201).json({ message: "Gửi tin nhắn thành công", data: message });
  }
}

export default new AiController();
