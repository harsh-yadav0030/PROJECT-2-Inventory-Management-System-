// in this type we are listing product in our website
// {
//     "name": "Dell Latitude 5540",
//     "sku": "LAP001",
//     "category": "Laptop",
//     "description": "Business laptop",
//     "unitPrice": 65000,
//     "reorderLevel": 10,
//     "status": "ACTIVE"
// }

import mongoose from "mongoose";
const productSchema= new mongoose.Schema({
  name:{
      type:String,
      required:true,
      trim:true
  },
  sku:{
    type:String,
    required:true,
     unique: true,
            uppercase: true,
            trim: true
  },
  category:{
    type:String,
    required:true,
    trim:true
  },
  description:{
      type:String,
      trim: true,
      default: ""
  },
  unitprice:{
      type:Number,
      required:true,
      min:0
  },
  reorderLevel: {
            type: Number,
            default: 10,
            min: 0
  },
    status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
  }


},{
  timestamps:true
});

export const Product=mongoose.model("Product",productSchema);