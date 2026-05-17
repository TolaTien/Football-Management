import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
export const ServiceLogic = {

    create: async (data: any) => {
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


    update: async (id: string, data: any) => {
        return await prisma.services.update({
            where: { serviceId: id },
            data: {
                nameProduct: data.nameProduct,
                price: data.price,
                totalQuantity: data.totalQuantity,
                borrowed: data.borrowed,
                returned: data.returned,
                updatedAt: new Date()
            }
        });
    },

    delete: async (id: string) => {
        return await prisma.services.delete({
            where: { serviceId: id }
        });
    }
};
