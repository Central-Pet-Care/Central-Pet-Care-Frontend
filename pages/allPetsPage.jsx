import { useEffect, useState } from "react";
import PetCard from "../components/petCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AllPetsPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await axios.get("http://localhost:5000/api/pets");
        setPets(res.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

   if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-500 border-b-amber-500 border-b-4"></div>
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-purple-50">
        <p className="text-gray-500 text-lg">No pets available right now.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-3 border border-gray-600 hover:bg-gray-100 text-gray-700 rounded-full transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-purple-700">
          🐾 All Available Pets
        </h1>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <div
              key={pet.petId}
              className="transform transition duration-300 hover:scale-105"
            >
              <PetCard pet={pet} />
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-full hover:bg-purple-600 hover:text-white transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
