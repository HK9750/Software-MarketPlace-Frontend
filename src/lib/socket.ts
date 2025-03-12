/* eslint-disable @typescript-eslint/no-explicit-any */
// socket.js (or socket.ts)
import socketIO from 'socket.io-client';

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';

let socket: any = null;

export const initSocket = () => {
    if (!socket) {
        socket = socketIO(ENDPOINT, { transports: ['websocket'] });
        console.log('Socket initialized:', socket);
        return socket;
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket(); // Ensure socket is initialized and returned
    }
    return socket;
};
