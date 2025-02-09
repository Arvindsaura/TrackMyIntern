import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String, required: true },
});

// Mongoose automatically names the collection by the plural form of the model name
const companyModel = mongoose.model("Company", companySchema);

export default companyModel;
