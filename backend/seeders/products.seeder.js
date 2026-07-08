import { Product } from "../src/models/product.model.js";
import products from "./data/products.js";

const seedProducts = async () => {
  try {
    console.log("Seeding Products...");
    // Optional: Delete existing products
    await Product.deleteMany({});
    
    // Insert all products 
    await Product.insertMany(products);

    console.log(`${products.length} Products Created Successfully`);
  } catch (error) {
    console.error("Error while seeding products:", error);
    throw error;
  }
};

export default seedProducts;