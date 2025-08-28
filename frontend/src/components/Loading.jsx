import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        {/* Outer spinner */}
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-royalblue shadow-md"></div>
        
        {/* Inner glowing dot */}
        <div className="absolute w-4 h-4 bg-royalblue rounded-full shadow-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;
