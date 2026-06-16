import { Router } from "express";
import { createLocation,getAllLocations,getLocationById,updateLocation,deleteLocation} from "../controllers/location.controller.js";
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

locationRouter.get(
  "/",
  verifyJwt,
  getAllLocations,
);

locationRouter.get(
    "/:id",
    verifyJwt,
    getLocationById
);

locationRouter.patch(
    "/:id",
    verifyJwt,
    authorizeRoles("SUPER_ADMIN"),
    updateLocation
);

export default locationRouter;
