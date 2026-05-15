import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import type { Payload } from './types.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:8000",
        credentials: true,
        methods: ["PUT", "POST", "GET", "DELETE", "PATCH"]
    }
});

const getCookieValue = (cookieHeader: string | undefined, key: string) => {
    if (!cookieHeader) return undefined;

    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const targetCookie = cookies.find((cookie) => cookie.startsWith(`${key}=`));

    return targetCookie?.slice(key.length + 1);
};

io.use((socket, next) => {
    try {
        const accessToken = getCookieValue(socket.handshake.headers.cookie, 'accessToken');
        if (!accessToken) {
            return next(new Error('Vui lòng đăng nhập'));
        }

        socket.data.user = verifyToken(accessToken) as Payload;
        return next();
    } catch {
        return next(new Error('Token không hợp lệ'));
    }
});

io.on("connection", (socket) => {
    const user = socket.data.user as Payload;

    socket.join(user.userId);

    if (user.role === 'admin') {
        socket.join('admins');
    }

    console.log(`User ${user.userId} connected `);
    socket.on("disconnect", () => {
        console.log(`User ${user.userId} disconnected `);
    })
});

export { app, server, io};


