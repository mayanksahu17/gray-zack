import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utills/ApiError";
import { asyncHandler } from "../utills/asyncHandler";
import jwt from "jsonwebtoken";
import { Administrator } from "../models/administrator.model";

// Extend Request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// @ts-ignore
export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || (req.header("Authorization")?.replace("Bearer ", "") ?? "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string } | null;

        if (!decodedToken) {
            throw new ApiError(401, "Invalid Access Token");
        }

        const user = await Administrator.findById(decodedToken?.id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next(); 
    } catch (error : any) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
