import React, { useContext, useRef, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroShapesRef = useRef([]);

  useEffect(() => {
    // Hero text fade-up animation
    gsap.from(heroTextRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heroTextRef.current,
        start: "top 80%",
      },
    });

    // Floating shapes gentle movement
    heroShapesRef.current.forEach((shape, i) => {
      gsap.to(shape, {
        y: i % 2 === 0 ? -20 : 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 4 + i,
      });
    });

    // Smooth scroll for the entire page
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 0.5,
      ease: "power1.inOut",
    });
  }, []);

  const handleSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  return (
    <section className="relative bg-[#FBFBFF] min-h-screen flex flex-col justify-center px-6 md:px-20 font-['IBM_Plex_Sans'] overflow-hidden">
      {/* Floating Abstract Shapes */}
      {["#3626A7", "#FF331F", "#657ED4"].map((color, idx) => (
        <div
          key={idx}
          ref={(el) => (heroShapesRef.current[idx] = el)}
          className="absolute rounded-lg mix-blend-multiply opacity-20 blur-3xl"
          style={{
            width: `${64 + idx * 20}px`,
            height: `${64 + idx * 20}px`,
            backgroundColor: color,
            top: `${idx * 20}%`,
            left: `${20 + idx * 15}%`,
          }}
        ></div>
      ))}

      {/* Hero Content */}
      <div ref={heroTextRef} className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#0D0106] leading-tight">
          🚀 Find Your Dream Job Effortlessly
        </h1>
        <p className="text-lg md:text-xl text-[#3626A7] max-w-3xl mx-auto">
          Explore thousands of top career opportunities and take your next step toward success.
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center gap-4 justify-center max-w-3xl mx-auto">
          <input
            ref={titleRef}
            type="text"
            placeholder="Job title, keywords..."
            className="flex-1 p-4 rounded-xl border border-[#657ED4] focus:ring-2 focus:ring-[#3626A7] focus:outline-none shadow-md text-[#0D0106] bg-[#FBFBFF]"
          />
          <input
            ref={locationRef}
            type="text"
            placeholder="Location"
            className="flex-1 p-4 rounded-xl border border-[#657ED4] focus:ring-2 focus:ring-[#3626A7] focus:outline-none shadow-md text-[#0D0106] bg-[#FBFBFF]"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-4 rounded-xl bg-[#FF331F] text-white font-semibold hover:bg-[#FF4D3F] transition-all shadow-md"
          >
            Search
          </button>
        </div>
      </div>

      {/* Subtle Pixel Overlay */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none">
        {Array.from({ length: 400 }).map((_, idx) => (
          <div key={idx} className="w-full h-full border border-[#FBFBFF]/5"></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
