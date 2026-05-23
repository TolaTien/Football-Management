import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "./src/config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import { AiService } from "./src/modules/ai/ai.service.js";

async function testSendMessage() {
  const conversationId = "ee7201ae-1847-42b4-bc04-6fc4e3a5e329";
  const userId = "803992f0-04ac-41f3-9ff4-67c61e8ce4e4";
  
  console.log("Starting test message...");
  try {
    const res = await AiService.sendMessage({
      userId,
      role: "user",
      conversationId,
      content: "Xin chào, cho hỏi có những sân bóng nào hoạt động?",
    });
    console.log("Success! Message sent. Reply:", res);
  } catch (error: any) {
    console.error("Error occurred:");
    console.error("Status Code:", error.statusCode || error.status);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  }
}

testSendMessage().finally(() => prisma.$disconnect());
