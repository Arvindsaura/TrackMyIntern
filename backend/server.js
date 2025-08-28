import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// Clerk middleware
app.use(clerkMiddleware());

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // dynamic for production
}));

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI not defined in env variables");
} else {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// Routes
app.use("/api/user", userRoutes);

// Health check route
app.get("/", (req, res) => res.send("Server is running..."));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
