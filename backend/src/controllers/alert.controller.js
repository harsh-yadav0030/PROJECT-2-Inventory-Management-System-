import { Alert } from "../models/alert.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find()
    .populate("product", "name sku category")
    .populate("location", "name code")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, alerts, "Alerts fetched successfully"));
});

const getActiveAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({
    status: "ACTIVE",
  })
    .populate("product", "name sku category")
    .populate("location", "name code")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, alerts, "Active alerts fetched successfully"));
});

const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  alert.status = "RESOLVED";

  await alert.save();

  return res
    .status(200)
    .json(new ApiResponse(200, alert, "Alert resolved successfully"));
});

export { getAllAlerts, getActiveAlerts, resolveAlert };
