import express from "express";
import {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationStatus,
  changeVisibility
} from "../controllers/companyController.js";

import upload from "../configs/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company", protectCompany, getCompanyData);

// Post a job
router.post("/post-job", protectCompany, postJob);

// Get applicants data
router.get("/applicants", protectCompany, getCompanyJobApplicants);

// Get company job list
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Change application status
router.post("/change-status", protectCompany, changeJobApplicationStatus);

// Change application's visibility
router.post("/change-visibility", protectCompany, changeVisibility);

export default router;
