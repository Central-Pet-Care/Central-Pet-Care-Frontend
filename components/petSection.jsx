// src/components/PetSection.jsx
import { Link } from "react-router-dom";
import PetCard from "./petCard";

export default function PetSection({ title, subtitle, pets, loading, showAllLink }) {
  return (
    <section className="px-6 py-16 bg-gradient-to-b from-purple-100 via-purple-100 to-white">
      {/* Title & Subtitle */}
      <h2 className="text-3xl font-extrabold text-center mb-4 text-purple-700">
        {title}
      </h2>
      <p className="text-center text-gray-600 mb-12">{subtitle}</p>

      {loading ? (
        /* Loading Spinner */
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600"></div>
        </div>
      ) : pets.length === 0 ? (
        /* No Pets Message */
        <p className="text-center text-gray-500">No pets available right now.</p>
      ) : (
        <>
          {/* ✅ Increased spacing between cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-50 gap-y-12 justify-items-center max-w-7xl mx-auto">
            {pets.map((pet) => (
              <PetCard key={pet.petId} pet={pet} />
            ))}
          </div>

          {/* View All Pets Button */}
          {showAllLink && (
            <div className="flex justify-center mt-12">
              <Link
                to="/pets"
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold shadow-md hover:bg-purple-700 transition"
              >
                View All Pets
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
