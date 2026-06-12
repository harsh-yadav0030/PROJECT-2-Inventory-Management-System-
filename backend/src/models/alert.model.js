import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
      product:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Product",
          required:true
      },
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
      },
      currentQuantity:{
        type: Number,
        required: true
      },
      reorderLevel:{
        type: Number,
        required: true
      },
      status:{// when there is less quantity of product available so we create a alert and alert remain active untill we order new stock and increase the stock above min level
        enum: ["ACTIVE", "RESOLVED"],
        default: "ACTIVE"
      }
},
{
  timestamps:true
});

export const Alert= mongoose.model("Alert",alertSchema);