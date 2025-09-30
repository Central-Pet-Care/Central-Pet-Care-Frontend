import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/navBar";
import Footer from "../components/footer";
import {
  PawPrint,
  ShieldCheck,
  Clock,
  Heart,
  Stethoscope,
  Users,
  Star,
} from "lucide-react";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/service/${id}`)
      .then((res) => {
        setService(res.data);
        // fetch related services
        axios
          .get(`http://localhost:5000/api/service`)
          .then((all) => {
            const filtered = all.data.filter(
              (s) => s._id !== res.data._id && s.category === res.data.category
            );
            setRelated(filtered.slice(0, 6));
          })
          .catch(() => {});
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load service");
      });
  }, [id]);

  useEffect(() => {
    if (!service?.images || service.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === service.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [service]);

  if (error) {
    return <h1 className="text-center text-2xl text-red-500 mt-20">{error}</h1>;
  }

  if (!service) {
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  }

  const images =
    service.images && service.images.length > 0
      ? service.images
      : ["https://via.placeholder.com/800x500"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-purple-100 py-20">
        <div className="max-w-4xl mx-auto text-left px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 leading-snug">
            {service.serviceName}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed">
            {service.miniDescription}
          </p>
          <div className="mt-8">
            <span className="block h-1 w-20 bg-purple-600 rounded-full"></span>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Image + Info */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 grid md:grid-cols-2 gap-14 items-center border border-purple-200/40">
          {/* Image Showcase */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-3">
              <div className="w-full h-[480px] flex items-center justify-center">
                <img
                  src={images[currentImage]}
                  alt={service.serviceName}
                  className="w-full h-full object-cover rounded-2xl transition-all duration-1000 ease-in-out transform hover:scale-105"
                />
              </div>
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div className="flex justify-center mt-6 gap-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      currentImage === index
                        ? "bg-purple-700 scale-110 shadow-md"
                        : "bg-purple-300 hover:bg-purple-400"
                    }`}
                  ></button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-800 bg-clip-text text-transparent">
              {service.serviceName}
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 border-l-4 border-purple-600 pl-3">
              What We Offer
            </h2>

            <p className="text-gray-700 leading-relaxed text-lg">
              {service.description}
            </p>

            {/* Price / Duration / CTA */}
            <div className="mt-12 bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md border border-purple-100">
              <div className="text-center md:text-left">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Price
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{service.price}
                </p>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-200"></div>
              <div className="text-center md:text-left whitespace-nowrap">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Duration
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {service.duration}
                </p>
              </div>
              <Link to="/bookings" className="w-full md:w-auto">
                <button className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <section className="text-center">
          <h2 className="text-4xl font-extrabold text-purple-900 mb-14">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              {
                icon: <ShieldCheck size={40} />,
                title: "Trusted Care",
                desc: "Over 15+ years of veterinary excellence.",
              },
              {
                icon: <Heart size={40} />,
                title: "Compassion",
                desc: "We treat your pets like our own family.",
              },
              {
                icon: <Clock size={40} />,
                title: "24/7 Support",
                desc: "Emergency care available anytime.",
              },
              {
                icon: <Stethoscope size={40} />,
                title: "Expert Team",
                desc: "Certified doctors & trainers.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition"
              >
                <div className="text-purple-700 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-purple-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet Our Experts */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-purple-900 mb-14">
            Meet Our Experts
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Dr. Malithi Fernando",
                role: "Veterinary Doctor",
                desc: "10+ years of experience treating small animals.",
                image:
                  "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20051858.png",
              },
              {
                name: "Kavindu Jayasuriya",
                role: "Pet Trainer",
                desc: "Specialist in obedience and behavior training.",
                image:
                  "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20052718.png",
              },
              {
                name: "Dr. Nadeesha Silva",
                role: "Pet Nutritionist",
                desc: "Expert in customized diet plans for pets.",
                image:
                  "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20052020.png",
              },
              {
                name: "Dr. Dilan Perera",
                role: "Surgeon",
                desc: "Specialized in advanced veterinary surgeries.",
                image:
                  "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20052118.png",
              },
              {
                name: "Ishara Rathnayake",
                role: "Pet Groomer",
                desc: "Professional grooming & styling for all breeds.",
                image:
                  "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Screenshot%202025-09-26%20052921.png",
              },
              {
                name: "Dr. Amaya Senanayake",
                role: "Animal Behaviorist",
                desc: "Helps pets overcome anxiety & behavioral issues.",
                image:
                  "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20052150.png",
              },
            ].map((person, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-white to-purple-50 border border-gray-200 rounded-2xl shadow-md p-8 text-center backdrop-blur-md hover:shadow-xl transition transform hover:-translate-y-2 hover:scale-[1.02] hover:border-purple-500"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-md border-4 border-purple-200">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                  />
                </div>

                <h3 className="text-xl font-bold text-purple-900">
                  {person.name}
                </h3>
                <p className="text-sm text-purple-600 font-medium mb-3">
                  {person.role}
                </p>
                <p className="text-gray-600">{person.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-Action Strip */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-800 py-14 rounded-3xl text-center text-white shadow-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Book your appointment today and let us take care of your furry
            friend with love & expertise.
          </p>
          <Link to="/bookings">
            <button className="px-10 py-4 bg-white text-purple-800 font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition">
              Book an Appointment
            </button>
          </Link>
        </section>

        {/* Related Services Carousel */}
        {related.length > 0 && (
          <section>
            <h2 className="text-4xl font-extrabold text-center text-purple-900 mb-14">
              Related Services
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-purple-300">
              {related.map((rel) => (
                <div
                  key={rel._id}
                  className="min-w-[280px] bg-white rounded-2xl shadow-md hover:shadow-lg transition flex-shrink-0 border border-purple-100"
                >
                  <img
                    src={
                      rel.images && rel.images.length > 0
                        ? rel.images[0]
                        : "https://via.placeholder.com/400x250"
                    }
                    alt={rel.serviceName}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-6 flex flex-col justify-between h-[200px]">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">
                        {rel.serviceName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {rel.miniDescription}
                      </p>
                      <p className="mt-3 text-purple-700 font-semibold">
                        Rs.{rel.price}
                      </p>
                    </div>
                    <Link to={`/service/${rel._id}`} className="mt-4">
                      <button className="w-full px-6 py-2 bg-purple-700 text-white font-medium rounded-lg shadow hover:bg-purple-800 transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
