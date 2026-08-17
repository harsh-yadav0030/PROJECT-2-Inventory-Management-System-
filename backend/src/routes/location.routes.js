import { Router } from "express";
import { createLocation,getAllLocations,getLocationById,updateLocation,deleteLocation} from "../controllers/location.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const locationRouter = Router();
//only SUPER_ADMIN can make Locations

/**
 * @desc    Create a new warehouse location
 * @route   POST /api/v1/locations
 * @access  Private (SUPER_ADMIN)
 */
locationRouter.post(
  "/",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  createLocation,
);

/**
 * @desc    Get all warehouse locations
 * @route   GET /api/v1/locations
 * @access  Private
 */
locationRouter.get(
  "/",
  verifyJwt,
  getAllLocations,
);

/**
 * @desc    Get a warehouse location by ID
 * @route   GET /api/v1/locations/:id
 * @access  Private
 */
locationRouter.get(
  "/:id",
  verifyJwt,
  getLocationById,
);

/**
 * @desc    Update warehouse location details
 * @route   PATCH /api/v1/locations/:id
 * @access  Private (SUPER_ADMIN)
 */
locationRouter.patch(
  "/:id",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  updateLocation,
);

/**
 * @desc    Deactivate (Soft Delete) a warehouse location
 * @route   DELETE /api/v1/locations/:id
 * @access  Private (SUPER_ADMIN)
 */
locationRouter.delete(
  "/:id",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  deleteLocation,
);

export default locationRouter;