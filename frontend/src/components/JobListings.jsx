import React, { useState, useEffect, useRef, useContext } from "react";
import { jobData } from "./data";
import JobCard from "./JobCard";
import { JobCategories, JobLocations } from "../assets/assets";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AppContext } from "../contexts/AppContext";

gsap.registerPlugin(ScrollTrigger);

const popularLocations = ["New York", "San Francisco", "London", "Remote"];
const stipendRanges = [
  { label: "< ₹20k", min: 0, max: 20000 },
  { label: "₹20k - ₹40k", min: 20000, max: 40000 },
  { label: "> ₹40k", min: 40000, max: Infinity },
];

const JobListings = () => {
  const { savedJobs } = useContext(AppContext);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedStipends, setSelectedStipends] = useState([]);
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [sortBy, setSortBy] = useState("applyDate-desc"); // Default sort
  const [filteredJobs, setFilteredJobs] = useState(jobData);
  const listingsRef = useRef(null);

 // Animate cards
 useEffect(() => {
   const cards = listingsRef.current?.querySelectorAll(".job-card");
   if (!cards || cards.length === 0) return; // Add this check!

   const ctx = gsap.context(() => {
     gsap.from(cards, {
       opacity: 0,
       y: 50,
       stagger: 0.1,
       duration: 0.8,
       ease: "power3.out",
       scrollTrigger: {
         trigger: listingsRef.current,
         start: "top 85%",
       },
     });
   }, listingsRef);

   return () => ctx.revert();
 }, [filteredJobs]);

  // Filtering and Sorting logic
  useEffect(() => {
    let newFilteredJobs = jobData.filter((job) => {
      const matchLevel =
        selectedLevels.length === 0 || selectedLevels.includes(job.level);
      const matchLocation =
        selectedLocations.length === 0 || selectedLocations.includes(job.location);
      const matchTitle =
        searchFilter.title === "" ||
        job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
      const matchSearchLoc =
        searchFilter.location === "" ||
        job.location.toLowerCase().includes(searchFilter.location.toLowerCase());
      const matchSkills = 
        selectedSkills.length === 0 || 
        selectedSkills.every(skill => job.requiredSkills.includes(skill));
      
      // FIX: Clean the stipend string before parsing
      const stipendValue = parseFloat(job.stipend.replace(/[^0-9.]/g, ''));
      const matchStipend =
        selectedStipends.length === 0 ||
        selectedStipends.some(rangeLabel => {
          const range = stipendRanges.find(r => r.label === rangeLabel);
          return stipendValue >= range.min && stipendValue <= range.max;
        });

      return matchLevel && matchLocation && matchTitle && matchSearchLoc && matchSkills && matchStipend;
    });

    // Apply sorting
    if (sortBy === "stipend-desc") {
      newFilteredJobs.sort((a, b) => parseFloat(b.stipend.replace(/[^0-9.]/g, '')) - parseFloat(a.stipend.replace(/[^0-9.]/g, '')));
    } else if (sortBy === "stipend-asc") {
      newFilteredJobs.sort((a, b) => parseFloat(a.stipend.replace(/[^0-9.]/g, '')) - parseFloat(b.stipend.replace(/[^0-9.]/g, '')));
    } else if (sortBy === "applyDate-desc") {
      newFilteredJobs.sort((a, b) => new Date(b.applyDate) - new Date(a.applyDate));
    } else if (sortBy === "applyDate-asc") {
      newFilteredJobs.sort((a, b) => new Date(a.applyDate) - new Date(b.applyDate));
    }

    setFilteredJobs(newFilteredJobs);
  }, [searchFilter, selectedLocations, selectedLevels, selectedSkills, selectedStipends, sortBy]);

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((c) => c !== location) : [...prev, location]
    );
  };
  
  const handleLevelChange = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleStipendChange = (rangeLabel) => {
    setSelectedStipends((prev) => 
      prev.includes(rangeLabel) ? prev.filter(r => r !== rangeLabel) : [...prev, rangeLabel]
    );
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedLocations([]);
    setSelectedLevels([]);
    setSelectedSkills([]);
    setSelectedStipends([]);
    setSearchFilter({ title: "", location: "" });
  };

  const hasActiveFilters =
    selectedLocations.length > 0 ||
    selectedLevels.length > 0 ||
    selectedSkills.length > 0 ||
    selectedStipends.length > 0 ||
    searchFilter.title !== "" ||
    searchFilter.location !== "";

  const allLevels = [...new Set(jobData.map(job => job.level))];
  const allSkills = [...new Set(jobData.flatMap(job => job.requiredSkills))];

  return (
    <section className="relative bg-white min-h-screen py-16 px-6 md:px-20 font-['IBM_Plex_Sans']">
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 pixelify-sans-regular">
          Explore the Best{" "}
          <br />
          <span className="text-[#3626A7] dm-sans-medium">Internship Opportunities</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 ibm-plex-sans-regular">
          Find your dream internship from top companies!
        </p>
      </div>

      {/* Filters and Sorts */}
      <div className="relative z-10 max-w-6xl mx-auto mt-10 mb-12 p-6 bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6 border border-gray-100">
        <input
          type="text"
          name="title"
          placeholder="🔎 Search by job title..."
          value={searchFilter.title}
          onChange={handleSearchChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3626A7] focus:outline-none shadow-sm transition ibm-plex-sans-regular"
        />
        <input
          type="text"
          name="location"
          placeholder="📍 Search by location..."
          value={searchFilter.location}
          onChange={handleSearchChange}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3626A7] focus:outline-none shadow-sm transition ibm-plex-sans-regular"
        />
        <select
          className="w-full p-4 border border-gray-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3626A7] shadow-sm transition ibm-plex-sans-regular"
          onChange={(e) => handleLevelChange(e.target.value)}
          value=""
        >
          <option value="" disabled>💼 Filter by Level</option>
          {allLevels.map((level, index) => (
            <option key={index} value={level}>
              {level}
            </option>
          ))}
        </select>
        <select
          className="w-full p-4 border border-gray-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3626A7] shadow-sm transition ibm-plex-sans-regular"
          onChange={(e) => handleSkillChange(e.target.value)}
          value=""
        >
          <option value="" disabled>🛠️ Filter by Skill</option>
          {allSkills.map((skill, index) => (
            <option key={index} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <select
          className="w-full p-4 border border-gray-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3626A7] shadow-sm transition ibm-plex-sans-regular"
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="applyDate-desc">📅 Sort by Date (Newest)</option>
          <option value="applyDate-asc">📅 Sort by Date (Oldest)</option>
          <option value="stipend-desc">💰 Sort by Stipend (High to Low)</option>
          <option value="stipend-asc">💰 Sort by Stipend (Low to High)</option>
        </select>
      </div>

      {/* Popular Locations and Stipends */}
      <div className="relative z-10 max-w-6xl mx-auto mb-8 flex flex-wrap items-center gap-2">
        <span className="text-gray-600 ibm-plex-sans-bold">Popular Locations:</span>
        {popularLocations.map((location, index) => (
          <button
            key={index}
            onClick={() => handleLocationChange(location)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                        ${selectedLocations.includes(location)
                          ? "bg-[#3626A7] text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {location}
          </button>
        ))}
      </div>
      <div className="relative z-10 max-w-6xl mx-auto mb-8 flex flex-wrap items-center gap-2">
        <span className="text-gray-600 ibm-plex-sans-bold">Stipend Ranges:</span>
        {stipendRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => handleStipendChange(range.label)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1
                        ${selectedStipends.includes(range.label)
                          ? "bg-[#3626A7] text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0ZM8 2.5a5.5 5.5 0 1 1-5.5 5.5A5.5 5.5 0 0 1 8 2.5ZM8 4a4 4 0 1 0 4 4A4 4 0 0 0 8 4ZM8 5.5a2.5 2.5 0 1 1-2.5 2.5A2.5 2.5 0 0 1 8 5.5ZM7.5 7h1v1.5H7.5V7Zm0-1h1V4.5H7.5V6Zm-1 1h1v1.5H6.5V7Zm-1 0h1v1.5H5.5V7Zm-1 0h1v1.5H4.5V7Zm-1 0h1v1.5H3.5V7Zm-1 0h1v1.5H2.5V7Zm-.5-1h1v1.5H1.5V6Zm1 0h1v1.5H2.5V6Zm1 0h1v1.5H3.5V6Zm1 0h1v1.5H4.5V6Zm1 0h1v1.5H5.5V6Zm1 0h1v1.5H6.5V6Zm-1-1h1V4.5H5.5V5Zm-1 0h1V4.5H4.5V5Zm-1 0h1V4.5H3.5V5Zm-1 0h1V4.5H2.5V5Zm-1 0h1V4.5H1.5V5ZM1 6h1v1.5H1V6ZM0.5 7h1v1.5H0.5V7Z" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
            {range.label}
          </button>
        ))}
      </div>

      {/* Active Filters and Clear All Button */}
      {hasActiveFilters && (
        <div className="relative z-10 max-w-6xl mx-auto mb-8 flex flex-wrap items-center gap-2">
          <span className="text-gray-600 ibm-plex-sans-bold">Active Filters:</span>
          
          {selectedLevels.map((level, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-1 cursor-pointer"
              onClick={() => handleLevelChange(level)}
            >
              {level}
              <span className="ml-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                &times;
              </span>
            </span>
          ))}

          {selectedSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-1 cursor-pointer"
              onClick={() => handleSkillChange(skill)}
            >
              {skill}
              <span className="ml-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                &times;
              </span>
            </span>
          ))}

          {selectedStipends.map((stipend, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-1 cursor-pointer"
              onClick={() => handleStipendChange(stipend)}
            >
              {stipend}
              <span className="ml-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                &times;
              </span>
            </span>
          ))}
          
          {selectedLocations.map((location, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-1 cursor-pointer"
              onClick={() => handleLocationChange(location)}
            >
              {location}
              <span className="ml-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                &times;
              </span>
            </span>
          ))}

          {searchFilter.title && (
            <span
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-1 cursor-pointer"
              onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
            >
              Title: {searchFilter.title}
              <span className="ml-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                &times;
              </span>
            </span>
          )}

          {searchFilter.location && (
            <span
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center gap-1 cursor-pointer"
              onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
            >
              Location: {searchFilter.location}
              <span className="ml-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                &times;
              </span>
            </span>
          )}

          <button
            onClick={handleClearFilters}
            className="ml-auto px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg ibm-plex-sans-bold transition-colors hover:bg-red-200"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Job Listings */}
      <div
        ref={listingsRef}
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} savedJobs={savedJobs} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-lg py-10 ibm-plex-sans-regular">
            ❌ No jobs found matching your filters.
          </p>
        )}
      </div>
    </section>
  );
};

export default JobListings;
