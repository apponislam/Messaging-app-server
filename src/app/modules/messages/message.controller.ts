import { Request, Response } from "express";
import { messageServices } from "./message.services";
import { notificationServices } from "../notifications/notifications.services";
import { getIO } from "../../socket";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { MessageModel } from "./message.model";
import { NotificationModel } from "../notifications/notification.model";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const sender = req.user._id;
    const { receiver, content } = req.body;

    const message = await messageServices.createMessage({ sender, receiver, content });

    const notif = await notificationServices.createSimple(receiver, "message", `New message from ${req.user.name}`);

    const populatedNotif = await NotificationModel.findById(notif._id).populate("userId", "_id name avatarUrl").lean();

    const populatedMessage = await MessageModel.findById(message._id).populate("sender", "_id name email username avatarUrl").populate("receiver", "_id name email username avatarUrl").lean();

    const io = getIO();
    io.to(`user_${receiver}`).emit("newMessage", populatedMessage);
    io.to(`user_${sender}`).emit("newMessage", populatedMessage);

    // Send notification only to receiver
    // io.to(`user_${sender}`).emit("newNotification", notif);
    io.to(`user_${receiver}`).emit("newNotification", populatedNotif);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Message sent successfully",
        data: { populatedMessage, populatedNotif },
    });
});

const getMessagesWithUser = catchAsync(async (req: Request, res: Response) => {
    const otherUserId = req.params.userId;
    const data = await messageServices.getMessagesBetweenUsers(req.user.id, otherUserId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully",
        data,
    });
});

export const messageController = {
    sendMessage,
    getMessagesWithUser,
};
