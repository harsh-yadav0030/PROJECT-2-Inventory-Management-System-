import { Router } from "express";
import {
  getAllTransactions,
  getTransactionById,
} from "../controllers/inventoryTransaction.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const transactionRouter = Router();

transactionRouter.get("/", verifyJwt, getAllTransactions);

transactionRouter.get("/:id", verifyJwt, getTransactionById);

export default transactionRouter;
/**
 * 
 * 
 */
