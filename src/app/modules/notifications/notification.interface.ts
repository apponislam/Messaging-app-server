export type NotificationType = "message" | "friend_request" | "system";

export interface INotification {
    userId: string;
    type: NotificationType;
    message: string;
    read?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
