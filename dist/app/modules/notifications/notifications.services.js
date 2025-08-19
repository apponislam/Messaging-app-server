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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServices = void 0;
const notification_model_1 = require("./notification.model");
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield notification_model_1.NotificationModel.create(data);
});
const createSimple = (userId, type, message) => __awaiter(void 0, void 0, void 0, function* () {
    return yield notification_model_1.NotificationModel.create({ userId, type, message });
});
const getUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield notification_model_1.NotificationModel.find({ userId }).sort({ createdAt: -1 });
});
const markAsRead = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield notification_model_1.NotificationModel.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
});
exports.notificationServices = {
    createNotification,
    createSimple,
    getUserNotifications,
    markAsRead,
};
