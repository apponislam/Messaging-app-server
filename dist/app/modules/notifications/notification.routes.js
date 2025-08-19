"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const notification_controllers_1 = require("./notification.controllers");
const router = express_1.default.Router();
router.get("/", auth_1.default, notification_controllers_1.notificationControllers.getMyNotifications);
router.patch("/:id/read", auth_1.default, notification_controllers_1.notificationControllers.markAsRead);
exports.notificationRoutes = router;
