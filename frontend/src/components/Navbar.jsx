import React, { useContext } from "react";

import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm font-sans">
      <div className="container px-6 2xl:px-20 mx-auto flex justify-between items-center relative">
        <h1 
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl sm:text-3xl font-bold text-[#3626A7] transition-all duration-300 transform hover:scale-105 pixelify-sans-regular"
        >
          TrackMyIntern
        </h1>
        {user ? (
          <div className="flex items-center gap-4 font-medium">
            <Link 
              to="/applications" 
              className="px-4 py-2  text-[#3626A7] rounded-lg  hover:text-red-500 transition-all duration-300 font-semibold pixelify-sans-regular"
            >
              Applied Jobs
            </Link>
            <p className="hidden sm:block text-gray-700 font-medium tracking-wide">
              Hi, <span className="text-[#3626A7] font-semibold">{user.firstName}</span>
            </p>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="px-6 py-2 bg-[#3626A7] text-white rounded-lg font-medium border border-[#3626A7] hover:bg-white hover:text-[#3626A7] transition-all duration-300 font-semibold"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;