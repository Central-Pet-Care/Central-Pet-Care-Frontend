import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ServiceHome() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/service")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <Link to="/services">
            <h2 className="text-3xl md:text-4xl font-extrabold text-purple-800 hover:scale-105 transition-transform inline-block">
              Our Pet Care Services
            </h2>
          </Link>
          <p className="text-gray-600 mt-3 text-base md:text-lg">
            Trusted services to keep your pets happy & healthy ✨
          </p>
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Loading & Error */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-10 w-10 border-4 border-purple-300 border-t-purple-700 rounded-full"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No services available.</p>
        ) : (
          <>
            {/* Services Grid (only 5) */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center">
              {services.slice(0, 5).map((service) => (
                <div
                  key={service._id}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:border-purple-400 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 w-full"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={service.images?.[0] || "https://via.placeholder.com/300"}
                      alt={service.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    <h3 className="text-purple-800 font-bold text-lg mb-1 tracking-wide">
                      {service.serviceName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-snug line-clamp-2">
                      {service.miniDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-12">
              <Link to="/services">
                <button className="px-7 py-3 rounded-full shadow-md bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-transform">
                  Explore All Services
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
