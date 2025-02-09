import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(backendUrl); // Should log: http://localhost:5000
  
  const { user } = useUser();
  const { getToken } = useAuth();

  // Function to fetch job data
  const fetchJobs = async () => {
    try {
      console.log("Fetching jobs...");
      const { data } = await axios.get(backendUrl + "/api/jobs");

      console.log("Fetched jobs response:", data); // Debug the response structure

      if (data.success) {
        setJobs(data.jobs);
        console.log("Jobs set in state:", data.jobs); // Debug jobs state after setting
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching jobs:", error); // Debug any errors while fetching
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      console.log("Fetching company data...");
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching company data:", error);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  // Fetch user's applied applications
  const fetchUserApplications = async () => {
    try {
      console.log("Fetching user applications...");
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching user applications:", error);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    console.log("AppContext loaded. Fetching jobs...");
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

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
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
