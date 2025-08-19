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
exports.messageServices = void 0;
const message_model_1 = require("./message.model");
const createMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield message_model_1.MessageModel.create(data);
});
const getMessagesBetweenUsers = (userA, userB) => __awaiter(void 0, void 0, void 0, function* () {
    return yield message_model_1.MessageModel.find({
        $or: [
            { sender: userA, receiver: userB },
            { sender: userB, receiver: userA },
        ],
    })
        .sort({ createdAt: 1 })
        .populate("sender", "_id name email username avatarUrl")
        .populate("receiver", "_id name email username avatarUrl");
});
exports.messageServices = {
    createMessage,
    getMessagesBetweenUsers,
};
