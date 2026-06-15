    // stockIn,
    // stockOut,
    // getInventory,
    // getInventoryByLocation

import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";
import { Location } from "../models/location.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

