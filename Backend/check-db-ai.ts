import { prisma } from "./src/config/prisma.js";

async function checkAi() {
  try {
    const conversations = await prisma.ai_conversation.findMany({
      include: {
        ai_message: true,
      },
      take: 10,
    });
    console.log("Conversations count:", conversations.length);
    console.log("Conversations:", JSON.stringify(conversations, null, 2));
  } catch (error) {
    console.error("Error reading AI data from DB:", error);
  }
}

checkAi().finally(() => prisma.$disconnect());
