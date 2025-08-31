import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer spinner with gradient */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent animate-spin-slow"
             style={{
               borderTopColor: '#6573D4',
               borderRightColor: '#6573D4',
               borderBottomColor: '#2B3990',
               borderLeftColor: '#2B3990'
             }}
        ></div>
        
        {/* Inner glowing core */}
        <div className="absolute w-8 h-8 bg-[#6573D4] rounded-full animate-pulse-fast shadow-2xl"></div>
      </div>
      
      {/* Loading text with Gen Z flair */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center pixelify-sans-regular">
          Loading...
        </h2>
        <p className="text-gray-400 text-sm md:text-base text-center pixelify-sans-regular">
          The vibes are being computed.
        </p>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-fast {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
