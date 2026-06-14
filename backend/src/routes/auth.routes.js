import { Router } from "express";
import {registerUser,loginUser,getCurrentUser} from "../controllers/auth.controlller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/current-user", verifyJwt, getCurrentUser);

export default authRouter;
