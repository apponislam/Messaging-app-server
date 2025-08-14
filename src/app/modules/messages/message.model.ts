import { Schema, model } from "mongoose";
import { IMessage } from "./message.interface";

const messageSchema = new Schema<IMessage>(
    {
        sender: { type: String, required: true },
        receiver: { type: String, required: true },
        content: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
