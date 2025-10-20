import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/navBar";
import axios from "axios";
import toast from "react-hot-toast";
import Footer from "../components/footer";
import {
  FaPaw,
  FaVenusMars,
  FaCalendarAlt,
  FaPalette,
  FaScroll,
  FaHome,
  FaPhoneAlt,
} from "react-icons/fa";

export default function MyAdoptionsPage() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    async function fetchAdoptions() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must log in first!");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/adoptions/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const adoptionRequests = res.data;

        const requestsWithPets = await Promise.all(
          adoptionRequests.map(async (adoption) => {
            try {
              const petRes = await axios.get(
                `http://localhost:5000/api/pets/${adoption.petId}`
              );
              return { ...adoption, petDetails: petRes.data };
            } catch (err) {
              console.error("Failed to fetch pet for adoption:", adoption.petId);
              return adoption;
            }
          })
        );

        setAdoptions(requestsWithPets);
      } catch (err) {
        console.error("Error fetching adoptions:", err);
        toast.error("Failed to load your adoptions.");
      } finally {
        setLoading(false);
      }
    }

    fetchAdoptions();
  }, []);

  const activeRequests = adoptions.filter((a) => {
    const status = a.adoptionStatus?.toUpperCase();
    return status === "PENDING" || status === "APPROVED";
  });

  const historyRequests = adoptions.filter((a) => {
    const status = a.adoptionStatus?.toUpperCase();
    return status === "REJECTED" || status === "COMPLETED";
  });

  const filterAdoptions = (list) => {
    return list.filter((a) => {
      const matchesSearch = a.petDetails?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus
        ? a.adoptionStatus?.toUpperCase() === filterStatus
        : true;
      return matchesSearch && matchesStatus;
    });
  };

  const renderAdoptionRows = (list) => (
    <div className="max-w-5xl mx-auto flex flex-col gap-4 px-6">
      {list.map((adoption) => {
        const pet = adoption.petDetails;
        const imgUrl = pet?.images?.[0] || "https://via.placeholder.com/150";
        const token = localStorage.getItem("token");

        return (
          <div
            key={adoption._id}
            className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition border border-gray-200"
          >
            <img
              src={imgUrl}
              alt={pet?.name || "Pet"}
              className="w-24 h-24 object-cover rounded-xl border"
            />

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {pet?.name || "Unknown Pet"}
              </h3>
              <p className="text-sm text-gray-600">{pet?.breed}</p>
              <p className="text-sm text-gray-500">
                {pet?.species} • {pet?.ageYears} yrs • {pet?.sex}
              </p>

              <span
                className={`inline-block mt-2 text-xs font-semibold px-3 py-0.5 rounded-full ${
                  adoption.adoptionStatus?.toUpperCase() === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : adoption.adoptionStatus?.toUpperCase() === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : adoption.adoptionStatus?.toUpperCase() === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : adoption.adoptionStatus?.toUpperCase() === "COMPLETED"
                    ? "bg-violet-100 text-violet-900"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {adoption.adoptionStatus}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <Link
                to={`/adoptions/${adoption._id}`}
                className="px-3 py-1 border border-purple-600 text-purple-600 text-sm rounded-full hover:bg-purple-600 hover:text-white transition"
              >
                View
              </Link>

              {adoption.adoptionStatus?.toUpperCase() === "PENDING" && (
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/adoptions/${adoption._id}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      setAdoptions((prev) =>
                        prev.filter((a) => a._id !== adoption._id)
                      );
                      toast.success("Adoption request canceled");
                    } catch (err) {
                      toast.error("Failed to cancel request");
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-white flex flex-col relative">
      <Header />

      <section className="relative bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 shadow-md overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 py-20 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-violet-900 leading-tight mb-4 ml-20">
              Track Your  Pet Adoption Requests
            </h1>
            <p className="text-violet-700 mb-6 text-base md:text-lg ml-20">
              From application to approval and beyond — follow every step of
              your adoption journey with ease.
            </p>
            <Link
              to="/pets"
              className="px-8 py-3 bg-purple-700 text-white font-semibold rounded-full shadow hover:bg-purple-800 transition ml-20"
            >
              Adopt Pets
            </Link>
          </div>

          <div className="flex justify-center md:justify-end relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] bg-violet-400/20 rounded-full blur-3xl"></div>
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/AdoptionPage/adop.png"
              alt="Happy pets with food"
              className="relative w-130 max-w-4xl md:max-w-5xl drop-shadow-2xl mr-10 mb-2 "
            />
          </div>
        </div>
        <div className="absolute top-8 left-8 text-violet-300 text-6xl opacity-60">🐾</div>
      <div className="absolute bottom-12 right-12 text-violet-400 text-5xl opacity-70">🐾</div>

      </section>

      {/* Active & History */}
      <div className="flex-grow py-14">
        {loading ? (
          <p className="text-center text-gray-600">Loading your requests...</p>
        ) : activeRequests.length === 0 && historyRequests.length === 0 ? (
          <div className="text-center text-gray-600 flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="No requests"
              className="w-40 h-40 mb-4 opacity-80"
            />
            <p>You haven’t applied for any adoptions yet.</p>
          </div>
        ) : (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-6xl mx-auto px-3">
              <input
                type="text"
                placeholder="🔍 Search by pet name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 px-2 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Active */}
            {filterAdoptions(activeRequests).length > 0 && (
              <div>
                <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-8">
                  Active Requests 🐾
                </h2>
                {renderAdoptionRows(filterAdoptions(activeRequests))}
              </div>
            )}

            {/* History */}
            {filterAdoptions(historyRequests).length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-8">
                  Adoption History 🐾
                </h2>
                {renderAdoptionRows(filterAdoptions(historyRequests))}
              </div>
            )}
          </>
        )}
        <section className="py-16 bg-pink-50">
          <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-10">
            Adoption Tips & Checklist 📝
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            {[
              { title: "Prepare Your Home", desc: "Create a safe space for your pet before arrival." },
              { title: "Pet Essentials", desc: "Food, bowls, toys, and a comfy bed are a must." },
              { title: "Vet Check-Up", desc: "Book a vet appointment within the first week." },
              { title: "Bonding Time", desc: "Spend time playing and cuddling to build trust." },
            ].map((tip) => (
              <div
                key={tip.title}
                className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-purple-800 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/*Success Stories Section */}
        <section className="py-16 bg-pink-50">
          <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-10">
            Success Stories 🐕🐈
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {[
              {
                name: "Shadow",
                img: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/AdoptionPage/po.jpg",
                story: "Shadow found her forever home with a loving family!",
              },
              {
                name: "Lily",
                img: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/AdoptionPage/cat.jpeg",
                story: "Lily was adopted and now enjoys cozy naps all day.",
              },
              {
                name: "Rocky",
                img: "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/AdoptionPage/has.jpg",
                story: "Rocky is now exploring the mountains with his new owner.",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img src={s.img} alt={s.name} className="h-56 w-full object-cover" />
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg text-purple-800">{s.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{s.story}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/*Extra Resources Section */}
<section className="py-16 bg-pink-50">
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 text-center">
    {[
      {
        icon: "🐾",
        title: "Checklist for New Adopters",
        desc: "Make the adoption transition as smooth as possible.",
      },
      {
        icon: "🐶",
        title: "How Old is a Dog in Human Years?",
        desc: "Translate dog years to human years just for fun, and vice versa.",
      },
      {
        icon: "❓",
        title: "Pet Adoption FAQs",
        desc: "Get answers to questions you may not have thought of for your adoption.",
      },
    ].map((item) => (
      <div
        key={item.title}
        className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-md p-8 hover:shadow-lg transition"
      >
        <div className="text-6xl text-purple-700 mb-6">{item.icon}</div>
        <h3 className="text-lg font-bold text-purple-800 mb-3 uppercase">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6">{item.desc}</p>
        <button className="px-6 py-2 border-2 border-purple-600 text-purple-700 font-semibold rounded-full hover:bg-purple-600 hover:text-white transition">
          Learn More
        </button>
      </div>
    ))}
  </div>
</section>


       
        <section className="relative bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 shadow-md overflow-hidden mt-">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 py-20 relative z-10">
            
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-violet-900 leading-tight mb-4">
                Visit Our Shelter 🏠
              </h2>
              <p className="text-violet-700 mb-6 text-base md:text-lg">
                You can also visit our shelter to meet pets in person and find
                your perfect companion. Our friendly staff will guide you
                through the adoption process!
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105">
                Get Directions
              </button>
            </div>

            <div className="flex justify-center md:justify-end relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] bg-purple-400/20 rounded-full blur-3xl"></div>
              <div className="relative w-full max-w-4xl md:max-w-5xl drop-shadow-2xl rounded-2xl overflow-hidden border-4 border-purple-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.3608518546575!2d79.88249037480887!3d6.847273493151008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25afaa307f761%3A0xe0b66ab6402425e8!2sCentral%20Pet%20Care!5e0!3m2!1sen!2slk!4v1758775385315!5m2!1sen!2slk"
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="absolute top-8 left-8 text-violet-300 text-6xl opacity-60">
            🐾
          </div>
        </section>




      </div>
      <Footer />
    </div>

    
  );
}
