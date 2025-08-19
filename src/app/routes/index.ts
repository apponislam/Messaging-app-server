import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { messageRoutes } from "../modules/messages/message.routes";
import { notificationRoutes } from "../modules/notifications/notification.routes";
import { userRoutes } from "../modules/users/user.routes";
import { CallRoutes } from "../modules/call/call.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/message",
        route: messageRoutes,
    },
    {
        path: "/notification",
        route: notificationRoutes,
    },
    {
        path: "/user",
        route: userRoutes,
    },
    {
        path: "/call",
        route: CallRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
