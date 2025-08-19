import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { callServices } from "./call.services";
import { getCallSocket } from "../../lib/sockets/callSocket";

const createCallHandler = catchAsync(async (req: Request, res: Response) => {
    const call = await callServices.createCall(req.user._id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Call initiated successfully",
        data: call,
    });
});

const updateCallHandler = catchAsync(async (req: Request, res: Response) => {
    const call = await callServices.updateCall(req.params.callId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Call updated successfully",
        data: call,
    });
});

const getCallHandler = catchAsync(async (req: Request, res: Response) => {
    const call = await callServices.getCallById(req.params.callId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Call retrieved successfully",
        data: call,
    });
});

const getUserCallsHandler = catchAsync(async (req: Request, res: Response) => {
    const calls = await callServices.getUserCalls(req.params.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User calls retrieved successfully",
        data: calls,
    });
});

const endCallHandler = catchAsync(async (req: Request, res: Response) => {
    const call = await callServices.endCall(req.params.callId);
    getCallSocket().to(req.params.callId).emit("call-ended");

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Call ended successfully",
        data: call,
    });
});

export const callControllers = {
    createCallHandler,
    updateCallHandler,
    getCallHandler,
    getUserCallsHandler,
    endCallHandler,
};
