import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../src/db/index.js";
import seedProducts from "../seeders/products.seeder.js";
dotenv.config();

const seedDatabase = async () => {

    try {

        await connectDB();

        console.log("Database Connected");

        await seedProducts();

        console.log("Database Seeded Successfully");

    } catch (error) {

        console.log(error);

    } finally {

        await mongoose.disconnect();

        console.log("Database Disconnected");

    }

};

seedDatabase();