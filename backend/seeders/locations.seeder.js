import locations from "./data/location.js";
import { Location } from "../src/models/location.model.js";

const seedLocations = async () => {
  try {
    console.log("Seeding Locations...");
    // Optional: Delete existing products
    await Location.deleteMany({});

    // Insert all products
    await Location.insertMany(locations);

    console.log(`${locations.length} Locations Created Successfully`);
  } catch (error) {
    console.error("Error while seeding Location:", error);
    throw error;
  }
};

export default seedLocations;
