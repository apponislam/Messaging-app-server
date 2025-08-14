import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        // client should call socket.emit("join", userId) after login
        socket.on("join", (userId: string) => {
            socket.join(userId);
        });

        socket.on("disconnect", () => {});
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
