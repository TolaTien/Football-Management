import { Request, Response } from "express";
import { PitchService } from "./pitch.service.js";

class Pitch {
    async getAllPitch(req: Request, res: Response){
        const results = await PitchService.getAllPitch(req.query);

        res.status(200).json({ message: "Lấy các sân bóng thành công", data: results.pitches, meta: results.pagination});
    };

    async addPitch(req: Request, res: Response){
        const results = await PitchService.addPitch(req.body);
        res.status(201).json({ message: "Tạo sân bóng thành công", data: results});
    };

    async updatePitch(req: Request, res: Response){
        const update = await PitchService.updatePitch(req.body, req.body.pitchId);
        res.status(200).json({ message: "Sửa thông tin thành công", data: update});
    }

    async updatePricePitch(req: Request, res: Response){
        const { pitchId, config } = req.body; //Note: config ở đây phải là 1 mảng []
        const update = await PitchService.updatePitchPrice(config, pitchId);
        res.status(200).json({ message: "Cập nhật giá sân thành công", data: update});
    }
}

export default new Pitch();