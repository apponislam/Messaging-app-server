import { Schema, model } from "mongoose";
import { ICall } from "./call.interface";

const CallSchema = new Schema<ICall>(
    {
        participants: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                joinedAt: { type: Date, default: Date.now },
                leftAt: Date,
            },
        ],
        startedAt: { type: Date, default: Date.now },
        endedAt: Date,
        duration: Number,
        status: {
            type: String,
            enum: ["initiated", "ongoing", "completed", "missed", "rejected"],
            default: "initiated",
        },
        type: {
            type: String,
            enum: ["audio", "video"],
            required: true,
        },
        metadata: {
            resolution: String,
            codec: String,
        },
    },
    { timestamps: true }
);

export const callModel = model<ICall>("Call", CallSchema);
