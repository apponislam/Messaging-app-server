import { Request, Response } from "express";
import { messageServices } from "./message.services";
import { notificationServices } from "../notifications/notifications.services";
import { getIO } from "../../socket";

export const sendMessage = async (req: Request, res: Response) => {
    const sender = req.user.id;
    const { receiver, content } = req.body;

    const message = await messageServices.createMessage({ sender, receiver, content });

    // Create and emit notification
    const notif = await notificationServices.createSimple(receiver, "message", `New message from ${req.user.username}`);

    const io = getIO();
    io.to(receiver).emit("newMessage", message);
    io.to(receiver).emit("newNotification", notif);

    res.status(201).json({ success: true, data: message });
};

export const getMessagesWithUser = async (req: Request, res: Response) => {
    const otherUserId = req.params.userId;
    const data = await messageServices.getMessagesBetweenUsers(req.user.id, otherUserId);
    res.json({ success: true, data });
};

export const messageController = {
    sendMessage,
    getMessagesWithUser,
};
