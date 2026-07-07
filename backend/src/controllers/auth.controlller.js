import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOTP } from "../utils/otp.js";
import { verifyOTP } from "../utils/verifyOTP.js";
import {sendEmail} from "../utils/sendEmail.js"
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};
//lax means send cookies through same site or authorised site
// none means send request (cross-site request)

//generate and rotate access and refresh Token
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something went wrong while generating tokens",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, role, assignedLocation } = req.body;

  if (!fullname || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check existing user
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // SUPER_ADMIN can have null location
  // MANAGER and EMPLOYEE must belong to a location
  if (role !== "SUPER_ADMIN" && !assignedLocation) {
    throw new ApiError(400, "Assigned location is required");
  }

  // Create user
  const user = await User.create({
    fullname,
    email,
    password,
    role,
    assignedLocation,
  });

  // Fetch created user without password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // User is not added in database so there is some problem
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    email,
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // user left the position and not workig currently
  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive");
  }

  // validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect credentials");
  }

  // access and refresh Token generated successfully
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  // because we don't need password and refresh token for cookie so we fetched the user again
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged in successfully",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const user = req.user;
  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
    req.user._id,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: req.user,
        },
        "Access token refreshed successfully",
      ),
    );
});

const sendLoginOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check whether email is provided
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // find user
  const user = await User.findOne({ email });

  // Check whether user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check whether account is active
  if (!user.isActive) {
    throw new ApiError(404, "User not Active");
  }

  // Generate OTP
  const { otp, hashedOTP } = generateOTP();

  // Store hashed OTP
  user.otp = {
    code: hashedOTP,
    purpose: "LOGIN",
    expiry: new Date(
      Date.now() + 5 * 60 * 1000, // 5 minutes
    ),
  };

  // Save user
  await user.save({
    validateBeforeSave: false,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Inventory Management System - Login OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });
  } catch (error) {
     console.log(error);
    //unset otp
    user.otp = {
      code: null,
      purpose: null,
      expiry: null,
    };

    await user.save({
      validateBeforeSave: false,
    });

    throw new ApiError(500, "Failed to send OTP");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const verifyLoginOTP = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(
            400,
            "Email and OTP are required"
        );
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        // Find user
        const user = await User.findOne({
            email
        }).session(session);

        // Check whether user exists
        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        // Check whether account is active
        if (!user.isActive) {
            throw new ApiError(
                403,
                "User account is inactive"
            );
        }

        // Check whether OTP exists
        if (!user.otp.code) {
            throw new ApiError(
                400,
                "No OTP found. Please request a new OTP."
            );
        }

        // Check OTP purpose
        if (user.otp.purpose !== "LOGIN") {
            throw new ApiError(
                400,
                "Invalid OTP purpose"
            );
        }

        // Check OTP expiry
        if (user.otp.expiry < Date.now()) {
            throw new ApiError(
                400,
                "OTP has expired"
            );
        }

        // Verify OTP
        const isValidOTP = verifyOTP(
            otp,
            user.otp.code
        );

        if (!isValidOTP) {
            throw new ApiError(
                400,
                "Invalid OTP"
            );
        }

        // Generate Tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;

        // Clear OTP
        user.otp = {
            code: null,
            purpose: null,
            expiry: null,
        };

        await user.save({
            session,
            validateBeforeSave: false,
        });

        await session.commitTransaction();

          return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Login successful"
                )
            );

    } catch (error) {
        await session.abortTransaction();
        throw error;

    } finally {
        await session.endSession();

    }  
});

export {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  sendLoginOTP,
  verifyLoginOTP
};
