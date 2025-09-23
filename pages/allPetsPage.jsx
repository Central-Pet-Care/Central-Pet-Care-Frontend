import { useEffect, useState } from "react";
import PetCard from "../components/petCard";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/navBar";
import PetHero from "../components/petHero";
import AdoptionHighlights from "../components/petHighlights";
import PetsCategories from "../components/petsCategory";

export default function AllPetsPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-purple-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-300 border-t-purple-700"></div>
        </div>
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-200 to-white">
        <Header />
        <div className="flex-grow flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-2xl font-semibold text-gray-600">
            No pets available right now 🐾
          </h2>
          <p className="text-gray-500 mt-2">
            Please check back later or explore other categories.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-3 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-700 hover:text-white transition"
          >
            ← Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 via-blue-100 to-white">
      <Header />
      <PetHero />
      <AdoptionHighlights />
      <PetsCategories />

      <div className="max-w-7xl mx-auto py-16 px-6 ">
        {/* Heading */}
        <div className="text-center mb-14 ">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 drop-shadow-sm">
            🐾 Meet Our Lovely Pets
          </h1>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Explore all the adorable pets waiting for a loving home.
            Find your perfect companion today!
          </p>
        </div>

        {/* ✅ Grouped Sections by Category */}
        {["dog", "cat", "bird", "fish"].map((type) => (
          <section key={type} id={type + "s"} className="mb-16">
            <h2 className="text-3xl font-bold text-purple-800 mb-8 capitalize">
              🐾 {type}s
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {pets
                .filter((pet) => pet.species?.toLowerCase().includes(type))
                .map((pet) => (
                  <div
                    key={pet.petId}
                    className="flex flex-col h-full transform transition duration-300 hover:scale-105"
                  >
                    <PetCard pet={pet} />
                  </div>
                ))}
            </div>
          </section>
        ))}

        {/* Divider with paw icon */}
        <div className="flex items-center justify-center mt-16">
          <div className="w-24 h-1 bg-purple-300 rounded-full"></div>
          <span className="mx-4 text-2xl">🐾</span>
          <div className="w-24 h-1 bg-purple-300 rounded-full"></div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/"
            className="px-8 py-3 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-700 hover:text-white shadow-md transition duration-300"
          >
            ← Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
