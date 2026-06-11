import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        name: {//name of location storage
            type: String,
            required: true,
            trim: true,
        },

        code: { //code of warehouse
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        address: { // addrress of inventory storage unit
            type: String,
            required: true,
            trim: true,
        },

        manager: { // manager of that unit
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        status: { // the location is open or closed 
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

export const Location = mongoose.model("Location", locationSchema);