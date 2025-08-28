import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // Find users without a clerkId
    const users = await User.find({ clerkId: { $exists: false } });

    for (let user of users) {
      // Replace this with the actual Clerk ID for the user
      user.clerkId = "PUT_THEIR_CLERK_ID_HERE"; 
      await user.save();
      console.log(`Added clerkId for user: ${user.email}`);
    }

    console.log("Clerk IDs added for all existing users");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
