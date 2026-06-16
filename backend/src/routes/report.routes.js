import { Router } from "express";
import {
  getTransactionReport,
  getInventoryReport,
  getLowStockReport,
} from "../controllers/report.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { reportFilter } from "../middleware/report.middleware.js";

const reportRouter = Router();
reportRouter.get(
  "/inventory",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN", "MANAGER"),
  reportFilter,
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
  reportFilter,
  getLowStockReport,
);


export default reportRouter;
