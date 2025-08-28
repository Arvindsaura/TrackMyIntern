import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Application from "./pages/Application";
import { AppContext } from "./contexts/AppContext";

import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobDetails from "./JobDetails";
import ResumeUpload from "./components/ResumeUpload";

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Application />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/resume" element={<ResumeUpload />} /> {/* Add the new route */}
      </Routes>
    </div>
  );
};

export default App;
