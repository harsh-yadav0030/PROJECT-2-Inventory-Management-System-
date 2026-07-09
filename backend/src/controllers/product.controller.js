import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { createAuditLog } from "../utils/createAudutLogs.js";

import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, description, unitprice, reorderLevel, status } =
    req.body;

  if (!name || !sku || !category || unitprice === undefined) {
    throw new ApiError(400, "Name, SKU, Category and Unit Price are required");
  }

  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    throw new ApiError(409, "Product already exists");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const products = await Product.create(
      [
        {
          name,
          sku,
          category,
          description,
          unitprice,
          reorderLevel,
          status,
        },
      ],
      { session },
    );

    const product = products[0];

    await createAuditLog(
      {
        user: req.user._id,
        action: "CREATE_PRODUCT",
        entityType: "Product",
        entityId: product._id,
      },
      session,
    );

    await session.commitTransaction();

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  // max ka use -ve ko handle karne ke liya hai means if someone send request for -ve page
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  // at max we can request 100 products on page this req is required to handle huge limit
  const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 10, 1),
    100
);
  
  const totalProducts = await Product.countDocuments(); 

  if (totalProducts === 0) {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                products: [],
                page,
                limit,
                totalProducts: 0,
                totalPages: 0,
            },
            "No products have been added yet."
        )
    );
  }

  const skip = (page - 1) * limit;

  const products = await Product.find() 
  .sort({ createdAt: -1 })
  .skip(skip).limit(limit);
  
  const totalPages = Math.ceil(totalProducts / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(200,
        {
          products,
          pagination:{
          page,
          limit,
          totalProducts,
          totalPages, 
          }
          
        },
         products.length
            ? "Products fetched successfully"
            : "No products available on this page."));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const oldProduct = await Product.findById(req.params.id)

      .session(session);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).session(session);

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    await createAuditLog(
      {
        user: req.user._id,
        action: "UPDATE_PRODUCT",
        entityType: "Product",
        entityId: updatedProduct._id,
        oldData: oldProduct,
        newData: updatedProduct,
      },
      session,
    );
    await session.commitTransaction();
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully"),
      );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "INACTIVE",
      },
      {
        new: true,
      },
    ).session(session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    await createAuditLog(
      {
        user: req.user._id,
        action: "DELETE_PRODUCT",
        entityType: "Product",
        entityId: product._id,
      },
      session,
    );

    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deactivated successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
