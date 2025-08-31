import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer spinner with gradient, using Tailwind's built-in spin animation */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent animate-spin"
             style={{
               borderTopColor: '#6573D4',
               borderRightColor: '#6573D4',
               borderBottomColor: '#2B3990',
               borderLeftColor: '#2B3990'
             }}
        ></div>
        
        {/* Inner glowing core, using Tailwind's built-in pulse animation */}
        <div className="absolute w-8 h-8 bg-[#6573D4] rounded-full animate-pulse shadow-2xl"></div>
      </div>
      
      {/* Loading text with Gen Z flair */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center pixelify-sans-regular">
          Loading...
        </h2>
        <p className="text-gray-400 text-sm md:text-base text-center pixelify-sans-regular">
          your life choices are being calculated
        </p>
      </div>
    </div>
  );
};

export default Loading;
