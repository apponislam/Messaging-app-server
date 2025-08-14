import { Request, Response } from "express";
import { notificationServices } from "./notifications.services";

const getMyNotifications = async (req: Request, res: Response) => {
    const data = await notificationServices.getUserNotifications(req.user.id);
    res.json({ success: true, data });
};

const markAsRead = async (req: Request, res: Response) => {
    const updated = await notificationServices.markAsRead(req.params.id, req.user.id);
    res.json({ success: true, data: updated });
};

export const notificationControllers = {
    getMyNotifications,
    markAsRead,
};
