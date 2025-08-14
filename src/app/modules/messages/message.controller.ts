import { Request, Response } from "express";
import { messageServices } from "./message.services";
import { notificationServices } from "../notifications/notifications.services";
import { getIO } from "../../socket";

const sendMessage = async (req: Request, res: Response) => {
    const sender = req.user._id;
    const { receiver, content } = req.body;

    const message = await messageServices.createMessage({ sender, receiver, content });

    const notif = await notificationServices.createSimple(receiver, "message", `New message from ${sender}`);

    const io = getIO();
    io.emit(`newMessage::${receiver}`, message);
    io.emit(`newNotification::${receiver}`, notif);
    // io.emit("newNotification", notif);

    res.status(201).json({ success: true, data: message });
};

const getMessagesWithUser = async (req: Request, res: Response) => {
    const otherUserId = req.params.userId;
    const data = await messageServices.getMessagesBetweenUsers(req.user.id, otherUserId);
    res.json({ success: true, data });
};

export const messageController = {
    sendMessage,
    getMessagesWithUser,
};
