import { Request, Response } from "express";
import { notificationServices } from "./notifications.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const data = await notificationServices.getUserNotifications(req.user._id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Notifications retrieved successfully",
        data,
    });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
    const updated = await notificationServices.markAsRead(req.params.id, req.user._id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Notification marked as read",
        data: updated,
    });
});

export const notificationControllers = {
    getMyNotifications,
    markAsRead,
};
