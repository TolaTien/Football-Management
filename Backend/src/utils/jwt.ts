import jwt from 'jsonwebtoken';
import { Payload } from '../config/types.js';


const JWT_SECRET = process.env.JWT_SECRET as string

export const generateToken  =  (payload: Payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'
    });
};

export const generateRefreshToken = (payload: Payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d'
    });
};

export const verifyToken =  (token: string): Payload  => {
    return jwt.verify(token, JWT_SECRET) as Payload
};