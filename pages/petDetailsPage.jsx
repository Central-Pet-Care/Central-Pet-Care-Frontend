import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ImageSlider from "../components/imageSlider";
import toast from "react-hot-toast";
import  generatePetPDF  from "../utils/generatePetPdf";

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-300 border-t-purple-700"></div>
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
    <div className="bg-gradient-to-b from-purple-100 via-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 🔙 Back Button */}
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-200 shadow hover:bg-purple-100 hover:shadow-md hover:scale-105 transition"
        >
          ← Back to All Pets
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-100">
          {/* 🖼️ Image Section */}
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-gray-50 flex justify-center items-center">
            <ImageSlider
              images={Array.isArray(pet.images) ? pet.images : [pet.images]}
            />

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md flex items-center gap-4 p-4">
              <img
                src={Array.isArray(pet.images) ? pet.images[0] : pet.images}
                alt="thumbnail"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <h3 className="text-white font-bold text-lg">{pet.name}</h3>
                <p className="text-gray-200 text-sm">{pet.breed}</p>
              </div>
            </div>
          </div>

          {/* Pet Details */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              {pet.name}
            </h1>
            <p className="text-lg text-gray-500 mb-4">{pet.breed}</p>

            {/* Price */}
            <p className="text-2xl font-bold text-pink-600 mb-3">
              Rs. {pet.price.toLocaleString()}
            </p>

            {/* Status */}
            <span
              className={`inline-block mb-5 px-5 py-1.5 text-sm font-bold rounded-full shadow-sm ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {pet.adoptionStatus}
            </span>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {pet.description}
            </p>

            {/* Pet Info */}
            <div className="bg-blue-50 rounded-2xl p-5 shadow-inner mb-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">
                Pet Information
              </h2>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li><strong>Species:</strong> {pet.species}</li>
                <li><strong>Sex:</strong> {pet.sex}</li>
                <li><strong>Age:</strong> {pet.ageYears} years</li>
                <li><strong>Size:</strong> {pet.size}</li>
                <li><strong>Color:</strong> {pet.color}</li>
              </ul>
            </div>

            {/* Health Records */}
            <div className="bg-purple-50 rounded-2xl p-5 shadow-inner">
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

            {/* PDF Download Button */}
<div className="mt-6 flex justify-center">
  <button
    onClick={() => generatePetPDF(pet)}
    className="px-5 py-3 bg-gradient-to-r from-blue-400 to-blue-500 
               text-white font-semibold rounded-xl shadow-md 
               hover:scale-105 hover:shadow-lg transition-all"
  >
    📄 Download Pet Details
  </button>
</div>

            {/* 🐾 Adopt Button */}
            {isAvailable && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (!token) {
                      window.location.href = `/login?redirect=/adopt/${pet.petId}`;
                    } else if (user?.type !== "customer") {
                      toast.error("Only customers can adopt a pet!");
                    } else {
                      window.location.href = `/adopt/${pet.petId}`;
                    }
                  }}
                  className="mt-6 w-[260px] bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
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
