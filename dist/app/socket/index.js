"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const callSocket_1 = require("../lib/sockets/callSocket");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: config_1.default.client_url || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        // transports: ["websocket"],
        transports: ["websocket", "polling"],
    });
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                console.error("No token provided");
                throw new Error("Authentication error");
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
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
        }
        catch (err) {
            next(new AppError_1.default(403, "Authentication failed"));
        }
    }));
    io.on("connection", (socket) => {
        if (!socket.user)
            return socket.disconnect();
        socket.join(`user_${socket.user._id}`);
        socket.join(`notifications_${socket.user._id}`);
        (0, callSocket_1.initCallSocket)(socket);
        socket.on("disconnect", () => { });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized");
    return io;
};
exports.getIO = getIO;
