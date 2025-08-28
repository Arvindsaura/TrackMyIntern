// models/jobModel.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    salary: { type: String },
    type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], default: "Full-time" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
