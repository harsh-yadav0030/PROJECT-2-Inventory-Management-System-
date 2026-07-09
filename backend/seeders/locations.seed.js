import locations from "./data/location";
import { Location } from "../src/models/location.model";

const seedLocation = async () => {
  try {
    console.log("Seeding Locations...");
    // Optional: Delete existing products
    await Product.deleteMany({});

    // Insert all products
    await Location.insertMany(locations);

    console.log(`${products.length} Products Created Successfully`);
  } catch (error) {
    console.error("Error while seeding Location:", error);
    throw error;
  }
};

export  {seedLocation}
