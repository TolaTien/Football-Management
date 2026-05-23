import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
<<<<<<< HEAD
export const ServiceLogic = {

    create: async (data: any) => {
=======

interface ServiceData {
    nameProduct: string;
    price: number;
    totalQuantity?: number;
    borrowed?: number;
    returned?: number;
}

export const ServiceLogic = {

    create: async (data: ServiceData) => {
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
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

<<<<<<< HEAD
  
=======
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
    getAll: async () => {
        return await prisma.services.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

<<<<<<< HEAD

=======
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
    getOne: async (id: string) => {
        return await prisma.services.findUnique({
            where: { serviceId: id }
        });
    },

<<<<<<< HEAD

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
=======
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
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            }
        });
    },

    delete: async (id: string) => {
        return await prisma.services.delete({
            where: { serviceId: id }
        });
    }
};