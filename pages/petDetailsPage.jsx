import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ImageSlider from "../components/imageSlider";
import toast from "react-hot-toast";

export default function PetDetailsPage() {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await axios.get(`http://localhost:5000/api/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        console.error("Error fetching pet:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [petId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-700"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <p className="text-lg font-semibold">Pet not found.</p>
        <Link
          to="/"
          className="text-purple-700 font-bold underline hover:text-purple-900"
        >
          Go back
        </Link>
      </div>
    );
  }

  const isAvailable = pet.adoptionStatus === "AVAILABLE";

  return (
    <div className="bg-gradient-to-b from-purple-200 via-blue-100 to-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back Button */}
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-purple-700 font-semibold bg-purple-100 rounded-full shadow-sm hover:bg-purple-200 hover:text-purple-900 transition-all duration-200"
        >
          ← Back to All Pets
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-200">
          {/* ✅ Image Section with Overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 flex justify-center items-center">
            <ImageSlider
              images={Array.isArray(pet.images) ? pet.images : [pet.images]}
            />

            {/* 🆕 Bottom Overlay Card */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md flex items-center gap-3 p-4">
              {/* Thumbnail */}
              <img
                src={Array.isArray(pet.images) ? pet.images[0] : pet.images}
                alt="thumbnail"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              {/* Pet Info */}
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {pet.name}
                </h3>
                <p className="text-gray-200 text-sm">{pet.breed}</p>
              </div>
            </div>
          </div>

          {/* ✅ Details Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
            <p className="text-lg text-gray-500 mb-3">{pet.breed}</p>

            <p className="text-green-600 font-bold text-2xl mb-3">
              RS.{pet.price}
            </p>

            {/* Adoption Status */}
            <span
              className={`inline-block mb-5 px-4 py-1 text-sm font-bold rounded-full shadow-sm ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {pet.adoptionStatus}
            </span>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-5">
              {pet.description}
            </p>

            {/* Pet Info */}
            <div className="bg-blue-100 rounded-xl p-4 mb-5">
              <ul className="text-gray-700 space-y-1 text-sm">
                <li><strong>Species:</strong> {pet.species}</li>
                <li><strong>Sex:</strong> {pet.sex}</li>
                <li><strong>Age:</strong> {pet.ageYears} years</li>
                <li><strong>Size:</strong> {pet.size}</li>
                <li><strong>Color:</strong> {pet.color}</li>
              </ul>
            </div>

            {/* Health Records */}
            <div className="bg-purple-50 rounded-xl p-4 shadow-inner">
              <h2 className="text-lg font-semibold text-purple-800 mb-3">
                Health Records
              </h2>
              {pet.healthRecords?.length > 0 ? (
                <ul className="space-y-2">
                  {pet.healthRecords.map((record, index) => (
                    <li
                      key={index}
                      className="text-sm border-b border-gray-200 pb-2 last:border-none"
                    >
                      <span className="font-bold text-gray-800">
                        {record.type}
                      </span>{" "}
                      — {record.notes}{" "}
                      <span className="text-gray-500 text-xs">
                        ({record.visitDate})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No health records available.
                </p>
              )}
            </div>

            
            {/* Adopt Button */}
{isAvailable && (
  <div className="flex justify-center">
    <button
      onClick={() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // store user object at login

        if (!token) {
          // Not logged in → send to login page with redirect back to adoption form
          window.location.href = `/login?redirect=/adopt/${pet.petId}`;
        } else if (user?.type !== "customer") {
          // Logged in but not a customer
          toast.error("Only customers can adopt a pet!");
        } else {
          // Logged in as customer → go to adoption page
          window.location.href = `/adopt/${pet.petId}`;
        }
      }}
      className="mt-6 w-[250px] text-center bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
    >
      🐾 Adopt Now
    </button>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}
