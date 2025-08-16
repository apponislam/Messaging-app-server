import { Schema, model } from "mongoose";
import { IMessage } from "./message.interface";

const messageSchema = new Schema<IMessage>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sender is required"],
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Receiver is required"],
        },
        content: {
            type: String,
            required: [true, "Message content is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const MessageModel = model<IMessage>("Message", messageSchema);
