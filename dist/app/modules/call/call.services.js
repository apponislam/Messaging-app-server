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
exports.CallServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const call_model_1 = require("./call.model");
const createCall = (initiatorId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const callId = `${initiatorId}_${payload.recipientId}_${Date.now()}`;
    return yield call_model_1.callModel.create({
        callId,
        initiator: new mongoose_1.default.Types.ObjectId(initiatorId),
        participants: [
            {
                userId: new mongoose_1.default.Types.ObjectId(initiatorId),
                socketId: "",
                status: "joined",
                joinedAt: new Date(),
            },
            {
                userId: new mongoose_1.default.Types.ObjectId(payload.recipientId),
                socketId: "",
                status: "invited",
            },
        ],
        type: payload.type,
        status: "ringing",
        startedAt: new Date(),
    });
});
const updateCall = (callId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield call_model_1.callModel.findOneAndUpdate({ callId }, payload, { new: true });
});
const getCallById = (callId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield call_model_1.callModel.findOne({ callId }).populate("participants.userId", "name email avatarUrl");
});
const getUserCalls = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield call_model_1.callModel.find({ "participants.userId": userId }).sort({ createdAt: -1 }).limit(50);
});
const deleteCall = (callId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield call_model_1.callModel.findOneAndDelete({ callId });
});
exports.CallServices = {
    createCall,
    updateCall,
    getCallById,
    getUserCalls,
    deleteCall,
};
