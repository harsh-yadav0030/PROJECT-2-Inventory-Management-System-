import { router } from "express";
import {
  getAuditLogById,
  getAllAuditLogs,
} from "../controllers/auditlogs.controller";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { verify } from "jsonwebtoken";

const auditRouter = router();
auditRouter.get("/", verifyJwt, authorizeRoles("SUPER_ADMIN"), getAllAuditLogs);
auditRouter.get(
  "/:id",
  verifyJwt,
  authorizeRoles("SUPER_ADMIN"),
  getAuditLogById,
);

export default auditRouter;
