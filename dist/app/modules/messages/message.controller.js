"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const message_services_1 = require("./message.services");
const notifications_services_1 = require("../notifications/notifications.services");
const socket_1 = require("../../socket");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const message_model_1 = require("./message.model");
const notification_model_1 = require("../notifications/notification.model");
const sendMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = req.user._id;
    const { receiver, content } = req.body;
    const message = yield message_services_1.messageServices.createMessage({ sender, receiver, content });
    const notif = yield notifications_services_1.notificationServices.createSimple(receiver, "message", `New message from ${req.user.name}`);
    const populatedNotif = yield notification_model_1.NotificationModel.findById(notif._id).populate("userId", "_id name avatarUrl").lean();
    const populatedMessage = yield message_model_1.MessageModel.findById(message._id).populate("sender", "_id name email username avatarUrl").populate("receiver", "_id name email username avatarUrl").lean();
    const io = (0, socket_1.getIO)();
    io.to(`user_${receiver}`).emit("newMessage", populatedMessage);
    io.to(`user_${sender}`).emit("newMessage", populatedMessage);
    // Send notification only to receiver
    // io.to(`user_${sender}`).emit("newNotification", notif);
    io.to(`user_${receiver}`).emit("newNotification", populatedNotif);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Message sent successfully",
        data: { populatedMessage, populatedNotif },
    });
}));
const getMessagesWithUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otherUserId = req.params.userId;
    const data = yield message_services_1.messageServices.getMessagesBetweenUsers(req.user.id, otherUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully",
        data,
    });
}));
exports.messageController = {
    sendMessage,
    getMessagesWithUser,
};
