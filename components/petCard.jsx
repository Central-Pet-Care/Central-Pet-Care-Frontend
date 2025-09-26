import { Link } from "react-router-dom";

export default function PetCard({ pet }) {
  const isAvailable = pet.adoptionStatus === "AVAILABLE";

  return (
    <div className="group relative bg-white rounded-3xl shadow-md border border-purple-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 w-72">
      
      {/* 🖼️ Pet Image Section */}
      <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
        {/* Pet Image */}
        <img
          src={Array.isArray(pet.images) ? pet.images[0] : pet.images}
          alt={pet.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* 🌈 Soft Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

        {/* 🟢 Status Badge (Only One Now) */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${
            isAvailable
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-600 border-red-200"
          }`}
        >
          {isAvailable ? "Available" : "Adopted"}
        </span>
      </div>

      {/* 📦 Pet Details */}
      <div className="p-5 text-center">
        {/* 🐾 Pet Name */}
        <h4 className="text-lg font-bold text-purple-700 truncate">{pet.name}</h4>

        {/* 🐶 Breed */}
        <p className="text-sm text-gray-500 mb-2">{pet.breed}</p>

        {/* 💰 Price (Mainly Here Now) */}
        <span className="block text-lg font-bold text-pink-500 mb-3">
          Rs. {pet.price.toLocaleString()}
        </span>

        {/* 🔘 View Details Button */}
        <div className="mt-2">
          {isAvailable ? (
            <Link
              to={`/petInfo/${pet.petId}`}
              className="block w-full py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-semibold rounded-xl shadow-sm hover:shadow-md hover:brightness-105 transition duration-300"
            >
              View Details
            </Link>
          ) : (
            <button
              disabled
              className="block w-full py-2 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
