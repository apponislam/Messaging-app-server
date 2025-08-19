"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["message", "friend_request", "system"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
exports.NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
