import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="container px-4 2xl:px-20 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 mt-20 border-t border-gray-200 ibm-plex-sans-regular">
      <h1
        onClick={() => navigate("/")}
        className="cursor-pointer text-2xl sm:text-3xl font-bold text-[#3626A7] transition-all duration-300 transform hover:scale-105 pixelify-sans-regular"
      >
        TrackMyIntern
      </h1>

      <p className="flex-1 text-center md:text-left text-sm text-gray-500 mt-2 md:mt-0 ibm-plex-sans-regular">
        A project by{" "}
        <a
          href="https://my-portfolio-zeta-six-85.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 font-medium hover:text-blue-600 transition-colors ibm-plex-sans-medium"
        >
          Arvind Puri
        </a>
      </p>

      <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-0 text-sm text-gray-600">
        <a
          href="mailto:arvindpuri1492@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          arvindpuri1492@gmail.com
        </a>
        <a
          href="https://x.com/arvindsaura"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          @arvindsaura (X)
        </a>
        <a
          href="https://www.instagram.com/arvindsaura.exe"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          @arvindsaura.exe (Instagram)
        </a>
      </div>
    </div>
  );
};

export default Footer;
