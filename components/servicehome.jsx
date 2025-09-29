import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Servicehome() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/service")
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
    <section className="py-14 px-6 bg-purple-100">
      {/* Heading */}
      <div className="text-center mb-10">
        <Link to="/services">
          <h2
            className="text-3xl md:text-4xl font-extrabold 
                       text-[#6A0DAD] hover:scale-105 
                       transition-transform inline-block"
          >
            🐾 Our Pet Care Services
          </h2>
        </Link>
        <p className="text-gray-600 mt-3 text-base md:text-lg">
          Trusted services to keep your pets happy & healthy ✨
        </p>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <p className="text-center text-gray-500">Loading services...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-500">No services available.</p>
      ) : (
        <>
          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto">
            {services.slice(0, 5).map((service) => (
              <div
                key={service._id}
                className="relative bg-white rounded-2xl shadow-md overflow-hidden 
                           border border-transparent bg-clip-padding 
                           hover:border-purple-400 hover:shadow-xl 
                           hover:scale-[1.03] transition-all duration-300"
              >
                {/* Image with overlay */}
                <div className="relative">
                  <img
                    src={
                      service.images?.[0] ||
                      "https://via.placeholder.com/300"
                    }
                    alt={service.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Card Content */}
                <div className="p-3 text-center">
                  {/* Service Name */}
                  <h3
                    className="text-[#5A0CAB] font-bold 
                               text-base md:text-lg mb-1 tracking-wide"
                  >
                    {service.serviceName}
                  </h3>
                  {/* Mini description */}
                  <p className="text-gray-700 text-xs leading-snug line-clamp-2">
                    {service.miniDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link to="/services">
              <button
                className="px-7 py-3 rounded-full shadow-md 
                           bg-[#6A0DAD] text-white font-semibold 
                           hover:bg-purple-800 hover:scale-105 transition-transform"
              >
                Explore All Services
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
