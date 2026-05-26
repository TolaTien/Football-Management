import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import AiController from "./ai.controller.js";

export const aiRouters: Router = Router();

aiRouters.post("/conversations", authUser, AiController.createConversation);
aiRouters.get("/get-conversations", authUser, AiController.getConversations);
aiRouters.get("/get-messages/:conversationId", authUser, AiController.getMessages);
aiRouters.post("/send-message/:conversationId", authUser, AiController.sendMessage);
