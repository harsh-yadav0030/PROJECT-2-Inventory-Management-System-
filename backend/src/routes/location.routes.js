import { Router } from "express";
import { createLocation } from "../controllers/location.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const locationRouter = Router();

//only SUPER_ADMIN can make Locations
locationRouter.post(
  "/",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  createLocation,
);

export default locationRouter;
