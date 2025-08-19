import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import jwt from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/AppError";
import { callServices } from "../../modules/call/call.services";

interface DecodedUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

interface CustomSocketProps {
    user: DecodedUser;
    currentRoom?: string;
}

type CallSocket = Socket & CustomSocketProps;

interface CallUser {
    userId: string;
    socketId: string;
}

interface CallRoom {
    roomId: string;
    participants: string[];
    isVideo: boolean;
}

let callSocketServer: Server;

const activeUsers = new Map<string, CallUser>();
const activeRooms = new Map<string, CallRoom>();

export const initCallSocket = (server: HttpServer | HttpsServer) => {
    callSocketServer = new Server(server, {
        cors: {
            origin: config.client_url,
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    callSocketServer.use((socket: Socket, next: (err?: Error) => void) => {
        try {
            const token = (socket as any).handshake.auth.token;
            if (!token) throw new ApiError(401, "No token provided");

            const decoded = jwt.verify(token, config.jwt_access_secret as string) as DecodedUser;
            (socket as CallSocket).user = decoded;
            next();
        } catch (err) {
            next(new ApiError(403, "Authentication failed"));
        }
    });

    callSocketServer.on("connection", (socket: Socket) => {
        const callSocket = socket as CallSocket;

        if (!callSocket.user) {
            callSocket.disconnect();
            return;
        }

        const { _id: userId, name } = callSocket.user;
        console.log(`Call socket connected: ${userId}`);

        activeUsers.set(userId, { userId, socketId: callSocket.id });
        callSocket.join(userId);

        callSocket.on("initiate-call", async ({ recipientId, isVideo = false }) => {
            const recipient = activeUsers.get(recipientId);
            if (!recipient) {
                callSocket.emit("call-error", "Recipient not available");
                return;
            }

            const call = await callServices.createCall(userId, {
                recipientId,
                type: isVideo ? "video" : "audio",
            });

            // Add null check for call._id
            if (!call?._id) {
                callSocket.emit("call-error", "Failed to create call");
                return;
            }

            const roomId = call._id.toString();
            activeRooms.set(roomId, {
                roomId,
                participants: [userId, recipientId],
                isVideo,
            });

            callSocket.join(roomId);
            callSocket.currentRoom = roomId;

            callSocketServer.to(recipientId).emit("incoming-call", {
                callId: roomId,
                callerId: userId,
                callerName: name,
                isVideo,
            });
        });

        callSocket.on("accept-call", async ({ roomId }) => {
            const room = activeRooms.get(roomId);
            if (!room) {
                callSocket.emit("call-error", "Invalid room");
                return;
            }

            await callServices.updateCall(
                roomId,
                {
                    status: "ongoing",
                    "participants.$[elem].joinedAt": new Date(),
                },
                [{ "elem.userId": userId }]
            );

            callSocket.join(roomId);
            callSocket.currentRoom = roomId;
            callSocketServer.to(roomId).emit("call-started", { roomId });
        });

        callSocket.on("webrtc-signal", ({ signal, targetUserId }) => {
            callSocketServer.to(targetUserId).emit("webrtc-signal", {
                signal,
                senderId: userId,
            });
        });

        callSocket.on("toggle-media", ({ type, enabled }) => {
            if (callSocket.currentRoom) {
                callSocketServer.to(callSocket.currentRoom).emit("media-toggled", {
                    userId,
                    type,
                    enabled,
                });
            }
        });

        callSocket.on("disconnect", async () => {
            activeUsers.delete(userId);
            if (callSocket.currentRoom) {
                await callServices.endCall(callSocket.currentRoom);
                callSocketServer.to(callSocket.currentRoom).emit("call-ended", {
                    reason: "Peer disconnected",
                });
                activeRooms.delete(callSocket.currentRoom);
            }
        });

        callSocket.on("error", (err) => {
            console.error(`Socket error (${userId}):`, err);
        });
    });

    return callSocketServer;
};

export const getCallSocket = () => {
    if (!callSocketServer) throw new Error("Call socket not initialized");
    return callSocketServer;
};
