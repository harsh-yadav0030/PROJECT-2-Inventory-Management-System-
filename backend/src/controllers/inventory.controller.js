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
import { Alert } from "../models/alert.model.js";
import { createAuditLog } from "../utils/createAudutLogs.js";

const stockIn = asyncHandler(async (req, res) => {
  const { productId, locationId, quantity } = req.body;

  if (!productId || !locationId || quantity === undefined) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const session = await mongoose.startSession(); //created a session

  try {
    session.startTransaction();
    // check whether product is valid or not

    const product = await Product.findById(productId).session(session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // check whether location is valid or not
    const location = await Location.findById(locationId).session(session);

    if (!location) {
      throw new ApiError(404, "Location not found");
    }

    // Inventory search if already present
    let inventory = await Inventory.findOne({
      product: productId,
      location: locationId,
    }).session(session);


    const oldQuantity = inventory?.quantity||0;

    //Create Inventory
    if (!inventory) {
      const inventories = await Inventory.create(
        [
          {
            product: productId,
            location: locationId,
            quantity,
          },
        ],
        {
          session,
        },
      );
      inventory = inventories[0];

    } else {
      inventory.quantity += quantity;
      await inventory.save({ session });
    }


    const alert = await Alert.findOne({
      product: productId,
      location: locationId,
      status: "ACTIVE",
    }).session(session);

    if (alert && inventory.quantity > product.reorderLevel) {
      alert.status = "RESOLVED";
      await alert.save({ session });
    }

    //create transaction log
    await InventoryTransaction.create(
      [
        {
          product: productId,
          destinationLocation: locationId,
          quantity,
          type: "STOCK_IN",
          performedBy: req.user._id,
          remarks: "Stock added in inventory"
        },
      ],
      {
        session,
      },
    );

     await createAuditLog({
      user: req.user._id,
      action: "STOCK_IN",
      entityType: "Inventory",
      entityId: inventory._id,
      oldData: {
        quantity: oldQuantity,
      },
      newData: {
        quantity: inventory.quantity,
      },
      session,
    });

    // Everything Successful
    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(200, inventory, "Stock added successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

const stockOut = asyncHandler(async (req, res) => {
  const { productId, locationId, quantity } = req.body;
  if (!productId || !locationId || quantity === undefined) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const session = await mongoose.startSession(); //created a session

  try {
    session.startTransaction();

    const product = await Product.findById(productId).session(session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // check whether location is valid or not
    const location = await Location.findById(locationId).session(session);

    if (!location) {
      throw new ApiError(404, "Location not found");
    }

    let inventory = await Inventory.findOne({
      product: productId,
      location: locationId,
    }).session(session);

    if (!inventory) {
      throw new ApiError(404, "Inventory not found");
    }

    if (inventory.quantity < quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    const oldQuantity = inventory.quantity;

    inventory.quantity -= quantity;
    await inventory.save({ session });

    if (inventory.quantity <= product.reorderLevel) {
      const existingAlert = await Alert.findOne({
        product: productId,
        location: locationId,
        status: "ACTIVE",
      }).session(session);

      if (!existingAlert) {
        await Alert.create(
          [
            {
              product: productId,
              location: locationId,
              currentQuantity: inventory.quantity,
              reorderLevel: product.reorderLevel,
            },
          ],
          { session },
        );
      } else {
        existingAlert.currentQuantity = inventory.quantity;
        await existingAlert.save({
          session,
        });
      }
    }

    await InventoryTransaction.create(
      [
        {
          product: productId,
          sourceLocation: locationId,
          quantity,
          type: "STOCK_OUT",
          performedBy: req.user._id,
          remarks: "Stock removed from inventory"
        },
      ],
      { session },
    );


    await createAuditLog({
      user: req.user._id,
      action: "STOCK_OUT",
      entityType: "Inventory",
      entityId: inventory._id,
      oldData: {
        quantity: oldQuantity,
      },
      newData: {
        quantity: inventory.quantity,
      },
      session,
    });

    await session.commitTransaction();
    return res
      .status(200)
      .json(new ApiResponse(200, inventory, "Stock removed successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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
  const {
    productId,
    sourceLocationId,
    destinationLocationId,
    quantity,
  } = req.body;

  if (
    !productId ||
    !sourceLocationId ||
    !destinationLocationId ||
    quantity === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(
      400,
      "Quantity must be greater than zero"
    );
  }

  if (sourceLocationId === destinationLocationId) {
    throw new ApiError(
      400,
      "Source and destination locations cannot be same"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await Product.findById(productId)
      .session(session);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    const sourceLocation = await Location.findById(
      sourceLocationId
    ).session(session);

    const destinationLocation = await Location.findById(
      destinationLocationId
    ).session(session);

    if (!sourceLocation) {
      throw new ApiError(
        404,
        "Source location not found"
      );
    }

    if (!destinationLocation) {
      throw new ApiError(
        404,
        "Destination location not found"
      );
    }

    let sourceInventory = await Inventory.findOne({
      product: productId,
      location: sourceLocationId,
    }).session(session);

    if (!sourceInventory) {
      throw new ApiError(
        404,
        "Source inventory not found"
      );
    }

    if (sourceInventory.quantity < quantity) {
      throw new ApiError(
        400,
        "Insufficient stock"
      );
    }

    const oldSourceQuantity =
      sourceInventory.quantity;

    sourceInventory.quantity -= quantity;

    await sourceInventory.save({
      session,
    });

    let destinationInventory =
      await Inventory.findOne({
        product: productId,
        location: destinationLocationId,
      }).session(session);

    const oldDestQuantity =
      destinationInventory?.quantity || 0;

    if (!destinationInventory) {

      const inventories =
        await Inventory.create(
          [
            {
              product: productId,
              location: destinationLocationId,
              quantity,
            },
          ],
          {
            session,
          }
        );

      destinationInventory =
        inventories[0];

    } else {

      destinationInventory.quantity += quantity;

      await destinationInventory.save({
        session,
      });

    }

    await InventoryTransaction.create(
      [
        {
          product: productId,
          sourceLocation: sourceLocationId,
          destinationLocation:
            destinationLocationId,
          quantity,
          type: "TRANSFER",
          performedBy: req.user._id,
          remarks: "Inventory transfer",
        },
      ],
      {
        session,
      }
    );

    await createAuditLog({
      user: req.user._id,
      action: "TRANSFER",
      entityType: "Inventory",
      entityId: sourceInventory._id,

      oldData: {
        sourceQuantity:
          oldSourceQuantity,
        destinationQuantity:
          oldDestQuantity,
      },

      newData: {
        sourceQuantity:
          sourceInventory.quantity,
        destinationQuantity:
          destinationInventory.quantity,
      },

      session,
    });

    await session.commitTransaction();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          sourceInventory,
          destinationInventory,
        },
        "Inventory transferred successfully"
      )
    );

  } catch (error) {

    await session.abortTransaction();
    throw error;

  } finally {

    await session.endSession();

  }
});

export {
  stockIn,
  stockOut,
  getInventory,
  getInventoryByLocation,
  transferInventory,
};
