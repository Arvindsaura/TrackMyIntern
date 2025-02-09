import mongoose from "mongoose";
import Job from "./models/jobModel";  // Assuming your Job model is here

const defaultJobs = [
  {
    title: 'Software Engineer',
    description: 'Join our team to build amazing software.',
    location: 'Remote',
    category: 'Engineering',
    level: 'Mid',
    salary: 80000,
    date: Date.now(),
    companyId: '601c72e1f1c7d7d72a4e3b88', // Replace with a valid company ObjectId
  },
  {
    title: 'Data Scientist',
    description: 'Analyze and interpret complex data to help drive business decisions.',
    location: 'New York, NY',
    category: 'Data Science',
    level: 'Senior',
    salary: 120000,
    date: Date.now(),
    companyId: '601c72e1f1c7d7d72a4e3b89', // Replace with a valid company ObjectId
  },
  {
    title: 'Product Manager',
    description: 'Lead product development from ideation to launch.',
    location: 'San Francisco, CA',
    category: 'Product',
    level: 'Senior',
    salary: 150000,
    date: Date.now(),
    companyId: '601c72e1f1c7d7d72a4e3b90', // Replace with a valid company ObjectId
  },
  {
    title: 'UX Designer',
    description: 'Create beautiful and user-friendly designs for our platform.',
    location: 'Austin, TX',
    category: 'Design',
    level: 'Mid',
    salary: 90000,
    date: Date.now(),
    companyId: '601c72e1f1c7d7d72a4e3b91', // Replace with a valid company ObjectId
  },
];

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/job-portal", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Insert default jobs into the database
    await Job.insertMany(defaultJobs);
    console.log("Default jobs inserted successfully.");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error inserting default jobs:", error);
  });
