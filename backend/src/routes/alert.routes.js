import { Router } from "express";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
  resolveAlert,
  getActiveAlerts,
  getAllAlerts,
} from "../controllers/alert.controller.js";

const alertRouter = new Router();

alertRouter.get("/", verifyJwt, getAllAlerts);
alertRouter.get("/active", verifyJwt, getActiveAlerts);
alertRouter.patch(
  "/:id/resolve",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  resolveAlert,
);

export default alertRouter;
