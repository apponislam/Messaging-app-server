import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import config from "../config";
import userModel from "../modules/auth/auth.model";

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("Authentication failed: No token provided");
    }

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as { email: string };
    // console.log(decoded);

    const user = await userModel.findOne({ email: decoded?.email });
    if (!user) {
        throw new Error("Authentication failed: User not found");
    }

    req.user = user;
    next();
});

export default auth;
