import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../contexts/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { jobData } from "../components/data";

// Recharts imports
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

import ManualJobForm from "../components/ManualJobForm";
import CalendarView from "../components/CalendarView";

// Your color palette
const COLORS = ["#3626A7", "#7D4AEA", "#B78CF0", "#E2D9F3", "#A6C8FF", "#4E90FF", "#2B6CB0", "#FFB3B3"];

const statusMap = {
  "OA Completed": "Assessment Completed",
  "Round 1 Cleared": "Interview Round 1",
  "Round 2 Cleared": "Interview Round 2",
  "Round 3 Cleared": "Interview Round 3",
  "Applied": "Applied",
  "Offer Received": "Offer Received",
  "Rejected": "Rejected",
  "Interested": "Interested",
  "Withdrawn": "Withdrawn",
  "Assessment Scheduled": "Assessment Scheduled",
  "Assessment Completed": "Assessment Completed",
  "Interview Round 1": "Interview Round 1",
  "Interview Round 2": "Interview Round 2",
  "Interview Round 3": "Interview Round 3",
  "Offer Accepted": "Offer Accepted"
};

const allStatuses = [
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
  "Withdrawn"
];

const Application = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [sortField, setSortField] = useState("dateSaved");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterCampus, setFilterCampus] = useState("All");

  useEffect(() => {
    if (user) fetchSavedJobs();
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const mergedJobs = data.jobs.map(savedJob => {
          const fullJob = jobData.find(job => job._id === savedJob._id);
          return fullJob
            ? { ...fullJob, ...savedJob, status: statusMap[savedJob.status] || "Interested", isManual: false }
            : { ...savedJob, status: statusMap[savedJob.status] || "Interested", isManual: true };
        });
        setSavedJobs(mergedJobs);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = await getToken();
      const backendStatus = statusMap[newStatus] || "Interested";

      await axios.patch(
        `${backendUrl}/api/user/job-status/${jobId}`,
        { status: backendStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSavedJobs(prev =>
        prev.map(job =>
          job._id === jobId ? { ...job, status: backendStatus } : job
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update job status. Please try again.");
    }
  };

  const handleJobRemove = async (jobId) => {
    if (window.confirm("Are you sure you want to remove this job?")) {
      try {
        const token = await getToken();
        await axios.delete(`${backendUrl}/api/user/remove-job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      } catch (error) {
        console.error("Error removing job:", error);
        alert("Failed to remove job. Please try again.");
      }
    }
  };

  const onJobAdded = (newJob) => {
    setSavedJobs(prev => [...prev, { ...newJob, isManual: true, status: "Interested" }]);
    fetchSavedJobs();
    setShowManualForm(false);
  };

  const allTags = [...new Set(savedJobs.flatMap(job => job.tags || []))];

  const filteredJobs = savedJobs.filter(job =>
    (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || job.status === filterStatus) &&
    (filterTag === "All" || (job.tags || []).includes(filterTag)) &&
    (filterCampus === "All" || (filterCampus === "On-Campus" && job.isCampus) || (filterCampus === "Off-Campus" && !job.isCampus))
  ).sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Graph data
  const statusData = Object.values(savedJobs.reduce((acc, job) => {
    acc[job.status] = acc[job.status] || { status: job.status, count: 0 };
    acc[job.status].count += 1;
    return acc;
  }, {}));

  const locationData = Object.values(savedJobs.reduce((acc, job) => {
    const loc = job.location || "Unknown";
    acc[loc] = acc[loc] || { name: loc, value: 0 };
    acc[loc].value += 1;
    return acc;
  }, {}));

  const timeData = savedJobs.sort((a, b) => new Date(a.dateSaved) - new Date(b.dateSaved))
    .map(job => ({ date: new Date(job.dateSaved).toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: 1 }))
    .reduce((acc, job) => {
      const found = acc.find(item => item.date === job.date);
      if (found) found.count += 1;
      else acc.push({ date: job.date, count: 1 });
      return acc;
    }, []);

  const campusData = [
    { name: "On-Campus", value: savedJobs.filter(job => job.isCampus).length },
    { name: "Off-Campus", value: savedJobs.filter(job => !job.isCampus).length }
  ].filter(d => d.value > 0);

  // Summaries
  const totalApplications = savedJobs.length;
  const offersReceived = savedJobs.filter(job => job.status === "Offer Received" || job.status === "Offer Accepted").length;
  const rejectionRate = totalApplications > 0 ? ((savedJobs.filter(job => job.status === "Rejected").length / totalApplications) * 100).toFixed(1) : 0;
  const mostAppliedTag = allTags.length > 0 ? allTags.reduce((a, b) => (savedJobs.filter(j => j.tags?.includes(a)).length > savedJobs.filter(j => j.tags?.includes(b)).length ? a : b)) : "N/A";
  const mostCommonStatus = statusData.length > 0 ? statusData.reduce((a, b) => (a.count > b.count ? a : b)).status : "N/A";


 if (loading) return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
    <div className="relative flex items-center justify-center mb-6">
      {/* Outer spinner with gradient, using Tailwind's built-in spin animation */}
      <div
        className="w-20 h-20 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: '#6573D4',
          borderRightColor: '#6573D4',
          borderBottomColor: '#2B3990',
          borderLeftColor: '#2B3990'
        }}
      ></div>

      {/* Inner glowing core, using Tailwind's built-in pulse animation */}
      <div className="absolute w-8 h-8 bg-[#6573D4] rounded-full animate-pulse shadow-2xl"></div>
    </div>

    {/* Loading text with Gen Z flair */}
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center pixelify-sans-regular">
        Loading...
      </h2>
      <p className="text-gray-400 text-sm md:text-base text-center pixelify-sans-regular">
        your life choices are being calculated
      </p>
    </div>
  </div>
);


  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen ibm-plex-sans-medium text-gray-900">
        <div className="container mx-auto px-6 2xl:px-20 py-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black pixelify-sans-regular"> Application Dashboard</h2>

          <CalendarView savedJobs={savedJobs} />

          <div className="flex flex-wrap items-center gap-4 my-8">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="bg-[#3626A7] hover:bg-[#4E3AC7] text-white px-6 py-2 rounded-lg font-semibold transition pixelify-sans-regular"
            >
              {showManualForm ? "Hide Form" : "Add Job Manually"}
            </button>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none w-full md:w-64 ibm-plex-sans-medium"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none w-full md:w-48 ibm-plex-sans-medium"
            >
              <option value="All">All Statuses</option>
              {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>

            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none w-full md:w-48 ibm-plex-sans-medium"
            >
              <option value="All">All Tags</option>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>

            <select
              value={filterCampus}
              onChange={(e) => setFilterCampus(e.target.value)}
              className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none w-full md:w-48 ibm-plex-sans-medium"
            >
              <option value="All">All Applications</option>
              <option value="On-Campus">On-Campus</option>
              <option value="Off-Campus">Off-Campus</option>
            </select>
          </div>

          {showManualForm && <ManualJobForm backendUrl={backendUrl} onJobAdded={onJobAdded} />}

          {/* Jobs Table */}
          <div className="overflow-x-auto my-8 border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full bg-white text-gray-900 rounded-xl">
              <thead className="bg-[#F9F9FF] text-gray-900 ibm-plex-sans-medium border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left pixelify-sans-regular">Company</th>
                  <th className="py-4 px-6 text-left pixelify-sans-regular">Job Title</th>
                  <th className="py-4 px-6 text-left max-sm:hidden pixelify-sans-regular">Location</th>
                  <th className="py-4 px-6 text-left pixelify-sans-regular">Type</th>
                  <th className="py-4 px-6 text-left pixelify-sans-regular">Status</th>
                  <th className="py-4 px-6 text-left pixelify-sans-regular">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job._id} className="transition hover:bg-gray-50 border-b border-gray-100">
                      <td className="py-3 px-6 flex items-center gap-3">
                        <img src={job.companyId?.image || job.companyImage || "/fallback-logo.png"} alt="logo" className="w-10 h-10 rounded-md object-contain" />
                        <span className="ibm-plex-sans-medium">{job.companyId?.name || job.companyName || "N/A"}</span>
                      </td>
                      <td className="py-3 px-6 ibm-plex-sans-medium">{job.title}</td>
                      <td className="py-3 px-6 max-sm:hidden ibm-plex-sans-medium">{job.location || "N/A"}</td>
                      <td className="py-3 px-6">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${job.isCampus ? 'bg-[#E2D9F3] text-[#3626A7]' : 'bg-[#D6F5E3] text-[#2B6CB0]'}`}>
                          {job.isCampus ? "On-Campus" : "Off-Campus"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <select
                          value={job.status || "Interested"}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className="p-2 rounded-lg border border-gray-200 w-full ibm-plex-sans-medium focus:ring-2 focus:ring-[#3626A7] focus:outline-none"
                        >
                          {allStatuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-6">
                        <button onClick={() => handleJobRemove(job._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition pixelify-sans-regular">Remove</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400 ibm-plex-sans-medium">No saved jobs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Insights Section */}
          <h3 className="text-3xl font-extrabold mt-12 mb-6 text-[#3626A7] pixelify-sans-regular">📊 Insights</h3>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 text-center">
              <p className="text-xl font-bold text-[#3626A7] pixelify-sans-regular">{totalApplications}</p>
              <p className="text-sm text-gray-600 ibm-plex-sans-medium">Total Applications</p>
            </div>
            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 text-center">
              <p className="text-xl font-bold text-[#3626A7] pixelify-sans-regular">{offersReceived}</p>
              <p className="text-sm text-gray-600 ibm-plex-sans-medium">Offers Received</p>
            </div>
            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 text-center">
              <p className="text-xl font-bold text-[#3626A7] pixelify-sans-regular">{rejectionRate}%</p>
              <p className="text-sm text-gray-600 ibm-plex-sans-medium">Rejection Rate</p>
            </div>
            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 text-center">
              <p className="text-xl font-bold text-[#3626A7] pixelify-sans-regular">{mostAppliedTag}</p>
              <p className="text-sm text-gray-600 ibm-plex-sans-medium">Most Applied Tag</p>
            </div>
          </div>

          {/* Text Summary */}
          <div className="p-6 mb-8 bg-[#E2D9F3] rounded-xl border border-gray-200">
            <h4 className="text-xl font-semibold mb-2 pixelify-sans-regular text-[#3626A7]">Your Application Summary</h4>
            <p className="text-gray-800 leading-relaxed ibm-plex-sans-medium">
              You have a total of <span className="font-bold text-[#3626A7]">{totalApplications}</span> job applications. 
              So far, you've received <span className="font-bold text-[#3626A7]">{offersReceived}</span> offers, with a rejection rate of <span className="font-bold text-[#3626A7]">{rejectionRate}%</span>. 
              Your most common application status is <span className="font-bold text-[#3626A7]">{mostCommonStatus}</span>, indicating a focus on {mostCommonStatus.toLowerCase()}s. 
              The most frequent tag in your applications is <span className="font-bold text-[#3626A7]">{mostAppliedTag}</span>, showing your primary area of interest. 
              Keep up the great work!
            </p>
          </div>

          {/* Graph Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold mb-4 pixelify-sans-regular">Applications by Status</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="status" stroke="#333" className="pixelify-sans-regular text-xs" />
                  <YAxis stroke="#333" className="pixelify-sans-regular text-xs" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3626A7" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold mb-4 pixelify-sans-regular">Jobs by Location</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={locationData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ bottom: -20, left: 0 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-[#F9F9FF] rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold mb-4 pixelify-sans-regular">Campus vs Off-Campus</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={campusData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {campusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ bottom: -20, left: 0 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-[#F9F9FF] rounded-xl md:col-span-2 border border-gray-200 shadow-sm">
              <h4 className="text-xl font-semibold mb-4 pixelify-sans-regular">Applications Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" stroke="#333" className="pixelify-sans-regular text-xs" />
                  <YAxis stroke="#333" className="pixelify-sans-regular text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3626A7" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Application;