import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { v4 as uuidv4 } from "uuid";
import { CreateServiceDto, UpdateServiceDto } from "./services.schema.js";

export class ServicesService {
    static async getAllServices(query: any) {
        const page = Math.max(Number(query.page) || 1, 1);
        const perPage = Math.min(Math.max(Number(query.perPage) || 10, 1), 50);
        const skip = (page - 1) * perPage;

        const filter: any = {};
        if (query.search) {
            filter.nameProduct = { contains: String(query.search) };
        }

        const [services, total] = await Promise.all([
            prisma.services.findMany({
                where: filter,
                skip,
                take: perPage,
                orderBy: { createdAt: "desc" }
            }),
            prisma.services.count({ where: filter })
        ]);

        const mappedServices = services.map((item) => ({
            ...item,
            available: (item.totalQuantity ?? 0) - (item.borrowed ?? 0) + (item.returned ?? 0)
        }));

        const totalPages = Math.ceil(total / perPage);
        return { services: mappedServices, pagination: { total, totalPages, page, perPage } };
    }

    static async getServiceDetail(serviceId: string) {
        const service = await prisma.services.findUnique({ where: { serviceId } });
        if (!service) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy dịch vụ");
        }

        return {
            ...service,
            available: (service.totalQuantity ?? 0) - (service.borrowed ?? 0) + (service.returned ?? 0)
        };
    }

    static async createService(dto: CreateServiceDto) {
        if (!dto.nameProduct?.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Tên dịch vụ không được để trống");
        }
        if (dto.price === undefined || dto.price < 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Giá dịch vụ không hợp lệ");
        }
        if (dto.totalQuantity === undefined || dto.totalQuantity < 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Số lượng không hợp lệ");
        }

        const existing = await prisma.services.findFirst({
            where: { nameProduct: dto.nameProduct.trim() }
        });
        if (existing) {
            throw new ApiError(StatusCodes.CONFLICT, "Dịch vụ này đã tồn tại");
        }

        const newService = await prisma.services.create({
            data: {
                serviceId: uuidv4(),
                nameProduct: dto.nameProduct.trim(),
                price: dto.price,
                totalQuantity: dto.totalQuantity,
                borrowed: 0,
                returned: 0
            }
        });

        return newService;
    }

    static async updateService(dto: UpdateServiceDto) {
        const service = await prisma.services.findUnique({ where: { serviceId: dto.serviceId } });
        if (!service) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy dịch vụ");
        }

        if (dto.nameProduct !== undefined && !dto.nameProduct.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Tên dịch vụ không được để trống");
        }
        if (dto.price !== undefined && dto.price < 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Giá dịch vụ không hợp lệ");
        }
        if (dto.totalQuantity !== undefined && dto.totalQuantity < 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Số lượng không hợp lệ");
        }

        const inUse = (service.borrowed ?? 0) - (service.returned ?? 0);
        if (dto.totalQuantity !== undefined && dto.totalQuantity < inUse) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Số lượng tổng không được nhỏ hơn số đang mượn");
        }

        const updateData: any = {};
        if (dto.nameProduct !== undefined) updateData.nameProduct = dto.nameProduct.trim();
        if (dto.price !== undefined) updateData.price = dto.price;
        if (dto.totalQuantity !== undefined) updateData.totalQuantity = dto.totalQuantity;

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Không có dữ liệu để cập nhật");
        }

        return prisma.services.update({
            where: { serviceId: dto.serviceId },
            data: updateData
        });
    }

    static async deleteService(serviceId: string) {
        const service = await prisma.services.findUnique({ where: { serviceId } });
        if (!service) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy dịch vụ");
        }

        const usedInBooking = await prisma.bookingservices.count({
            where: { serviceId }
        });
        if (usedInBooking > 0) {
            throw new ApiError(StatusCodes.CONFLICT, "Không thể xóa dịch vụ đã phát sinh trong đơn đặt sân");
        }

        return prisma.services.delete({ where: { serviceId } });
    }
}

