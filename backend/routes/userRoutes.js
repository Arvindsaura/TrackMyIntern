import express from "express";
import {
  getUserData,
  saveJob,
  getSavedJobs,
  addManualJob,
  updateJobStatus,
  removeSavedJob,
  uploadResume
} from "../controllers/userController.js";
import { protect } from "../middlewares/protect.js";
import multer from 'multer'; // Import multer

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer to save files in the 'uploads' directory

// All routes protected
router.use(protect);

router.get("/user", getUserData);
router.post("/save-job", saveJob);
router.get("/saved-jobs", getSavedJobs);

// New routes
router.post("/manual-job", addManualJob);
router.patch("/job-status/:jobId", updateJobStatus);
router.delete("/remove-job/:jobId", removeSavedJob);

// New route for resume upload, with multer middleware
router.post("/upload-resume", upload.single('resume'), uploadResume);

export default router;
