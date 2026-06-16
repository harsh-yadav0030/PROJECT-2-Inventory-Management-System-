import { Router } from "express";

import {
    getDashboardStats,
    getRecentTransactions,
    getLowStockProducts,
    getLocationDashboardStats
} from "../controllers/dashboard.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get(
    "/stats",
    verifyJwt,
    getDashboardStats
);

dashboardRouter.get(
    "/recent-transactions",
    verifyJwt,
    getRecentTransactions
);

dashboardRouter.get(
    "/low-stock",
    verifyJwt,
    getLowStockProducts
);

dashboardRouter.get(
  "/location/:locationId",
  verifyJwt,
  getLocationDashboardStats
);

export default dashboardRouter;