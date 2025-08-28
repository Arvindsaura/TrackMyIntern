import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("Cloudinary credentials missing in env variables");
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Clerk middleware
app.use(clerkMiddleware());

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://track-my-intern-3w94.vercel.app", // your Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI not defined in env variables");
} else {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Routes
app.use("/api/user", userRoutes);

// Health check route
app.get("/", (req, res) => res.send("Server is running 🚀"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
