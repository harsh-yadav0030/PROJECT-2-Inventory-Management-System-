import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import dotenv from "dotenv";
dotenv.config()

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  // if token is not verified
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

  if(!user) { // either token expired or invalid token or blacklisted token now frontend reuests for refresh access token
    throw new ApiError(
      401,
      "Invalid access token"
    );
  }

  if(!user.isActive){
      throw new ApiError(
      403,
      "User account has been deactivated"
    );
  }

  req.user = user;
  next();

});


