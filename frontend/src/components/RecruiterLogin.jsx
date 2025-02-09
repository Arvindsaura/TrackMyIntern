import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const navigate = useNavigate();
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submit triggered");

    // Check for sign-up step and ensure data is submitted for the image
    if (state === "Sign Up" && !isTextDataSubmitted) {
      console.log("Data not submitted yet, showing image upload for sign-up");
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === "Login") {
        console.log("Logging in with:", email, password);
        const { data } = await axios.post(`${backendUrl}/job-portal/api/company/login`, { email, password });

        console.log('Backend URL:', backendUrl);

        if (data.success) {
          console.log("Login successful:", data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          console.log("Login failed:", data.message);
          toast.error(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        console.log("Registering company with:", formData);

        const { data } = await axios.post(`${backendUrl}/job-portal/api/company/register`, formData);

        console.log('Backend URL:', backendUrl);

        if (data.success) {
          console.log("Registration successful:", data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          console.log("Registration failed:", data.message);
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image">
              <img
                className="w-16 rounded-full"
                src={imagePreview || assets.upload_area}
                alt="Logo"
              />
              <input onChange={handleImageChange} type="file" id="image" hidden />
            </label>
            <p>Upload Company <br /> logo</p>
          </div>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="Company" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="Email" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="Password" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="Password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot Password?</p>
        )}

        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === "Login" ? "Login" : isTextDataSubmitted ? "Create Account" : "Next"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span onClick={() => setState("Sign Up")} className="text-blue-600 cursor-pointer">
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span onClick={() => setState("Login")} className="text-blue-600 cursor-pointer">
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
