import { useNavigate } from "react-router-dom";

export default function AdoptionStats() {
  const navigate = useNavigate();

  return (
    <section className="w-full relative bg-gradient-to-r from-purple-50 via-purple-50 to-purple-50 py-12 md:py-16 shadow-inner">
      <div className="max-w-5xl mx-auto text-center px-6">
        {/* 🐾 Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-4">
          Ready to Find Your New Best Friend? 🐶🐱
        </h2>

        {/* 📝 Subtitle */}
        <p className="text-gray-800 text-lg max-w-2xl mx-auto mb-6">
          Thousands of loving pets are waiting for a family. Give them a{" "}
          <span className="text-purple-700 font-semibold">second chance</span>{" "}
          and bring joy into your life!
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/pets")}
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
        >
          Browse Pets
        </button>
      </div>

      {/* Smooth Gradient Divider at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-b from-purple-200 to-purple-100"></div>
    </section>
  );
}
