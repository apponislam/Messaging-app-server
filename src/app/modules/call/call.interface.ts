import { Types } from "mongoose";

export type TCallStatus = "initiated" | "ongoing" | "completed" | "missed" | "rejected";
export type TCallType = "audio" | "video";

export interface ICallParticipant {
    userId: Types.ObjectId;
    joinedAt: Date;
    leftAt?: Date;
}

export interface ICall {
    _id?: Types.ObjectId;
    participants: ICallParticipant[];
    startedAt: Date;
    endedAt?: Date;
    duration?: number;
    status: TCallStatus;
    type: TCallType;
    metadata?: {
        resolution?: string;
        codec?: string;
    };
}

export interface CreateCallPayload {
    recipientId: string;
    type: TCallType;
}

export interface UpdateCallPayload {
    status?: TCallStatus;
    endedAt?: Date;
    "participants.$[elem].joinedAt"?: Date;
    "participants.$[elem].leftAt"?: Date;
}
