import { Link } from "react-router-dom";

export default function PetCard({ pet }) {
  const isAvailable = pet.adoptionStatus === "AVAILABLE";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:scale-[1.02] duration-300 w-72">
      {/* 🖼️ Pet Image */}
      <div className="h-60 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={Array.isArray(pet.images) ? pet.images[0] : pet.images}
          alt={pet.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 📦 Pet Details */}
      <div className="p-4 text-center">
        <h4 className="font-semibold text-violet-700 truncate">{pet.name}</h4>
        <p className="text-sm text-violet-600 mb-1">{pet.breed}</p>

        <span className="font-bold text-pink-500 text-lg block">
          Rs. {pet.price.toLocaleString()}
        </span>

        <span
          className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {pet.adoptionStatus}
        </span>

        <div className="mt-4 flex items-center justify-between gap-2">
          {isAvailable ? (
            <Link
              to={`/petInfo/${pet.petId}`}
              className="flex-1 py-2 text-violet-700 border border-violet-200 hover:border-violet-400 hover:bg-violet-50 rounded-lg font-medium transition"
            >
              View Details
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
