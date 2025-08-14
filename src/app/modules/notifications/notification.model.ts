import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
    {
        userId: { type: String, required: true },
        type: { type: String, enum: ["message", "friend_request", "system"], required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
);

export const NotificationModel = model<INotification>("Notification", notificationSchema);
