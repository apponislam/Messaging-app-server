// src/controllers/call.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CallServices } from "./call.services";

const createCall = catchAsync(async (req: Request, res: Response) => {
    const initiatorId = req.user._id; // comes from auth middleware
    const call = await CallServices.createCall(initiatorId, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Call created successfully",
        data: call,
    });
});

const updateCall = catchAsync(async (req: Request, res: Response) => {
    const { callId } = req.params;
    const call = await CallServices.updateCall(callId, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Call updated successfully",
        data: call,
    });
});

const getCall = catchAsync(async (req: Request, res: Response) => {
    const { callId } = req.params;
    const call = await CallServices.getCallById(callId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Call retrieved successfully",
        data: call,
    });
});

const getUserCalls = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const calls = await CallServices.getUserCalls(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User calls retrieved successfully",
        data: calls,
    });
});

const deleteCall = catchAsync(async (req: Request, res: Response) => {
    const { callId } = req.params;
    await CallServices.deleteCall(callId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Call deleted successfully",
        data: null,
    });
});

export const CallController = {
    createCall,
    updateCall,
    getCall,
    getUserCalls,
    deleteCall,
};
