import React from "react";

const features = [
  {
    icon: "src/assets/icons/working-man.png",
    title: "All Major Internships",
    description:
      "Get access to the best internship opportunities from top companies like Microsoft, Google, and Uber—all in one place!",
  },
  {
    icon: "src/assets/icons/track.png",
    title: "Track Your Progress",
    description:
      "Follow your internship application journey with a clear timeline—know when you applied, cleared rounds, and got selected!",
    highlight: true,
  },
  {
    icon: "src/assets/icons/google-calendar.png",
    title: "Google Calendar Sync",
    description:
      "Never miss an important date! Get automatic reminders & email notifications when your internship starts.",
  },
];

const Features = () => {
  return (
    <div className="container mx-auto my-20 px-6 md:px-20 text-center font-['IBM_Plex_Sans']">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 ibm-plex-sans-bold  pixelify-sans-regular">
        How It Works
      </h2>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto ibm-plex-sans-regular">
        We bring all the best internships to one platform, helping you track progress
        and stay notified every step of the way!
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-8 rounded-2xl border border-gray-200
                        transition-transform duration-300 hover:scale-[1.02] shadow-sm
                        ${feature.highlight ? "bg-blue-50 border-blue-100" : "bg-white"}`}
          >
            <img src={feature.icon} alt={feature.title} className="h-12 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-sans-medium">
              {feature.title}
            </h3>
            <p className="text-gray-600 ibm-plex-sans-regular">{feature.description}</p>
            <button
              className={`mt-6 px-6 py-2 rounded-full border border-gray-300 
                          text-gray-900 bg-white hover:bg-blue-50 hover:text-blue-700 
                          transition-colors duration-200  pixelify-sans-regular`}
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
