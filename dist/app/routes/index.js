"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const message_routes_1 = require("../modules/messages/message.routes");
const notification_routes_1 = require("../modules/notifications/notification.routes");
const user_routes_1 = require("../modules/users/user.routes");
const call_routes_1 = require("../modules/call/call.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/message",
        route: message_routes_1.messageRoutes,
    },
    {
        path: "/notification",
        route: notification_routes_1.notificationRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/call",
        route: call_routes_1.CallRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
