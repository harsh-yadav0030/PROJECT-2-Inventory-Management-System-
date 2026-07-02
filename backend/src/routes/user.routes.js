import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
    getAllEmployees,
    getAllManagers,
    getUserById,
    updateUser,
    updateUserStatus,
} from "../controllers/user.controller.js";

const userRouter=Router();

/**
 * Employee Management Routes
 * 
 * @route   GET /api/v1/users/employees
 * @access  SUPER_ADMIN, MANAGER
 * @desc    Retrieve employee records.
 *          - SUPER_ADMIN can view all employees.
 *          - MANAGER can view only employees assigned to their location.
 */
userRouter.get(
  "/employees",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  getAllEmployees
);

/**
 * Manager Management Routes
 * @route   GET /api/v1/users/managers
 * @access  SUPER_ADMIN
 * @desc    Retrieve all registered managers in the organization.
 */
userRouter.get(
  "/managers",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  getAllManagers
);

/**
 * User Details Route
 * @route   GET /api/v1/users/:id
 * @access  SUPER_ADMIN
 * @desc    Retrieve a specific user's details using their unique ID.
 */
userRouter.get(
  "/:id",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  getUserById
);

/**
 * User Update Route
 * @route   PATCH /api/v1/users/:id
 * @access  SUPER_ADMIN
 * @desc    Update user information such as name, role or assigned location.
 */
userRouter.patch(
  "/:id",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  updateUser
);

/**
 * User Status Management Route
 * @route   PATCH /api/v1/users/:id/status
 * @access  SUPER_ADMIN
 * @desc    Activate or deactivate a user account (soft delete).
 */

userRouter.patch(
  "/:id/status",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  updateUserStatus
);

export default userRouter;


