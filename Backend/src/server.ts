import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import { connectDB } from "./config/prisma.js";
import { Routers } from "./routes/index.js";
import { errorHandlingMiddleware } from "./middlewares/error.middleware.js";

const PORT = 3000;
const app = express()
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser())
app.use(Routers)

app.get('/', (req: Request, res: Response) =>{
    res.send("Hello PTIT")
}) 

// Gắn errorHandlingMiddleware ở cuối cùng
app.use(errorHandlingMiddleware);

async function init() {
    await connectDB();
    
    app.listen(PORT, "0.0.0.0", async () =>{
        console.log(`Server is running on port ${PORT}`);
    });
}

init();