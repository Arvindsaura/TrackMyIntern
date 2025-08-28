import express from "express";
import {
  getUserData,
  saveJob,
  getSavedJobs,
  addManualJob,
  updateJobStatus,
  removeSavedJob
} from "../controllers/userController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

// All routes protected
router.use(protect);

router.get("/user", getUserData);
router.post("/save-job", saveJob);
router.get("/saved-jobs", getSavedJobs);

// New routes
router.post("/manual-job", addManualJob);
router.patch("/job-status/:jobId", updateJobStatus);
router.delete("/remove-job/:jobId", removeSavedJob);

export default router;
