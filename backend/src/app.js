import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import locationRouter from "./routes/location.routes.js";
import productRouter from "./routes/product.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import alertRouter from "./routes/alert.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import reportRouter from "./routes/report.routes.js";
import auditRouter from "./routes/auditlog.routes.js";
import  userRouter  from "./routes/user.routes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/alerts", alertRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/report",reportRouter);
app.use("/api/v1/audit-logs",auditRouter);
app.use("/api/v1/user",userRouter);

export default app;
