import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
      await prisma.$connect();
      console.log("✅ Database connection successful (Aiven).");
  } catch (error) {
      console.error("❌ Failed to connect to the database.", error);
      process.exit(1);
  }
};

export { prisma };