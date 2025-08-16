import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import config from "../config";
import jwt from "jsonwebtoken";
import ApiError from "../errors/AppError";

let io: Server;

interface DecodedUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    iat: number;
    exp: number;
}

type SocketWithUser = Socket & {
    user?: DecodedUser;
};

export const initSocket = (server: HttpServer | HttpsServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket"],
    });

    io.use(async (socket: SocketWithUser, next) => {
        try {
            const token = socket.handshake.auth.token;
            // console.log("Auth token received:", token);

            if (!token) {
                console.error("No token provided");
                throw new Error("Authentication error");
            }

            const decoded = jwt.verify(token, config.jwt_access_secret as string) as DecodedUser;
            // console.log("Decoded user:", decoded._id);

            socket.user = {
                _id: decoded._id,
                name: decoded.name,
                username: decoded.username,
                email: decoded.email,
                avatarUrl: decoded.avatarUrl,
                iat: decoded.iat,
                exp: decoded.exp,
            };

            next();
        } catch (err) {
            // console.error("Socket auth error:", err);
            next(new ApiError(403, "Authentication failed"));
            // next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket: SocketWithUser) => {
        if (!socket.user) return socket.disconnect();

        // console.log(`User connected: ${socket.user._id}`);

        // Join user-specific rooms
        socket.join(`user_${socket.user._id}`);
        socket.join(`notifications_${socket.user._id}`);

        socket.on("disconnect", () => {
            // console.log(`User disconnected: ${socket.user?._id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
