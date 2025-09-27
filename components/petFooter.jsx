
import { useNavigate } from "react-router-dom";
import { FaPaw, FaSmile, FaUsers, FaHeart } from "react-icons/fa";

export default function PetFooter() {
  const navigate = useNavigate();

  const stats = [
    { icon: <FaPaw className="text-5xl text-purple-500" />, value: "250+", label: "Pets Adopted" },
    { icon: <FaUsers className="text-5xl text-pink-500" />, value: "50+", label: "Available Now" },
    { icon: <FaSmile className="text-5xl text-fuchsia-500" />, value: "120+", label: "Happy Families" },
    { icon: <FaHeart className="text-5xl text-rose-500" />, value: "15+", label: "Volunteers" },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center text-center py-20 px-6 bg-gradient-to-b from-purple-50 via-white to-pink-50 overflow-hidden">
      
      {/* Floating Paw Background */}
      <FaPaw className="absolute text-purple-100 text-7xl top-10 left-10 animate-bounce-slow" />
      <FaPaw className="absolute text-pink-100 text-6xl bottom-20 right-12 animate-bounce-slow delay-200" />
      <FaPaw className="absolute text-fuchsia-100 text-5xl top-1/2 left-4 animate-bounce-slow delay-500" />

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent mb-14 animate-fade-in">
        Together, We’re Making a Difference
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl w-full animate-fade-in delay-200">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-8 shadow-md bg-gradient-to-br from-pink-50 via-white to-purple-50 border border-purple-100 hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center gap-3"
          >
            {stat.icon}
            <p className="text-3xl font-extrabold text-purple-700">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-14 animate-fade-in delay-300">
        {/* Solid Gradient Button */}
        <button
          onClick={() => navigate("/pets")}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          🐾 Adopt Now
        </button>

        {/* Outlined Button */}
        <button
          onClick={() => navigate("/volunteer")}
          className="flex items-center gap-2 px-8 py-3 rounded-full border border-purple-400 text-purple-600 font-semibold bg-white shadow-md hover:bg-purple-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          💜 Learn More
        </button>
      </div>

      {/* Testimonial */}
      <div className="mt-16 max-w-2xl mx-auto rounded-3xl p-10 shadow-md bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-purple-100 relative hover:shadow-lg transition-shadow duration-500 animate-fade-in delay-500">
        <div className="absolute -top-6 -left-6 text-purple-200 text-6xl">“</div>
        <p className="italic text-gray-600 text-lg leading-relaxed">
          This platform helped us find our perfect puppy in just 2 days! We are forever grateful.
        </p>
        <p className="mt-6 font-semibold text-purple-600 text-xl">— A Happy Family</p>
      </div>

      
    </div>
  );
}

