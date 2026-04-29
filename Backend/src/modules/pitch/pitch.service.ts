import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { AddPitch, Pagination, UpdatePitch, UpdatePricePitch } from "./pitch.schema.js";
import { v4 as uuidv4 } from 'uuid';

export class PitchService {
    static async getAllPitch(query: any){
        const page = Number(query.page) || 1;
        const perPage = Number(query.limit) || 10;
        const skip = (page - 1) * perPage;

        const filter: any = {};
        if(query.status) filter.status = query.status;
        if(query.category) filter.pitchCategory = query.category;
        if(query.address) filter.address  = query.address ;
        if(query.search) filter.namePitch = { contains: query.search }; //Note: Giống regex trong mongoose

        const pitches = await prisma.pitch.findMany({
            where: filter,
            skip: skip,
            take: perPage,
            include: {
                pitchprice: true
            },
            orderBy: { createdAt: 'desc' }
        });
        const total = await prisma.pitch.count({ where: filter});
        const totalPages  = Math.ceil(total/ perPage);
        return { pitches, pagination: { total, totalPages, page, perPage}};
    };


    static async addPitch(dto: AddPitch){
        const newPitch = await prisma.pitch.create({
            data: {
                pitchId: uuidv4(),
                namePitch: dto.namePitch,
                status: dto.status,
                pitchCategory: dto.pitchCategory,
                address: dto.address 
            }
        });
        
        const price = await prisma.pitchprice.create({
            data: {
                id: uuidv4(),
                pitchId: newPitch.pitchId,
                startTime: new Date(dto.startTime),
                endTime: new Date(dto.endTime),
                price: dto.price
            }
        });

        return { newPitch, price};
    };

    static async updatePitch(dto: UpdatePitch, pitchId: string){
        const pitch = await prisma.pitch.findUnique({ where: {pitchId}});
        if(!pitch){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy sân");
        }
        const update = await prisma.pitch.update({
            where: { pitchId },
            data: {
                namePitch: dto.namePitch ?? pitch.namePitch,
                status: dto.status ?? pitch.status,
                pitchCategory: dto.pitchCategory ?? pitch.pitchCategory,
                address: dto.address ?? pitch.address
            }
        });

        return update;
    };
    
    static async updatePitchPrice(dto: UpdatePricePitch[], pitchId: string){
        const pitch = await prisma.pitch.findUnique({ where: {pitchId}});
        if(!pitch){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Không tìm thấy sân");
        };

        const update = await prisma.$transaction( async (tx) => {
            await tx.pitchprice.deleteMany({
                where: { pitchId}
            });

            const newPrices = dto.map( x => ({
                id: uuidv4(),
                pitchId: pitchId,
                startTime: new Date(x.startTime!),
                endTime: new Date(x.endTime!),
                price: x.price
            }));

            if(newPrices.length > 0){
                await tx.pitchprice.createMany({
                    data: newPrices
                });
            }

            return await tx.pitchprice.findMany({
                where: {pitchId},
                orderBy: {startTime: 'asc'}
            });
        });

        return update;
    }
}