import { Router } from "express";
import {
  getTransactionReport,
  getInventoryReport,
  getLowStockReport,
} from "../controllers/report.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const reportRouter = Router();
reportRouter.get(
  "/inventory",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  getInventoryReport,
);

reportRouter.get(
  "/transactions",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  getTransactionReport,
);

reportRouter.get(
  "/low-stock",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  getLowStockReport,
);


export default reportRouter;
