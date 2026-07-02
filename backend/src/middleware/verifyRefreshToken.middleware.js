import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const verifyRefreshToken= asyncHandler(async(req,res,next)=>{
    const token =req.cookies?.refreshToken|| req.body?.refreshToken;
    if(!token){
        throw new ApiError(401, "Refresh token is required");
    }

    let decoded;

   try {
     decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
     );
    } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
    }

    //user fetch
    const user = await User.findById(decoded._id).select("-password +refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check whether user account is active
    if (!user.isActive) {
        throw new ApiError(403, "User account has been deactivated");
    }

    // Compare refresh tokens 
    if (user.refreshToken !== token) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
    user.refreshToken = undefined;
    req.user=user;

    next();
});