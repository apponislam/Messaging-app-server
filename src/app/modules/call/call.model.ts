import mongoose, { Schema, Document, Model } from "mongoose";
import { ICall, ICallParticipant } from "./call.interface";

export interface ICallDocument extends Omit<ICall, "_id">, Document {
    _id: mongoose.Types.ObjectId;
}

export interface ICallModel extends Model<ICallDocument> {}

const CallParticipantSchema = new Schema<ICallParticipant>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        socketId: { type: String, required: true },
        status: {
            type: String,
            enum: ["invited", "joined", "rejected", "missed"],
            default: "invited",
        },
        joinedAt: { type: Date },
        leftAt: { type: Date },
    },
    { _id: false }
);

const CallSchema = new Schema<ICallDocument>(
    {
        callId: { type: String, required: true, unique: true },
        initiator: { type: Schema.Types.ObjectId, ref: "User", required: true },
        participants: { type: [CallParticipantSchema], required: true },
        type: { type: String, enum: ["audio", "video"], required: true },
        status: {
            type: String,
            enum: ["ringing", "ongoing", "completed", "missed", "rejected", "cancelled"],
            default: "ringing",
        },
        startedAt: { type: Date, default: Date.now },
        endedAt: { type: Date },
        duration: { type: Number },

        // Optional signaling data
        offer: { type: Schema.Types.Mixed },
        answers: { type: Map, of: Schema.Types.Mixed, default: {} },
        iceCandidates: { type: Map, of: [Schema.Types.Mixed], default: {} },
    },
    { timestamps: true }
);

export const callModel: ICallModel = mongoose.models.Call || mongoose.model<ICallDocument, ICallModel>("Call", CallSchema);
