import React, { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import { useAuth } from "@clerk/clerk-react";

const ResumeUpload = () => {
  const { backendUrl, userData, setUserData } = useContext(AppContext);
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setMessage(""); // Clear message on new file selection
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setMessage("Uploading...");
    
    try {
      const token = await getToken();
      if (!token) {
        setMessage("You must be logged in to upload a resume.");
        setIsUploading(false);
        return;
      }
      
      // Use FormData to send the file
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${backendUrl}/api/user/upload-resume`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        // Update the user data in the context
        setUserData({ ...userData, resumeUrl: data.resumeUrl, skills: data.skills });
        setFile(null); // Clear the file input
      } else {
        setMessage(data.message || "Failed to upload resume.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Upload Your Resume</h2>
        <p className="text-gray-600 text-center mb-6">
          Upload your resume in PDF format to automatically extract your skills.
        </p>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-[#3626A7]
                       hover:file:bg-blue-100 transition-all cursor-pointer"
          />
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full py-3 rounded-lg font-medium transition-all
                        ${isUploading || !file ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#3626A7] text-white hover:bg-[#4169E1]"}`}
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        {userData?.skills?.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Extracted Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
