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
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";

const stockIn = asyncHandler(async (req, res) => {
  const { productId, locationId, quantity } = req.body;

  if (!productId || !locationId || quantity === undefined) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  // check whether product is valid or not
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check whether location is valid or not
  const location = await Location.findById(locationId);

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  // Inventory search if already present
  let inventory = await Inventory.findOne({
    product: productId,
    location: locationId,
  });

  if (!inventory) {
    inventory = await Inventory.create({
      product: productId,
      location: locationId,
      quantity,
    });
  } else {
    inventory.quantity += quantity;
    await inventory.save();
  }

  const alert = await Alert.findOne({
    product: productId,
    location: locationId,
    status: "ACTIVE",
  });

  if (alert && inventory.quantity > product.reorderLevel) {
    alert.status = "RESOLVED";
    await alert.save();
  }

  await InventoryTransaction.create({
    product: productId,
    destinationLocation: locationId,
    quantity,
    type: "STOCK_IN",
    performedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Stock added successfully"));
});

const stockOut = asyncHandler(async (req, res) => {
  const { productId, locationId, quantity } = req.body;
  if (!productId || !locationId || quantity === undefined) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const inventory = await Inventory.findOne({
    product: productId,
    location: locationId,
  });

  if (!inventory) {
    throw new ApiError(404, "Inventory not found");
  }

  if (inventory.quantity < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  inventory.quantity -= quantity;
  await inventory.save();

  if (inventory.quantity <= product.reorderLevel) {
    const existingAlert = await Alert.findOne({
      product: productId,
      location: locationId,
      status: "ACTIVE",
    });

    if (!existingAlert) {
      await Alert.create({
        product: productId,
        location: locationId,
        currentQuantity: inventory.quantity,
        reorderLevel: product.reorderLevel,
      });
    }
  }

  await InventoryTransaction.create({
    product: productId,
    sourceLocation: locationId,
    quantity,
    type: "STOCK_OUT",
    performedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Stock removed successfully"));
});

const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find()
    .populate("product", "name sku category")
    .populate("location", "name code");

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory fetched successfully"));
});

const getInventoryByLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const location = await Location.findById(locationId);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  const inventory = await Inventory.find({
    location: locationId,
  })
    .populate("product", "name sku category")
    .populate("location", "name code");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        inventory,
        "Location inventory fetched successfully",
      ),
    );
});

const transferInventory = asyncHandler(async (req, res) => {
  const { productId, sourceLocationId, destinationLocationId, quantity } =
    req.body;
  if (
    !productId ||
    !sourceLocationId ||
    !destinationLocationId ||
    quantity === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (quantity <= 0) {
    throw new ApiError(401, "Quantity must be greater then zero");
  }

  if (sourceLocationId === destinationLocationId) {
    throw new ApiError(400, "Source and destination locations cannot be same");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const sourceLocation = await Location.findById(sourceLocationId);
  const destinationLocation = await Location.findById(destinationLocationId);

  if (!sourceLocation) {
    throw new ApiError(404, "Source location not found");
  }

  if (!destinationLocationLocation) {
    throw new ApiError(404, "destination location not found");
  }

  const sourceInventory = await Inventory.findOne({
    product: productId,
    location: sourceLocationId,
  });

  if (!sourceInventory) {
    throw new ApiError(404, "Source inventory not found");
  }

  if (sourceInventory.quantity < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  sourceInventory.quantity -= quantity;
  await sourceInventory.save();


  const destinationInventory = await Inventory.findOne({
    product: productId,
    location: destinationLocationId,
  });

 if(!destinationInventory) {
    destinationInventory =
            await Inventory.create({
                product: productId,
                location:
                    destinationLocationId,
                quantity
            });
 }
 else{
    destinationInventory.quantity+=quantity;
    await destinationInventory.save();
 }

 await InventoryTransaction.create({
        product: productId,
        sourceLocation: sourceLocationId,
        destinationLocation:
            destinationLocationId,
        quantity,
        type: "TRANSFER",
        performedBy: req.user._id
});

return res.status(200).json(
        new ApiResponse(
            200,
            {
                sourceInventory,
                destinationInventory
            },
            "Inventory transferred successfully"
        )
);

});

export {
  stockIn,
  stockOut,
  getInventory,
  getInventoryByLocation,
  transferInventory,
};
