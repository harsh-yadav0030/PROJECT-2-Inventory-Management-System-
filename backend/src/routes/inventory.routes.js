import { Router } from "express";
import {
  stockIn,
  stockOut,
  getInventory,
  getInventoryByLocation,
  transferInventory,
  getInventoryByProduct
} from "../controllers/inventory.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const inventoryRouter = Router();

/**
 * @desc    Add stock to a warehouse
 * @route   POST /api/v1/inventory/stock-in
 * @access  Private (SUPER_ADMIN, MANAGER)
 */
inventoryRouter.post(
  "/stock-in",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  stockIn,
);

/**
 * @desc    Remove stock from a warehouse
 * @route   POST /api/v1/inventory/stock-out
 * @access  Private (SUPER_ADMIN, MANAGER)
 */
inventoryRouter.post(
  "/stock-out",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  stockOut,
);

/**
 * @desc    Get inventory of all warehouse locations
 * @route   GET /api/v1/inventory
 * @access  Private
 */
inventoryRouter.get(
  "/",
  verifyJwt,
  getInventory
);

/**
 * @desc    Get inventory of a specific warehouse location
 * @route   GET /api/v1/inventory/location/:locationId
 * @access  Private
 */
inventoryRouter.get(
  "/location/:locationId",
  verifyJwt,
  getInventoryByLocation
);

/**
 * @desc    Transfer inventory between warehouse locations
 * @route   POST /api/v1/inventory/transfer
 * @access  Private (SUPER_ADMIN, MANAGER)
 */
inventoryRouter.post(
  "/transfer",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  transferInventory,
);

/**
 * @desc    Get inventory of a specific product across all warehouse locations
 * @route   GET /api/v1/inventory/product/:productId
 * @access  Private
 */
inventoryRouter.get(
  "/product/:productId",
  verifyJwt,
  getInventoryByProduct
);

export default inventoryRouter;