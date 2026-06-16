import { Router } from "express";
import {
  stockIn,
  stockOut,
  getInventory,
  getInventoryByLocation,
  transferInventory
} from "../controllers/inventory.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const inventoryRouter = Router();
inventoryRouter.post(
  "/stock-in",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  stockIn,
);

inventoryRouter.post(
  "/stock-out",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  stockOut,
);

inventoryRouter.get("/", verifyJwt, getInventory);

inventoryRouter.get("/location/:locationId", verifyJwt, getInventoryByLocation);

inventoryRouter.post(
  "/transfer",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  transferInventory,
);

export default inventoryRouter;
