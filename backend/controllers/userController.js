import jobApplicationModel from "../models/jobApplicationModel.js";
import jobModel from "../models/jobModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

// get user data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// apply for job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const isAlreadyApplied = await jobApplicationModel({ jobId, userId });

    if (isAlreadyApplied.length > 0) {
      return res.json({
        success: false,
        message: "Already Applied",
      });
    }

    const jobData = await jobModel.findById(jobId);

    if (!jobData) {
      return res.json({
        success: false,
        message: "Job Not Found",
      });
    }

    await jobApplicationModel.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({
      success: true,
      message: "Applied Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const applications = await jobApplicationModel
      .find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!applications) {
      return res.json({
        success: false,
        message: "No Job Applications Found For This User",
      });
    }

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// update user profile
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;
    const userData = await userModel.findById(userId);

    if (resumeFile) {
      const uploadResume = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = uploadResume.secure_url;
    }

    await userData.save();

    return res.json({
      success: true,
      message: "Resume Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
