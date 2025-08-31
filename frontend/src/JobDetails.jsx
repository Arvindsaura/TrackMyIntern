import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { AppContext } from "./contexts/AppContext";
import { jobData } from "./components/data";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, savedJobs } = useContext(AppContext);
  const { getToken } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    backendUrl ||
    (typeof import.meta !== "undefined" ? import.meta.env.VITE_BACKEND_URL : "") ||
    "http://localhost:5000";

  useEffect(() => {
    const foundJob = jobData.find((j) => j._id === id);
    if (foundJob) setJob(foundJob);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 pixelify-sans-regular">
        <p className="text-xl text-gray-700 animate-pulse">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-500 font-semibold">Job not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 rounded-xl bg-[#5A4FCF] text-white font-medium shadow-md hover:scale-105 hover:bg-[#4a41ab] transition-transform duration-300 ease-in-out"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSaved = savedJobs?.some((saved) => saved._id === job._id);

  const saveJob = async () => {
  if (isSaved) return toast.info("Job is already saved!");
  try {
    const token = await getToken();
    if (!token) return toast.warning("You must be logged in to save jobs.");
    const res = await fetch(`${baseUrl}/api/user/save-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ job }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Job saved successfully!");
    } else {
      toast.error(data.message || "Failed to save job.");
    }
  } catch (err) {
    console.error("Save Job Error:", err);
    toast.error("Something went wrong, try again.");
  }
};


  const addToGoogleCalendar = async () => {
    try {
      const title = encodeURIComponent(`Application Deadline: ${job.title}`);
      const description = encodeURIComponent(`Don't forget to apply for ${job.title} at ${job.companyName}`);
      const location = encodeURIComponent(job.location || "Online");
      const start = new Date(job.applyDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const startStr = start.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endStr = end.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${description}&location=${location}`;

      window.open(url, "_blank");

      const token = await getToken();
      if (!token) return alert("You must be logged in to save jobs.");

      const res = await fetch(`${baseUrl}/api/user/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ job }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log("Auto-saved job:", data);
    } catch (err) {
      console.error("Auto Save Job Error:", err);
      alert("Something went wrong, try again.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
 
      <div className="w-full min-h-screen bg-gray-100 py-12 px-6 md:px-12 lg:px-24 font-sans antialiased">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>

          {/* Job Details Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center flex-col md:flex-row text-center md:text-left">
                {/* Logo from jobData */}
                {/* Logo from jobData */}
<img
  className="h-24 w-24 object-contain rounded-xl border border-gray-200 shadow-sm mr-0 md:mr-6 mb-4 md:mb-0"
  src={job.companyId?.image || "/fallback-logo.png"}
  alt={`${job.companyId?.name} Logo`}
/>

                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">{job.companyName}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium pixelify-sans-regular">
                      {job.location}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium pixelify-sans-regular">
                      {job.level}
                    </span>
                    {job.stipend && (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium pixelify-sans-regular">
                        ₹{job.stipend}
                      </span>
                    )}
                    {job.applyDate && (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium pixelify-sans-regular">
                        Apply by: {job.applyDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 items-center justify-center md:justify-start mb-8 flex-wrap">
              <button
                onClick={() => navigate(`/apply-job/${job._id}`)}
                className="flex items-center px-6 py-2 rounded-lg text-white font-medium transition-transform duration-300 ease-in-out bg-[#5A4FCF] shadow-md hover:scale-105 hover:bg-[#4a41ab] pixelify-sans-regular"
              >
                Apply Now
              </button>
              <button
                onClick={saveJob}
                disabled={isSaved}
                className={`flex items-center px-6 py-2 rounded-lg border font-medium transition-colors duration-200 ease-in-out pixelify-sans-regular
                  ${isSaved
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"}`}
              >
                {isSaved ? "Saved" : "Save Job"}
              </button>
              <button
                onClick={addToGoogleCalendar}
                disabled={isSaved}
                className={`flex items-center px-6 py-2 rounded-lg border font-medium transition-colors duration-200 ease-in-out pixelify-sans-regular
                  ${isSaved
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"}`}
              >
                Add to Calendar
              </button>
            </div>

            {/* Job Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;
