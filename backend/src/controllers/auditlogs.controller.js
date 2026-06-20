import { AuditLog } from "../models/auditLog.model";
import { ApiResponse } from "../utils/ApiError.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getAllAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("user", "fullname email role")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, logs, "Audit logs fetched successfully"));
});

const getAuditLogById = asyncHandler(async (req, res) => {

    const log = await AuditLog.findById(
        req.params.id
    ).populate(
        "user",
        "fullname email role"
    );

    if (!log) {
        throw new ApiError(
            404,
            "Audit log not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            log,
            "Audit log fetched successfully"
        )
    );
});

export {getAllAuditLogs,getAuditLogById};

