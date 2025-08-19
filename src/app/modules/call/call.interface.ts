import { Types } from "mongoose";

export type TCallStatus = "ringing" | "ongoing" | "completed" | "missed" | "rejected" | "cancelled";

export type TCallType = "audio" | "video";

export interface ICallParticipant {
    userId: Types.ObjectId;
    socketId: string;
    status: "invited" | "joined" | "rejected" | "missed";
    joinedAt?: Date;
    leftAt?: Date;
}

export interface ICall {
    _id: Types.ObjectId;
    callId: string; // Unique identifier for WebRTC peer connection
    initiator: Types.ObjectId;
    participants: ICallParticipant[];
    type: TCallType;
    status: TCallStatus;
    startedAt: Date;
    endedAt?: Date;
    duration?: number;

    // Optional signaling data
    offer?: any; // WebRTC offer
    answers?: Record<string, any>; // userId -> answer
    iceCandidates?: Record<string, any[]>; // userId -> ICE candidates
}

// For starting a call
export interface CreateCallPayload {
    recipientId: string;
    type: TCallType;
}

// For updating call lifecycle
export interface UpdateCallPayload {
    status?: TCallStatus;
    endedAt?: Date;
    duration?: number;
}
