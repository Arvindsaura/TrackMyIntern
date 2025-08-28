import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const savedJobSchema = new mongoose.Schema({
  _id: String,
  title: String,
  companyId: {
    name: String,
    image: String,
  },
  location: String,
  level: String,
  description: String,
  stipend: String,
  applyDate: String,
  status: {
    type: String,
    enum: [
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
      "Withdrawn",
    ],
    default: "Interested",
  },
  notes: { type: String, default: "" },
  lastUpdated: { type: Date, default: Date.now },
  dateSaved: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    savedJobs: [savedJobSchema],
    resumeUrl: { type: String, default: "" },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
