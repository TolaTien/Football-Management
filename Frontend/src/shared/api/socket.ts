import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // In production, use your actual backend URL. In development, use localhost:3000
    const SOCKET_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false, // Connect manually when user is authenticated
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
