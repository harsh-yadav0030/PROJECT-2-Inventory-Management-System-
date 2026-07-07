import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  sendLoginOTP,
  verifyLoginOTP,
} from "../controllers/auth.controlller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { allowFirstSuperAdmin } from "../middleware/allowFirstSuperAdmin.middleware.js";
import { verifyRefreshToken } from "../middleware/verifyRefreshToken.middleware.js";
const authRouter = Router();

authRouter.post(
  "/register",
  allowFirstSuperAdmin,
  authorizeRoles("SUPER_ADMIN"),
  registerUser,
);

authRouter.post("/login", loginUser);
authRouter.get("/current-user", verifyJwt, getCurrentUser);
authRouter.post("/logout", verifyJwt, logoutUser);
authRouter.post("/refresh-token", verifyRefreshToken, refreshAccessToken);
authRouter.post("/send-login-otp", sendLoginOTP);
authRouter.post("/verify-login-otp", verifyLoginOTP);

export default authRouter;
