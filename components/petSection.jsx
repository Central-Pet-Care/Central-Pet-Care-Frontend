// src/components/PetSection.jsx
import { Link } from "react-router-dom";
import PetCard from "./petCard";

export default function PetSection({ title, subtitle, pets, loading, showAllLink }) {
  // ✅ Show only first 4 pets
  const displayedPets = pets.slice(0, 4);

  return (
    <section className="px-6 py-16 bg-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
            {title}
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">{subtitle}</p>
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
          /* Loading Spinner */
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600"></div>
          </div>
        ) : displayedPets.length === 0 ? (
          /* No Pets Message */
          <p className="text-center text-gray-500">No pets available right now.</p>
        ) : (
          <>
            {/* Pets Grid - Only 4 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {displayedPets.map((pet) => (
                <PetCard key={pet.petId} pet={pet} />
              ))}
            </div>

            {/* View All Pets Button */}
            {showAllLink && (
              <div className="flex justify-center mt-12">
                <Link
                  to="/pets"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-semibold shadow-md hover:from-purple-700 hover:to-purple-800 transition"
                >
                  View All Pets
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
