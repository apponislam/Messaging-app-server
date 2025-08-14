import config from "../../config";
import AppError from "../../errors/AppError";
import { jwtHelper } from "../../helpers/jwtHelpers";
import { userNameGenerator } from "../../utils/usernameGenerator";
import { TUser } from "./auth.interface";
import { userModel } from "./auth.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

const createUserIntoDB = async (payload: Omit<TUser, "username">) => {
    const username = await userNameGenerator(payload.name);

    const user = await userModel.create({
        ...payload,
        username,
    });

    const jwtPayload = {
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
    };

    const accessToken = jwtHelper.generateToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expire as string);

    const refreshToken = jwtHelper.generateToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expire as string);

    const { password, ...userWithoutPassword } = user.toObject();
    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
};

const loginUser = async (payload: { email: string; password: string }) => {
    const user = await userModel.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new AppError(401, "Invalid credentials");
    }

    const jwtPayload = {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
    };

    const accessToken = jwtHelper.generateToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expire as string);

    const refreshToken = jwtHelper.generateToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expire as string);

    return {
        user: user,
        accessToken,
        refreshToken,
    };
};

export const authServices = {
    createUserIntoDB,
    loginUser,
};
