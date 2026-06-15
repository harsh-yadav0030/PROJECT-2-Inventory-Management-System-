// {
//     product: laptopId,
//     type: "STOCK_OUT",
//     quantity: 5,
//     performedBy: rahulId,
//     remarks: "Issued to new employees"
// }

import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema({
      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },

      type:{ // transactionn can be many types
        type:String,
         enum: [
              "STOCK_IN",
              "STOCK_OUT",
              "TRANSFER",
              "ADJUSTMENT"
          ],
            required: true
      },

      quantity:{
        type:Number,
        required: true,
        min: 1
      },

      sourceLocation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Location",
        default:null
      },

      destinationLocation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Location",
        default:null
      },

      performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      }
      ,
      remarks:{
        type:String,
        trim:true,
        default:""
      }
},
{
  timestamps:true
});

export const InventoryTransaction = mongoose.model(
    "InventoryTransaction",
    inventoryTransactionSchema
);