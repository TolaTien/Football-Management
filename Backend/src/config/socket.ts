import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:8000",
        credentials: true,
        methods: ["PUT", "POST", "GET", "DELETE", "PATCH"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected")
    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })
});

export { app, server};


