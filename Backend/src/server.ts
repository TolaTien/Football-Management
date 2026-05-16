import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import { connectDB } from "./config/prisma.js";
import { Routers } from "./routes/index.js";
import { errorHandlingMiddleware } from "./middlewares/error.middleware.js";
import { startCron } from "./utils/cron.js";
import cors from 'cors';
import { server, app } from "./config/socket.js";
import { initEmail } from "./utils/email.js";

const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:8000",
    credentials: true
}));
app.use(Routers)

app.get('/', (req: Request, res: Response) =>{
    res.send("Hello PTIT")
}) 

// Gắn errorHandlingMiddleware ở cuối cùng
app.use(errorHandlingMiddleware);

async function init() {
    await connectDB();
    startCron(); 
    // await initEmail()
    server.listen(PORT, "0.0.0.0", async () =>{
        console.log(`Server is running on port ${PORT}`);
    });
}

init();