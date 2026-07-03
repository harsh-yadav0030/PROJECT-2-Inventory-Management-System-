import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import {asyncHandler} from "../utils/asynchandler.js"

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true, // remove space from corners
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "MANAGER", "EMPLOYEE"], // role can be out of these only
      default: "EMPLOYEE",
    },
    assignedLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true, //instead of deleting when a worker leaves we basically disable them as inactive
    },
    otp:{
       code: {
        type: String,
        default: null
      },
      purpose: {
        type: String,
        enum: [
            "LOGIN",
            "RESET_PASSWORD"
        ],
        default: null
      },
      expiry: {
        type: Date,
        default: null
      }
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return ;//idhar next tha
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
