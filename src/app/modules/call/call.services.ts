import mongoose from "mongoose";
import { CreateCallPayload, UpdateCallPayload } from "./call.interface";
import { callModel } from "./call.model";

const createCall = async (initiatorId: string, payload: CreateCallPayload) => {
    const callId = `${initiatorId}_${payload.recipientId}_${Date.now()}`;
    return await callModel.create({
        callId,
        initiator: new mongoose.Types.ObjectId(initiatorId),
        participants: [
            {
                userId: new mongoose.Types.ObjectId(initiatorId),
                socketId: "",
                status: "joined",
                joinedAt: new Date(),
            },
            {
                userId: new mongoose.Types.ObjectId(payload.recipientId),
                socketId: "",
                status: "invited",
            },
        ],
        type: payload.type,
        status: "ringing",
        startedAt: new Date(),
    });
};

const updateCall = async (callId: string, payload: UpdateCallPayload) => {
    return await callModel.findOneAndUpdate({ callId }, payload, { new: true });
};

const getCallById = async (callId: string) => {
    return await callModel.findOne({ callId }).populate("participants.userId", "name email avatarUrl");
};

const getUserCalls = async (userId: string) => {
    return await callModel.find({ "participants.userId": userId }).sort({ createdAt: -1 }).limit(50);
};

const deleteCall = async (callId: string) => {
    return await callModel.findOneAndDelete({ callId });
};

export const CallServices = {
    createCall,
    updateCall,
    getCallById,
    getUserCalls,
    deleteCall,
};
