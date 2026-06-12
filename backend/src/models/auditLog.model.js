    // product: laptopId,
    // type: "STOCK_OUT",
    // quantity: 5,
    // performedBy: employeeId,
    // remarks: "Sold to customer"

import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            required: true,
            trim: true
        },

        entityType: {
            type: String,
            required: true,
            trim: true
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        oldData: {
            type: Object,
            default: null
        },

        newData: {
            type: Object,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const AuditLog = mongoose.model(
    "AuditLog",
    auditLogSchema
);