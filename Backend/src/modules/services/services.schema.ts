import { z } from "zod";

export const ServicesSchema = {
    create: z.object({
        body: z.object({
            nameProduct: z.string({
                required_error: "Tên dịch vụ không được để trống",
            }).min(1, "Tên dịch vụ phải có ít nhất 1 ký tự"),

            price: z.number({
                required_error: "Giá tiền là bắt buộc",
                invalid_type_error: "Giá tiền phải là một con số"
            }).min(0, "Giá tiền không được là số âm"),

            totalQuantity: z.number().min(0, "Số lượng không được là số âm").optional(),
            borrowed: z.number().min(0, "Số lượng mượn không được âm").optional(),
            returned: z.number().min(0, "Số lượng trả không được âm").optional()
        })
    }),

    // 2. Kiểm tra data khi CẬP NHẬT
    update: z.object({
        body: z.object({
            nameProduct: z.string().min(1, "Tên dịch vụ không được để trống").optional(),
            price: z.number().min(0, "Giá tiền không được là số âm").optional(),
            totalQuantity: z.number().min(0).optional(),
            borrowed: z.number().min(0).optional(),
            returned: z.number().min(0).optional()
        })
    }),

    // 3. Kiểm tra cái ID trên đường dẫn URL
    paramsId: z.object({
        params: z.object({
            id: z.string({
                required_error: "Thiếu ID dịch vụ trên URL"
            }).min(1, "ID không hợp lệ")
        })
    })
};