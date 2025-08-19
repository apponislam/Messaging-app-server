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
exports.CallController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const call_services_1 = require("./call.services");
const createCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const initiatorId = req.user._id; // comes from auth middleware
    const call = yield call_services_1.CallServices.createCall(initiatorId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Call created successfully",
        data: call,
    });
}));
const updateCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callId } = req.params;
    const call = yield call_services_1.CallServices.updateCall(callId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Call updated successfully",
        data: call,
    });
}));
const getCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callId } = req.params;
    const call = yield call_services_1.CallServices.getCallById(callId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Call retrieved successfully",
        data: call,
    });
}));
const getUserCalls = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const calls = yield call_services_1.CallServices.getUserCalls(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User calls retrieved successfully",
        data: calls,
    });
}));
const deleteCall = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { callId } = req.params;
    yield call_services_1.CallServices.deleteCall(callId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Call deleted successfully",
        data: null,
    });
}));
exports.CallController = {
    createCall,
    updateCall,
    getCall,
    getUserCalls,
    deleteCall,
};
