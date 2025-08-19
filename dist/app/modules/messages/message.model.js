"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"],
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver is required"],
    },
    content: {
        type: String,
        required: [true, "Message content is required"],
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.MessageModel = (0, mongoose_1.model)("Message", messageSchema);
