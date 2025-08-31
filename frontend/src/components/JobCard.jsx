// JobCard.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { useAuth } from "@clerk/clerk-react";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const JobCard = ({ job, savedJobs = [] }) => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const { getToken } = useAuth();

  const baseUrl =
    backendUrl ||
    (typeof import.meta !== "undefined" ? import.meta.env.VITE_BACKEND_URL : "") ||
    "http://localhost:5000";

  const isSaved = savedJobs.some(
    (saved) => saved._id === job._id || saved.job?._id === job._id
  );

  const saveJob = async () => {
    // Replaced alert with a custom message box or modal for better UX
    // In this simplified example, we'll use a console log
    if (isSaved) {
      toast.info("Job is already saved!");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
       
        return;
      }

      const res = await fetch(${baseUrl}/api/user/save-job, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: Bearer ${token} },
        body: JSON.stringify({ job }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      toast.success(data.success ? "Job saved successfully!" : data.message || "Failed to save job.");
    } catch (err) {
      toast.error("Something went wrong, try again.");
  
    }
  };

  const addToGoogleCalendar = async (job) => {
    const title = encodeURIComponent(Application Deadline: ${job.title});
    const description = encodeURIComponent(Don't forget to apply for ${job.title} at ${job.companyName});
    const location = encodeURIComponent(job.location || "Online");

    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 7);
    end.setDate(start.getDate() + 1);

    const startStr = start.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endStr = end.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const url = https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${description}&location=${location};
    window.open(url, "_blank");

    try {
      const token = await getToken();
      if (!token) return;

      await fetch(${baseUrl}/api/user/save-job, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: Bearer ${token} },
        body: JSON.stringify({ job }),
      });
    } catch (err) {
      toast.error("Auto Save Job Error:", err);
    }
  };

  return (
    <div
      className="relative flex flex-col justify-between p-6 rounded-2xl bg-white shadow-md border border-gray-100 
                 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] ibm-plex-sans-regular"
    >
      {/* Company Logo */}
      <div className="flex justify-center mb-4">
        <img
          className="h-12 w-12 object-contain"
          src={job.companyId?.image || job.companyImage || "/fallback-logo.png"}
          alt="Company Logo"
        />
      </div>

      {/* Job Title */}
      <h4 className="font-extrabold text-xl md:text-2xl text-gray-900 text-center mb-3 dm-sans-medium">
        {job.title}
      </h4>

      {/* Job Tags and Stipend */}
      <div className="flex justify-center items-center gap-3 mb-4 flex-wrap">
        <span className="px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium pixelify-sans-regular">
          {job.location}
        </span>
        <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium pixelify-sans-regular">
          {job.level}
        </span>
        {job.stipend && (
          <span className="flex items-center gap-1 px-4 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium pixelify-sans-regular">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0ZM8 2.5a5.5 5.5 0 1 1-5.5 5.5A5.5 5.5 0 0 1 8 2.5ZM8 4a4 4 0 1 0 4 4A4 4 0 0 0 8 4ZM8 5.5a2.5 2.5 0 1 1-2.5 2.5A2.5 2.5 0 0 1 8 5.5ZM7.5 7h1v1.5H7.5V7Zm0-1h1V4.5H7.5V6Zm-1 1h1v1.5H6.5V7Zm-1 0h1v1.5H5.5V7Zm-1 0h1v1.5H4.5V7Zm-1 0h1v1.5H3.5V7Zm-1 0h1v1.5H2.5V7Zm-.5-1h1v1.5H1.5V6Zm1 0h1v1.5H2.5V6Zm1 0h1v1.5H3.5V6Zm1 0h1v1.5H4.5V6Zm1 0h1v1.5H5.5V6Zm1 0h1v1.5H6.5V6Zm-1-1h1V4.5H5.5V5Zm-1 0h1V4.5H4.5V5Zm-1 0h1V4.5H3.5V5Zm-1 0h1V4.5H2.5V5Zm-1 0h1V4.5H1.5V5ZM1 6h1v1.5H1V6ZM0.5 7h1v1.5H0.5V7Z" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
            ₹{job.stipend}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed mb-6 ibm-plex-sans-regular">
        {job.description?.slice(0, 200)}..
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => window.open(job.applyLink, '_blank')}
          className="w-full h-11 rounded-lg bg-gray-900 text-white font-medium transition-all 
                     hover:bg-[#ff331f]/90 hover:shadow-md hover:scale-[1.01] pixelify-sans-regular"
        >
          Apply Now
        </button>

        <div className="flex gap-3">
          <button
            onClick={saveJob}
            disabled={isSaved}
            className={`flex-1 h-11 rounded-lg border border-gray-200 font-medium text-sm transition-all
                       ${isSaved
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed pixelify-sans-regular"
                          : "bg-white text-gray-900 hover:bg-[#6573D4]/90 hover:text-white hover:shadow-md hover:scale-[1.01] pixelify-sans-regular"}`}
          >
            {isSaved ? "Saved" : "Save Job"}
          </button>

          <button
            onClick={() => navigate(/jobs/${job._id})} 
            className="flex-1 h-11 rounded-lg border border-gray-200 font-medium text-sm bg-white 
                       text-gray-900 hover:bg-[#6573D4]/90 hover:text-white hover:shadow-md hover:scale-[1.01] transition-all pixelify-sans-regular"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Calendar Button */}
      <button
        onClick={() => addToGoogleCalendar(job)}
        disabled={isSaved}
        className={`w-full h-11 mt-3 rounded-lg border border-gray-200 font-medium text-sm transition-all
                       ${isSaved
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed pixelify-sans-regular"
                          : "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white hover:shadow-md hover:scale-[1.01] pixelify-sans-regular"}`}
      >
        {isSaved ? "Added to Calendar" : "Add to Calendar"}
      </button>
    </div>
  );
};

export default JobCard;
