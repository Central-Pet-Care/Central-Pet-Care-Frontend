import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/navBar";
import Footer from "../components/footer";
import { PawPrint, Heart, Users, Stethoscope, Star, Clock, Shield } from "lucide-react";

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/service")
      .then((res) => {
        setServices(res.data);
        setFilteredServices(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load services");
      });
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredServices(services);
      return;
    }
    const q = query.toLowerCase();
    setFilteredServices(
      services.filter((s) => s.serviceName.toLowerCase().includes(q))
    );
  };

  if (error) {
    return (
      <h1 className="text-center text-2xl text-purple-800 mt-20">{error}</h1>
    );
  }

  if (!services.length) {
    return <p className="text-center mt-20 text-black">Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-50 to-purple-100 py-16 md:py-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 px-6 items-center">
          {/* Left Image */}
          <div className="flex justify-center relative">
            <div className="absolute -inset-6 bg-purple-200/40 rounded-3xl blur-3xl"></div>
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20021456.png"
              alt="Happy Pet"
              className="relative rounded-3xl shadow-xl w-72 md:w-[28rem] object-cover border-2 border-purple-200"
            />
          </div>

          {/* Right Text */}
          <div className="text-center md:text-left space-y-6 relative">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-snug text-purple-900">
              Happy Paws <br /> Wellness & Care 🐾
            </h1>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-md mx-auto md:mx-0">
              Grooming, training, adoption, and veterinary support — compassionate care for your furry friends, every step of the way.
            </p>
            <div className="flex justify-center md:justify-start">
              <span className="h-1 w-24 bg-purple-900 rounded-full shadow"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center px-6">
          <div className="flex flex-col items-center">
            <Shield className="h-10 w-10 text-purple-900 mb-3" />
            <h4 className="font-bold text-purple-900">Trusted Care</h4>
            <p className="text-sm text-gray-600">Your pets are safe in loving hands.</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-10 w-10 text-purple-900 mb-3" />
            <h4 className="font-bold text-purple-900">Expert Team</h4>
            <p className="text-sm text-gray-600">Skilled vets & trainers available 24/7.</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="h-10 w-10 text-purple-900 mb-3" />
            <h4 className="font-bold text-purple-900">Quick Support</h4>
            <p className="text-sm text-gray-600">Instant booking & emergency response.</p>
          </div>
          <div className="flex flex-col items-center">
            <Star className="h-10 w-10 text-purple-900 mb-3" />
            <h4 className="font-bold text-purple-900">5★ Rated</h4>
            <p className="text-sm text-gray-600">Loved by hundreds of happy pet parents.</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <main id="services" className="flex-grow max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-extrabold text-center text-purple-900 mb-14 relative">
          Our Services
          <span className="block h-1 w-24 bg-purple-900 mx-auto mt-4 rounded-full"></span>
        </h2>

        {/* Search Bar */}
        <div className="flex justify-end mb-12">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-12 pr-5 py-3 border border-purple-200 rounded-full shadow-sm focus:ring-2 focus:ring-purple-900 focus:outline-none transition duration-300"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
              />
            </svg>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden border border-purple-100 group"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={service.images?.[0] || "https://via.placeholder.com/300"}
                  alt={service.serviceName}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  {service.serviceName}
                </h3>
                <p className="text-black text-sm mb-5 line-clamp-3">
                  {service.miniDescription}
                </p>
                <Link
                  to={`/services/${service._id}`}
                  className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white text-sm font-semibold rounded-full shadow-md transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-16">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-10 text-center px-6">
          <div>
            <h3 className="text-4xl font-extrabold text-purple-900">5,000+</h3>
            <p className="text-gray-700">Happy Pets Groomed</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-purple-900">1,200+</h3>
            <p className="text-gray-700">Successful Adoptions</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-purple-900">10+</h3>
            <p className="text-gray-700">Years of Service</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-purple-900 mb-14">
            What Pet Parents Say
            <span className="block h-1 w-24 bg-purple-900 mx-auto mt-4 rounded-full"></span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Amali Perera",
                text: "The grooming team was so gentle with my cat! She looks adorable now.",
                img: "https://randomuser.me/api/portraits/women/79.jpg"
              },
              {
                name: "Kasun Silva",
                text: "Adopted a puppy here, the process was smooth and the staff were very caring.",
                img: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Tharushi Fernando",
                text: "Quick vet appointment booking, and the doctor was super kind.",
                img: "https://randomuser.me/api/portraits/women/45.jpg"
              }
            ].map((review, i) => (
              <div
                key={i}
                className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-purple-200"
                />
                <p className="text-gray-700 text-sm italic mb-4">“{review.text}”</p>
                <h4 className="font-bold text-purple-900">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Join Community Section (replaces Book Now CTA) */}
      <section className="relative bg-purple-900 py-16 text-center text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Join the Happy Paws Community 🐶🐱
          </h2>
          <p className="text-purple-200 mb-8">
            Stay updated with pet care tips, adoption news, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-full w-full sm:w-2/3 
             text-black placeholder-gray-400
             border border-purple-300
             focus:ring-2 focus:ring-white focus:border-white
             outline-none transition"
            />
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-full shadow-md hover:bg-purple-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-purple-900 text-center mb-14">
            Frequently Asked Questions
            <span className="block h-1 w-24 bg-purple-900 mx-auto mt-4 rounded-full"></span>
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Do you provide emergency vet care?",
                a: "Yes, our veterinary team is available 24/7 for emergencies."
              },
              {
                q: "Can I book grooming online?",
                a: "Absolutely! You can schedule grooming sessions through our booking page."
              },
              {
                q: "Do you help with pet adoption?",
                a: "Yes, we connect loving families with pets looking for homes."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="p-5 border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-bold text-purple-900 mb-2">{faq.q}</h4>
                <p className="text-gray-700 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
