import { Request, Response } from "express";
import { BookingService } from "./booking.service.js";

class Booking {

    async bookPitchForUser(req: Request, res: Response){
        const userId = req.user?.userId as string;
        const booking = await BookingService.bookPitchForUser(req.body, userId);

        return res.status(201).json({ message: "Tạo đơn đặt sân thành công", data: booking});
    };

    async partialPayment(req: Request, res: Response){
        const payment = await BookingService.partialPayment(req.body);

        return res.status(200).json({ messagea: "Thanh toán thành công", data: payment})
    };

}

export default new Booking();