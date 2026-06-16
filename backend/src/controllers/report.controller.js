import { Inventory } from "../models/inventory.model.js";
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { Alert } from "../models/alert.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await Inventory.find() //all inventory items
    .populate("product", "name sku category")
    .populate("location", "name code");

  return res
    .status(200)
    .json(
      new ApiResponse(200, report, "Inventory report generated successfully"),
    );
});

const getTransactionReport = asyncHandler(async (req, res) => {
  const report = await InventoryTransaction.find()
    .populate("product", "name sku")
    .populate("sourceLocation", "name code") //source location what we want from source location
    .populate("destinationLocation", "name code")
    .populate("performedBy", "fullname role")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, report, "Transaction report generated successfully"),
    );
});

const getLowStockReport = asyncHandler(
  async (req, res) => {

    const report =
      await Alert.find({
        status: "ACTIVE"
      })
      .populate(
        "product",
        "name sku"
      )
      .populate(
        "location",
        "name code"
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        report,
        "Low stock report generated successfully"
      )
    );
});

export {
  getInventoryReport,
  getTransactionReport,
  getLowStockReport
};