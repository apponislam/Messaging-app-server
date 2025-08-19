import { CreateCallPayload, ICall, UpdateCallPayload } from "./call.interface";
import { callModel } from "./call.model";
import { Types } from "mongoose";

const createCall = async (callerId: string, payload: CreateCallPayload): Promise<ICall> => {
    const call = await callModel.create({
        participants: [{ userId: new Types.ObjectId(callerId), joinedAt: new Date() }, { userId: new Types.ObjectId(payload.recipientId) }],
        type: payload.type,
        status: "initiated",
    });
    return call.toObject();
};

const updateCall = async (callId: string, payload: UpdateCallPayload, arrayFilters?: Record<string, unknown>[]): Promise<ICall | null> => {
    const updates: Record<string, any> = {};

    // Standard updates
    if (payload.status) updates.status = payload.status;
    if (payload.endedAt) updates.endedAt = payload.endedAt;

    // Special participant updates
    if (payload["participants.$[elem].joinedAt"]) {
        updates["participants.$[elem].joinedAt"] = payload["participants.$[elem].joinedAt"];
    }
    if (payload["participants.$[elem].leftAt"]) {
        updates["participants.$[elem].leftAt"] = payload["participants.$[elem].leftAt"];
    }

    // Handle duration calculation
    if (payload.status === "completed") {
        updates.endedAt = updates.endedAt || new Date();
        const call = await callModel.findById(callId);
        if (call?.startedAt) {
            updates.duration = Math.floor((updates.endedAt.getTime() - call.startedAt.getTime()) / 1000);
        }
    }

    return callModel.findByIdAndUpdate(callId, { $set: updates }, { new: true, arrayFilters }).lean();
};

const getCallById = async (callId: string): Promise<ICall | null> => {
    return callModel.findById(callId).lean();
};

const getUserCalls = async (userId: string): Promise<ICall[]> => {
    return callModel.find({ "participants.userId": userId }).sort({ startedAt: -1 }).lean();
};

const endCall = async (callId: string): Promise<ICall | null> => {
    return updateCall(callId, {
        status: "completed",
        endedAt: new Date(),
    });
};

export const callServices = {
    createCall,
    updateCall,
    getCallById,
    getUserCalls,
    endCall,
};
