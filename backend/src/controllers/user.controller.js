import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getAllEmployees = asyncHandler(async (req, res) => {
  const filter = {
    role: "EMPLOYEE",
  };

  // Managers can only see employees of their own location
  if (req.user.role === "MANAGER") {
    filter.assignedLocation = req.user.assignedLocation;
  }

  const employees = await User.find(filter)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name code");

  return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

const getAllManagers = asyncHandler(async (req, res) => {
  const filter = {
    role: "MANAGER",
  };
  const managers = await User.find(filter)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name code");

  return res
    .status(200)
    .json(new ApiResponse(200, managers, "Managers fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(id)
        .select("-password -refreshToken")
        .populate("assignedLocation", "name code");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User fetched successfully"
        )
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const { fullname, email, role, assignedLocation } = req.body;
    const user = await User.findById(id);
    
    if(!user){
      throw new ApiError(404,"User not found");
    }

    if(fullname){
      user.fullname=fullname;
    }
    if(email){
      user.email=email;
    }

    if (role) {
        user.role = role;
    }

    //object id
    if(assignedLocation !== undefined){
      user.assignedLocation = assignedLocation;
    }

    if (
    fullname === undefined &&
    email === undefined &&
    role === undefined &&
    assignedLocation === undefined
    ) {
    throw new ApiError(400, "No fields provided for update");
    }

    await user.save({
      validateBeforeSave:false
    })

    const updatedUser = await User.findById(id)
        .select("-password -refreshToken")
        .populate("assignedLocation", "name code");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "User updated successfully"
        )
    );
});

const updateUserStatus = asyncHandler(async(req,res)=>{
  const { id } = req.params;
  const {isActive}=req.body;

  //check whether id is valid or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  };

  //agar khud hi deactivate ho gye 
  if (req.user._id.toString() === id && isActive === false) {
    throw new ApiError(
        400,
        "You cannot deactivate your own account"
    );
  }
  
  // isActive isboolean or not if some one send isActive=apple then
  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be true or false");
  };

  //find user
  const user = await User.findById(id)
    .select("-password -refreshToken")

  if(!user){
    throw new ApiError(404,"User Not found");
  }
  //Update status
  user.isActive=isActive;

  await user.save({
    validateBeforeSave:false
  });
   
  return res.status(200)
   .json(
    new ApiResponse(
     200,
     user,
     "User status updated successfully"
  ));
});


export { getAllEmployees, getAllManagers ,getUserById,updateUser,updateUserStatus};
