import mongoose from "mongoose";

export type NotificationType = "message" | "friend_request" | "system";

export interface INotification {
    userId: mongoose.Types.ObjectId;
    type: NotificationType;
    message: string;
    read?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
