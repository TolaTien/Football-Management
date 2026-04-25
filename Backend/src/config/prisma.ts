import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
      await prisma.$connect();
      console.log("✅ Database connection successful.");
  } catch (error) {
      console.error("❌ Failed to connect to the database.", error);
      process.exit(1);
  }
};

export { prisma };