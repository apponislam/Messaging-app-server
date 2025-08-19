import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import config from "../config";
import jwt from "jsonwebtoken";
import ApiError from "../errors/AppError";
import { initCallSocket } from "../lib/sockets/callSocket";

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
            origin: config.client_url || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        // transports: ["websocket"],
        transports: ["websocket", "polling"],
    });

    io.use(async (socket: SocketWithUser, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                console.error("No token provided");
                throw new Error("Authentication error");
            }

            const decoded = jwt.verify(token, config.jwt_access_secret as string) as DecodedUser;

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
            next(new ApiError(403, "Authentication failed"));
        }
    });

    io.on("connection", (socket: SocketWithUser) => {
        if (!socket.user) return socket.disconnect();
        socket.join(`user_${socket.user._id}`);
        socket.join(`notifications_${socket.user._id}`);

        initCallSocket(socket);

        socket.on("disconnect", () => {});
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};
