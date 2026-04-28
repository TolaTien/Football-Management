import { prisma } from "../../config/prisma.js";
import { Pagination } from "./pitch.schema.js";

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
    }
}