import { Request } from "express";


export type Role = 'user' | 'admin'

export interface Payload {
    userId: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: Payload;
        }
    }
}
