import { io } from "socket.io-client";

export const initSocket = (token) => {
    const socket = io('http://localhost:5001/', {
        auth: { token },
    });
    return socket;
}
