import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: any) {
            // Lớp bảo vệ 1: Bắt chuẩn ZodError bằng cả 2 cách
            if (error instanceof ZodError || error.name === 'ZodError') {
                
                // Lớp bảo vệ 2: Phòng hờ mảng bị undefined
                const issues = error.errors || error.issues || [];
                
                const errorMessages = issues.map((issue: any) => ({
                    field: issue.path.join('.'), 
                    message: issue.message,      
                }));
                
                res.status(400).json({
                    status: 'error',
                    message: 'Dữ liệu đầu vào không hợp lệ',
                    errors: errorMessages,
                });
                return; // 👈 Chặn đứng luồng chạy tại đây!
            }
            
            // Nếu là lỗi lạ không phải do Zod, đá nó sang cho error.middleware lo
            next(error); 
        }
    };
};