import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // Assuming you have a user model

export const protect = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded; // Store user information in request for access control

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};
