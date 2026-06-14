import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const options = {
  httpOnly: true,
  secure: true,
};

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
                    user: loggedInUser
                },
                "User logged in successfully"
        )
    )
});


const getCurrentUser = asyncHandler(
  async (req, res) => {
    return res.status(200).json(
      new ApiResponse(
        200,
        req.user,
        "Current user fetched successfully"
      )
    );
  }
);


export { generateAccessAndRefreshTokens, registerUser, loginUser ,getCurrentUser};
