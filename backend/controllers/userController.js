import mongoose from "mongoose";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { jobData } from "../../frontend/src/components/data.js";
import fs from "fs"; // Import the 'fs' module for file system operations


// Helper: Get or create user
const getOrCreateUser = async (clerkId, name, email) => {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: name || "No Name",
      email: email || `noemail_${Date.now()}@example.com`,
      password: Math.random().toString(36).slice(-8),
    });
  }
  return user;
};

// --------------------- Get User Data ---------------------
export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId, req.auth.name, req.auth.email);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------- Save Job ---------------------
export const saveJob = async (req, res) => {
  try {
    const { job } = req.body;
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId, req.auth.name, req.auth.email);

    // Assign _id if missing
    if (!job._id) job._id = new mongoose.Types.ObjectId().toString();

    // Ensure status is valid
    const validStatus = user.savedJobs[0]?.schema.path("status").enumValues || [];
    if (!validStatus.includes(job.status)) job.status = "Interested";

    // Prevent duplicates
    const alreadySaved = user.savedJobs.some(saved => saved._id.toString() === job._id.toString());
    if (alreadySaved) return res.json({ success: false, message: "Job already saved" });

    user.savedJobs.push(job);
    await user.save();
    res.json({ success: true, message: "Job saved successfully", job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------- Add Manual Job ---------------------
export const addManualJob = async (req, res) => {
  try {
    const { job } = req.body;
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId, req.auth.name, req.auth.email);

    // Assign _id if missing
    if (!job._id) job._id = new mongoose.Types.ObjectId().toString();

    // Ensure status is valid
    const validStatus = user.savedJobs[0]?.schema.path("status").enumValues || [];
    if (!validStatus.includes(job.status)) job.status = "Interested";

    user.savedJobs.push(job);
    await user.save();
    res.json({ success: true, message: "Manual job added", job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------- Update Job Status ---------------------
export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Find job safely
    const job = user.savedJobs.find(job => job._id && job._id.toString() === jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Validate status
    const validStatus = user.savedJobs[0]?.schema.path("status").enumValues || [];
    if (!validStatus.includes(status)) return res.status(400).json({ success: false, message: "Invalid status value" });

    job.status = status;
    job.lastUpdated = Date.now();
    await user.save();

    res.json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------- Get Saved Jobs ---------------------
export const getSavedJobs = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, jobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------- Remove Saved Job ---------------------
export const removeSavedJob = async (req, res) => {
  try {
    const clerkId = req.userId;
    const jobId = req.params.jobId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const initialCount = user.savedJobs.length;

    user.savedJobs = user.savedJobs.filter(job => job._id !== jobId);

    if (user.savedJobs.length === initialCount)
      return res.status(404).json({ success: false, message: "Job not found in saved jobs" });

    await user.save();

    res.status(200).json({ success: true, message: "Job removed successfully" });
  } catch (err) {
    console.error("Error removing job:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------- Upload Resume ---------------------


export const uploadResume = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId, req.auth.name, req.auth.email);

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `resumes/${clerkId}`,
      resource_type: "raw",
    });

    // ------------------- PARSE PDF -------------------
    const dataBuffer = await fs.promises.readFile(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text.toLowerCase(); // extracted text from PDF

    // ------------------- EXTRACT SKILLS -------------------
    const predefinedSkills = ["javascript", "react", "node.js", "express", "mongodb", "python", "sql", "tailwind"];
    const extractedSkills = predefinedSkills.filter(skill => resumeText.includes(skill));

    // Update user
    user.resumeUrl = result.secure_url;
    user.skills = extractedSkills;
    await user.save();

    // Delete local file
    await fs.promises.unlink(req.file.path);

    res.json({
      success: true,
      message: "Resume uploaded and skills extracted successfully!",
      resumeUrl: user.resumeUrl,
      skills: user.skills,
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
