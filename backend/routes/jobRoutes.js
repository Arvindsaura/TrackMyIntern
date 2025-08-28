import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs
 
} from "../controllers/jobController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

// ⭐ Post a new job (only recruiters/admins usually)
router.post("/create", protect, createJob);

// ⭐ Get all jobs
router.get("/", getAllJobs);

// ⭐ Get a single job by ID
router.get("/:id", getJobById);

// ⭐ Update a job (recruiter/admin only)
router.put("/:id", protect, updateJob);

// ⭐ Delete a job
router.delete("/:id", protect, deleteJob);

// ⭐ Search jobs (by title, location, skills, etc.)
router.get("/search/:keyword", searchJobs);

export default router;
