import { Router } from "express";
import {
  getAuditLogById,
  getAllAuditLogs,
} from "../controllers/auditlogs.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const auditRouter = Router();
auditRouter.get("/", verifyJwt, authorizeRoles("SUPER_ADMIN"), getAllAuditLogs);
auditRouter.get(
  "/:id",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  getAuditLogById,
);

export default auditRouter;
