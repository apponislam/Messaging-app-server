import { INotification, NotificationType } from "./notification.interface";
import { NotificationModel } from "./notification.model";

const createNotification = async (data: INotification) => {
    return await NotificationModel.create(data);
};

const createSimple = async (userId: string, type: NotificationType, message: string) => {
    return await NotificationModel.create({ userId, type, message });
};

const getUserNotifications = async (userId: string) => {
    return await NotificationModel.find({ userId }).sort({ createdAt: -1 });
};

const markAsRead = async (id: string, userId: string) => {
    return await NotificationModel.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
};

export const notificationServices = {
    createNotification,
    createSimple,
    getUserNotifications,
    markAsRead,
};
