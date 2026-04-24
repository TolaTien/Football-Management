import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";

const PORT = 3000;
const app = express()
app.use(express.json({ limit: "10mb" }));

app.get('/', (req: Request, res: Response) =>{
    res.send("Hello PTIT")
}) 

app.listen(PORT, "0.0.0.0", () =>{
    console.log(`Server is running in ${PORT}`);
} )