import { Location } from "../models/location.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createLocation = asyncHandler(async (req, res) => {
  const { name, code, address, manager, status } = req.body;

  if (!name || !code || !address) {
    throw new ApiError(400, "Name, code and address are required");
  }

  const existingLocation = await Location.findOne({ code });
  if (existingLocation) {
    throw new ApiError(409, "Location already exists");
  }

  const location = await Location.create({
    name,
    code,
    address,
    manager,
    status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, location, "Location created successfully"));
});

const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find().populate("manager", "fullname email");
  return res
    .status(200)
    .json(new ApiResponse(200, locations, "Locations fetched successfully"));
});

const getLocationById = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id).populate(
    "manager",
    "fullname email",
  );

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, location, "Location fetched successfully"));
});

const updateLocation = asyncHandler(async (req, res) => {
  const updateLocation = await Location.findByIdAndUpdate(
    req.params.id,
    req.body, //new updated location fields
    {
      new: true,
      runValidators: true,
    }, // update it
  );

  if (!updateLocation) {
    throw new ApiError(404, "Location not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(updateLocation, "Location updated successfully"));
});

const deleteLocation = asyncHandler(async (req, res) => {

  const location = await Location.findByIdAndUpdate(
    req.params.id,
    {
      status:"INACTIVE" //set the status Inactive we are not deleting from records so that it will be helpful in future
    },
    {
      new:true
    }
  );

  if (!location) {
        throw new ApiError(
            404,
            "Location not found"
        );
  }

  return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Location deactivated successfully"
        )
  );

});


export { createLocation, getAllLocations, getLocationById, updateLocation , deleteLocation };
