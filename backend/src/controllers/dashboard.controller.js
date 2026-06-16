import { User } from "../models/user.model.js";
import { Location } from "../models/location.model.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";
import { Alert } from "../models/alert.model.js";
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUser = await User.countDocuments();
  const totalLocations = await Location.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalInventoryRecords = await Inventory.countDocuments();
  const activeAlerts = await Alert.countDocuments({
    status: "ACTIVE",
  });
  const totalTransactions = await InventoryTransaction.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalLocations,
        totalProducts,
        totalInventoryRecords,
        activeAlerts,
        totalTransactions,
      },
      "Dashboard statistics fetched successfully",
    ),
  );
});

const getRecentTransactions = asyncHandler(async (req, res) => {
  const transactions = await InventoryTransaction.find()
    .populate("product", "name sku")
    .populate("performedBy", "fullname role")
    .sort({
      createdAt: -1,
    })
    .limit(10);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transactions,
        "Recent transactions fetched successfully",
      ),
    );
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find()
    .populate("product")
    .populate("location", "name code");

  const lowStockProducts = inventory.filter(
    (item) => item.quantity <= item.product.reorderLevel,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lowStockProducts,
        "Low stock products fetched successfully",
      ),
    );
});

const getLocationDashboardStats = asyncHandler(async (req, res) => {
  const { locationId } = req.params;

  const location = await Location.findById(locationId);

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  const inventoryRecords = await Inventory.find({
    location: locationId,
  }).populate("product");

  const totalProducts = inventoryRecords.length;

  const totalQuantity = inventoryRecords.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const lowStockProducts = inventoryRecords.filter(
    (item) => item.quantity <= item.product.reorderLevel,
  ).length;

  const totalTransactions = await InventoryTransaction.countDocuments({
    $or: [
      {
        sourceLocation: locationId,
      },
      {
        destinationLocation: locationId,
      },
    ],
  });

  const activeAlerts = await Alert.countDocuments({
    location: locationId,
    status: "ACTIVE",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        location: {
          id: location._id,
          name: location.name,
          code: location.code,
        },
        totalProducts,
        totalQuantity,
        lowStockProducts,
        activeAlerts,
        totalTransactions,
      },
      "Location dashboard fetched successfully",
    ),
  );
});

export {
  getDashboardStats,
  getRecentTransactions,
  getLowStockProducts,
  getLocationDashboardStats,
};
