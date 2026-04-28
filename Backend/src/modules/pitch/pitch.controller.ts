import { Request, Response } from "express";
import { PitchService } from "./pitch.service.js";

class Pitch {
    async getAllPitch(req: Request, res: Response){
        const results = await PitchService.getAllPitch(req.query);

        res.status(200).json({ message: "Lấy các sân bóng thành công", data: results.pitches, meta: results.pagination})
    }
}

export default new Pitch();