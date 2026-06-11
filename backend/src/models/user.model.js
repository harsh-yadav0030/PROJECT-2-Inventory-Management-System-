import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname:{
    type:String,
    required: true,
    trim: true // remove space from corners
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:[ "SUPER_ADMIN",
            "MANAGER",
            "EMPLOYEE"
    ], // role can be out of these only
    default: "EMPLOYEE"
  },
  assignedLocation:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Location",
    default:null
  },
  refreshToken: {
            type: String,
            default: null
  },
  isActive: {
      type: Boolean,
      default: true //instead of deleting when a worker leaves we basically disable them as inactive 
  }
  },
    {
        timestamps: true
    }
);



export const User=mongoose.model("User",userSchema);