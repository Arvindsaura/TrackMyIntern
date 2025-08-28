import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const ManualJobForm = ({ backendUrl, onJobAdded }) => {
  const { getToken } = useAuth();
  const [job, setJob] = useState({
    title: "",
    companyName: "",
    location: "",
    isCampus: false,
    status: "Interested",
    tags: [],
    resources: [{ title: "", url: "" }],
    applicationDeadline: "",
    notes: ""
  });
  const [newTag, setNewTag] = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setJob(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleResourceChange = (index, e) => {
    const newResources = [...job.resources];
    newResources[index][e.target.name] = e.target.value;
    setJob(prev => ({ ...prev, resources: newResources }));
  };

  const addResourceField = () => {
    setJob(prev => ({
      ...prev,
      resources: [...prev.resources, { title: "", url: "" }]
    }));
  };

  const handleAddTag = e => {
    e.preventDefault();
    if (newTag.trim() && !job.tags.includes(newTag.trim())) {
      setJob(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = tagToRemove => {
    setJob(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = await getToken();
      const jobData = { ...job, dateSaved: new Date().toISOString() };
      const { data } = await axios.post(
        `${backendUrl}/api/user/manual-job`,
        { job: jobData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        onJobAdded(data.job);
        setJob({
          title: "",
          companyName: "",
          location: "",
          isCampus: false,
          status: "Interested",
          tags: [],
          resources: [{ title: "", url: "" }],
          applicationDeadline: "",
          notes: ""
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add job");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 mb-8 rounded-2xl bg-white border border-gray-100 shadow-lg ibm-plex-sans-regular"
    >
      <h3 className="text-3xl mb-6 text-[#3626A7] font-extrabold pixelify-sans-regular">
        Add Manual Job
      </h3>

      {/* Main Job Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none ibm-plex-sans-regular placeholder-gray-400"
          required
        />
        <input
          name="companyName"
          value={job.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none ibm-plex-sans-regular placeholder-gray-400"
          required
        />
        <input
          name="location"
          value={job.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none ibm-plex-sans-regular placeholder-gray-400"
          required
        />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isCampus"
            name="isCampus"
            checked={job.isCampus}
            onChange={handleChange}
            className="w-4 h-4 text-[#3626A7] bg-gray-100 border-gray-300 rounded focus:ring-[#3626A7]"
          />
          <label htmlFor="isCampus" className="text-sm text-gray-700 ibm-plex-sans-medium">
            On-Campus
          </label>
        </div>
        <div className="relative col-span-2">
          <label htmlFor="applicationDeadline" className="absolute -top-2 left-3 text-[10px] text-gray-400 bg-white px-1">
            Deadline
          </label>
          <input
            name="applicationDeadline"
            id="applicationDeadline"
            type="date"
            value={job.applicationDeadline}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-200 ibm-plex-sans-regular text-gray-700 focus:ring-2 focus:ring-[#3626A7] focus:outline-none"
          />
        </div>
      </div>

      {/* Tags and Resources Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Tags */}
        <div className="flex-1">
          <h4 className="font-medium text-lg mb-2 ibm-plex-sans-medium text-[#3626A7]">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {job.tags.map(tag => (
              <span
                key={tag}
                className="bg-[#F0E6FF] text-[#3626A7] px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ibm-plex-sans-regular"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[#3626A7] hover:text-red-500 transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add tag"
              className="p-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3626A7] focus:outline-none flex-grow ibm-plex-sans-regular placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-[#4169E1] text-white rounded-xl hover:bg-[#3626A7] transition ibm-plex-sans-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Resources */}
       
      </div>

      {/* Notes */}
      <textarea
        name="notes"
        value={job.notes}
        onChange={handleChange}
        placeholder="Notes..."
        className="w-full p-3 mb-6 rounded-xl border border-gray-200 h-24 focus:ring-2 focus:ring-[#3626A7] focus:outline-none ibm-plex-sans-regular placeholder-gray-400"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-3 bg-[#3626A7] text-white rounded-xl hover:bg-[#2a1e91] transition w-full font-bold text-lg pixelify-sans-regular"
      >
        Add Job to Tracker
      </button>
    </form>
  );
};

export default ManualJobForm;