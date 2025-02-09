import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";

const AddJobs = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions
    if (!companyToken) {
      toast.error("Company token is missing.");
      return;
    }

    if (!title || !quillRef.current.root.innerHTML.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);

    try {
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error posting job:", error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;  // Cleanup on unmount
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="container p-4 flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Job Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Job Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
          >
            <option value="Beginner">Beginner level</option>
            <option value="Intermediate">Intermediate level</option>
            <option value="Senior">Senior level</option>
          </select>
        </div>
      </div>
      <div>
        <p className="mb-2">Job Salary</p>
        <input
          className="w-full px-3 py-2 border-2 border-gray-300 rounded lg:w-[120px]"
          type="number"
          min={0}
          placeholder="2500"
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
        />
      </div>
      <button
        className={`w-28 py-3 mt-4 bg-gray-900 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
};

export default AddJobs;
