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
    console.log("Current state:", state);

    if (state === "Sign Up" && !isTextDataSubmitted) {
      console.log("Data not submitted yet, showing image upload for sign-up");
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === "Login") {
        console.log("Logging in with:", email, password);
        const { data } = await axios.post(`${backendUrl}/job-portal/api/company/login`, { email, password });

        console.log('Backend response for login:', data);

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
        console.log("Preparing registration data:");
        console.log("Company Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) {
          console.log("Adding company logo image to form data");
          formData.append("image", image);
        }

        console.log("Registering company with form data:", formData);
        console.log("Form data being sent:", formData);

        const { data } = await axios.post(`${backendUrl}/job-portal/api/company/register`, formData);


        console.log('Backend response for registration:', data);

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
    console.log("Component mounted, setting overflow to 'hidden'");
    document.body.style.overflow = "hidden";
    return () => {
      console.log("Component unmounted, resetting overflow");
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Image selected:", file);

    if (file) {
      if (file.type.startsWith('image/')) {
        console.log("Valid image file selected");
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("Image preview created:", reader.result);
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        console.log("Invalid file type selected, not an image");
        toast.error("Please select a valid image.");
      }
    } else {
      console.log("No file selected");
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
                  onChange={(e) => {
                    console.log("Company Name changed:", e.target.value);
                    setName(e.target.value);
                  }}
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
                onChange={(e) => {
                  console.log("Email changed:", e.target.value);
                  setEmail(e.target.value);
                }}
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
                onChange={(e) => {
                  console.log("Password changed:", e.target.value);
                  setPassword(e.target.value);
                }}
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
