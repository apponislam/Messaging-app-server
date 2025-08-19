// src/socket/callSocket.ts
import { Socket } from "socket.io";
import { getIO } from "../../socket";
import { CreateCallPayload, TCallStatus } from "../../modules/call/call.interface";

export const initCallSocket = (socket: Socket & { user?: any }) => {
    if (!socket.user) return;

    // ✅ Start a call
    socket.on("call:start", ({ recipientId, type }: CreateCallPayload) => {
        const io = getIO();
        const callId = `${socket.user._id}_${recipientId}_${Date.now()}`;

        io.to(`user_${recipientId}`).emit("call:incoming", {
            callId,
            from: socket.user._id,
            type,
            status: "ringing" as TCallStatus,
        });
    });

    // ✅ Accept / Answer call (with WebRTC offer/answer)
    socket.on("call:signal", (data: { callId: string; targetUserId: string; signal: any }) => {
        const io = getIO();
        const aftercall = io.to(`user_${data.targetUserId}`).emit("call:signal", {
            callId: data.callId,
            from: socket.user?._id,
            signal: data.signal,
        });
        console.log("Call signal sent:", aftercall);
    });

    // ✅ Reject call
    socket.on("call:reject", ({ callId, targetUserId }: { callId: string; targetUserId: string }) => {
        const io = getIO();
        const rejectcall = io.to(`user_${targetUserId}`).emit("call:rejected", {
            callId,
            from: socket.user?._id,
            status: "rejected" as TCallStatus,
        });
        console.log("Call rejected:", rejectcall);
    });

    // ✅ Hangup call
    socket.on("call:hangup", ({ callId, targetUserId }: { callId: string; targetUserId: string }) => {
        const io = getIO();
        const hangup = io.to(`user_${targetUserId}`).emit("call:ended", {
            callId,
            from: socket.user?._id,
            status: "completed" as TCallStatus,
        });
        console.log("Call ended:", hangup);
    });

    // ✅ Missed call (auto-mark when user doesn’t answer)
    socket.on("call:missed", ({ callId, targetUserId }: { callId: string; targetUserId: string }) => {
        const io = getIO();
        const missedCall = io.to(`user_${targetUserId}`).emit("call:missed", {
            callId,
            from: socket.user?._id,
            status: "missed" as TCallStatus,
        });
        console.log("Missed call:", missedCall);
    });
};
