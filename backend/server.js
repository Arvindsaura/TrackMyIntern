// server.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js"; // Import company routes
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

// Initialize Express
const app = express();

// Connect to Database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.post("/webhooks", clerkWebhooks);

// Prefix all company-related routes under /job-portal
app.use("/job-portal/api/company", companyRoutes);  // Prefixed with /job-portal

// Keep job and user routes as they are, or you can prefix them if needed
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Debug Sentry route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Port
const port = process.env.PORT || 5000;

// Setup Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
