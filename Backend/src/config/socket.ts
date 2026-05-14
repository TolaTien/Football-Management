import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
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


