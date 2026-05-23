import { prisma } from "../../config/prisma.js";
import crypto from "crypto";

interface ServiceData {
    nameProduct: string;
    price: number;
    totalQuantity?: number;
    borrowed?: number;
    returned?: number;
}

export const ServiceLogic = {

    create: async (data: ServiceData) => {
        return await prisma.services.create({
            data: {
                serviceId: `SERV-${crypto.randomUUID().substring(0, 8)}`,
                nameProduct: data.nameProduct,
                price: data.price,
                totalQuantity: data.totalQuantity || 0,
                borrowed: data.borrowed || 0,
                returned: data.returned || 0
            }
        });
    },

    getAll: async () => {
        return await prisma.services.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    getOne: async (id: string) => {
        return await prisma.services.findUnique({
            where: { serviceId: id }
        });
    },

    update: async (id: string, data: Partial<ServiceData>) => {
        const existingService = await prisma.services.findUnique({ where: { serviceId: id } });
        if (!existingService) throw new Error("Dịch vụ không tồn tại");

        return await prisma.services.update({
            where: { serviceId: id },
            data: {
                nameProduct: data.nameProduct ?? existingService.nameProduct,
                price: data.price ?? existingService.price,
                totalQuantity: data.totalQuantity ?? existingService.totalQuantity,
                borrowed: data.borrowed ?? existingService.borrowed,
                returned: data.returned ?? existingService.returned
            }
        });
    },

    delete: async (id: string) => {
        return await prisma.services.delete({
            where: { serviceId: id }
        });
    }
};