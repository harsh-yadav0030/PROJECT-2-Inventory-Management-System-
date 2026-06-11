import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";

dotenv.config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000,() => {
            console.log(
                `Server running on port ${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.log(error);
});