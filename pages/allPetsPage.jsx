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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  // 🔎 Filter pets based on search and category (client-side only)
  const filteredPets = pets.filter((pet) => {
    const matchesCategory =
      selectedCategory === "all" ||
      pet.species?.toLowerCase() === selectedCategory;
    const matchesSearch =
      pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.color?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-100 to-white">
      <Header />
      <PetHero />
      <AdoptionHighlights />
      <PetsCategories />

      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 drop-shadow-sm">
            🐾 Meet Our Lovely Pets
          </h1>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Explore all the adorable pets waiting for a loving home.
            Find your perfect companion today!
          </p>
        </div>

        {/* Divider with Paw Icon */}
        <div className="flex items-center justify-center my-6">
          <div className="w-24 h-1 bg-purple-300 rounded-full"></div>
          <span className="mx-4 text-2xl">🐾</span>
          <div className="w-24 h-1 bg-purple-300 rounded-full"></div>
        </div>

        {/* 🔎 Search and Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, breed, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full shadow-md border border-gray-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                         placeholder-gray-400 text-gray-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {["all", "dog", "cat", "bird", "fish"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-purple-700 border border-purple-300 hover:bg-purple-100"
                }`}
              >
                {cat === "all"
                  ? "All Pets"
                  : cat.charAt(0).toUpperCase() + cat.slice(1) + "s"}
              </button>
            ))}
          </div>
        </div>

        {/* 🐾 Pets Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPets.map((pet) => (
            <div
              key={pet.petId}
              className="flex flex-col h-full transform transition duration-300 hover:scale-105"
            >
              <PetCard pet={pet} />
            </div>
          ))}
        </div>

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
