import mongoose from "mongoose";
import User from "../models/userModel.js";

// Valid job statuses
const validStatuses = [
  "Interested",
  "Applied",
  "Assessment Scheduled",
  "Assessment Completed",
  "Interview Round 1",
  "Interview Round 2",
  "Interview Round 3",
  "Offer Received",
  "Offer Accepted",
  "Rejected",
  "Withdrawn"
];


// Helper: Get or create user
const getOrCreateUser = async (clerkId, name, email) => {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: name || "No Name",
      email: email || `noemail_${Date.now()}@example.com`,
      password: Math.random().toString(36).slice(-8),
      savedJobs: [],
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
    console.error("Error in getUserData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------- Save Job ---------------------
export const saveJob = async (req, res) => {
  try {
    const { job } = req.body;
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId, req.auth.name, req.auth.email);

    if (!job._id) job._id = new mongoose.Types.ObjectId().toString();
    if (!validStatuses.includes(job.status)) job.status = "Interested";

    const alreadySaved = user.savedJobs.some(saved => saved._id.toString() === job._id.toString());
    if (alreadySaved) return res.json({ success: false, message: "Job already saved" });

    user.savedJobs.push(job);
    await user.save();
    res.json({ success: true, message: "Job saved successfully", job });
  } catch (error) {
    console.error("Error in saveJob:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------- Add Manual Job ---------------------
export const addManualJob = async (req, res) => {
  try {
    const { job } = req.body;
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId, req.auth.name, req.auth.email);

    if (!job._id) job._id = new mongoose.Types.ObjectId().toString();
    if (!validStatuses.includes(job.status)) job.status = "Interested";

    user.savedJobs.push(job);
    await user.save();
    res.json({ success: true, message: "Manual job added", job });
  } catch (error) {
    console.error("Error in addManualJob:", error);
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

    const job = user.savedJobs.find(job => job._id && job._id.toString() === jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status value" });

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
    console.error("Error in getSavedJobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------- Remove Saved Job ---------------------
export const removeSavedJob = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const jobId = req.params.jobId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const initialCount = user.savedJobs.length;
    user.savedJobs = user.savedJobs.filter(job => job._id.toString() !== jobId);

    if (user.savedJobs.length === initialCount)
      return res.status(404).json({ success: false, message: "Job not found in saved jobs" });

    await user.save();
    res.status(200).json({ success: true, message: "Job removed successfully" });
  } catch (err) {
    console.error("Error removing job:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
