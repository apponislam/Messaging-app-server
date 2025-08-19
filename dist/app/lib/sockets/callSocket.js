"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCallSocket = void 0;
const socket_1 = require("../../socket");
const initCallSocket = (socket) => {
    if (!socket.user)
        return;
    // ✅ Start a call
    socket.on("call:start", ({ recipientId, type }) => {
        const io = (0, socket_1.getIO)();
        const callId = `${socket.user._id}_${recipientId}_${Date.now()}`;
        io.to(`user_${recipientId}`).emit("call:incoming", {
            callId,
            from: socket.user._id,
            type,
            status: "ringing",
        });
    });
    // ✅ Accept / Answer call (with WebRTC offer/answer)
    socket.on("call:signal", (data) => {
        var _a;
        const io = (0, socket_1.getIO)();
        const aftercall = io.to(`user_${data.targetUserId}`).emit("call:signal", {
            callId: data.callId,
            from: (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id,
            signal: data.signal,
        });
        console.log("Call signal sent:", aftercall);
    });
    // ✅ Reject call
    socket.on("call:reject", ({ callId, targetUserId }) => {
        var _a;
        const io = (0, socket_1.getIO)();
        const rejectcall = io.to(`user_${targetUserId}`).emit("call:rejected", {
            callId,
            from: (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id,
            status: "rejected",
        });
        console.log("Call rejected:", rejectcall);
    });
    // ✅ Hangup call
    socket.on("call:hangup", ({ callId, targetUserId }) => {
        var _a;
        const io = (0, socket_1.getIO)();
        const hangup = io.to(`user_${targetUserId}`).emit("call:ended", {
            callId,
            from: (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id,
            status: "completed",
        });
        console.log("Call ended:", hangup);
    });
    // ✅ Missed call (auto-mark when user doesn’t answer)
    socket.on("call:missed", ({ callId, targetUserId }) => {
        var _a;
        const io = (0, socket_1.getIO)();
        const missedCall = io.to(`user_${targetUserId}`).emit("call:missed", {
            callId,
            from: (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id,
            status: "missed",
        });
        console.log("Missed call:", missedCall);
    });
};
exports.initCallSocket = initCallSocket;
