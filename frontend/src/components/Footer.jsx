import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
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
          href="https://your-portfolio-link.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 font-medium hover:text-blue-600 transition-colors ibm-plex-sans-medium"
        >
          Arvind Puri
        </a>{" "}
       
      </p>

      <div className="flex gap-3 mt-2 md:mt-0">
        <a href="mailto:arvindpuri1492@gmail.com" target="_blank" rel="noopener noreferrer" className="mt-2">
         arvindpuri1492@gmail.com
        </a>
        <a href="https://x.com/arvindsaura?t=7Pi5eEAmpKv8xmLeajRqqg&s=08" target="_blank" rel="noopener noreferrer">
          <img className="w-10 h-10 object-contain transition-all duration-300 transform hover:scale-110" src={assets.twitter_icon} alt="Twitter" />
        </a>
        <a href="https://www.instagram.com/arvindsaura.exe?igsh=ajRjMG15ZXF4N2hl" target="_blank" rel="noopener noreferrer">
          <img className="w-10 h-10 object-contain transition-all duration-300 transform hover:scale-110" src={assets.instagram_icon} alt="Instagram" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
