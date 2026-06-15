import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await InventoryTransaction.find()
    .populate("product", "name sku")
    .populate("sourceLocation", "name code")
    .populate("destinationLocation", "name code")
    .populate("performedBy", "fullname email role")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully"),
    );
});

const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await InventoryTransaction.findById(req.params.id)
    .populate("product", "name sku")
    .populate("sourceLocation", "name code")
    .populate("destinationLocation", "name code")
    .populate("performedBy", "fullname email role")

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, transaction, "Transaction fetched successfully"),
    );
});

export { getAllTransactions, getTransactionById };
