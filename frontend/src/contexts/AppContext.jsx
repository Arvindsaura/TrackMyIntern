import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null); // includes savedJobs

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const { user } = useUser(); // Clerk user object
  const { getToken } = useAuth(); // Clerk token function


  // ===================== USER DATA =====================
  const fetchUserData = async () => {
    try {
      if (!user) return; // Only fetch if user is logged in
      
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/user/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user); // includes savedJobs
       
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      if (error.response?.status === 401) {
       
      } else {
       
      }
    }
  };

  // ===================== SAVE JOB =====================
  const saveJob = async (jobId) => {
    if (!user) {
      toast.error("You must be logged in to save jobs.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Unable to get authentication token.");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/save-job`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Job saved successfully!");
        // Refresh userData to update savedJobs
        fetchUserData();
      } else {
        toast.error(data.message || "Failed to save job");
      }
    } catch (error) {
     
      toast.error("Error saving job");
    }
  };

 
 

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [user]);

  // ===================== CONTEXT VALUE =====================
  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyData,
    setCompanyToken,
    companyData,
    backendUrl,
    userData,
    setUserData,
    saveJob, // function to save job
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
