import { Link } from "react-router-dom";

export default function PetCard({ pet }) {
  const isAvailable = pet.adoptionStatus === "AVAILABLE";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 w-48 sm:w-56 mx-auto">
      {/* Image Section */}
      <div className="w-full h-36 sm:h-44 overflow-hidden rounded-t-2xl">
        <img
          src={Array.isArray(pet.images) ? pet.images[0] : pet.images}
          alt={pet.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content Section */}
      <div className="bg-[#f3e8ff] p-3 text-center">
        <h1 className="text-base font-bold text-gray-800 truncate">{pet.name}</h1>
        <p className="text-gray-500 text-sm">{pet.breed}</p>

        <p className="text-green-600 font-bold text-base mt-1">
          ${pet.price}
        </p>

        {/* Adoption Status Badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
            isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {pet.adoptionStatus}
        </span>

        {/* Button */}
        <Link to={isAvailable ? `/petInfo/${pet.petId}` : "#"}>
          <button
            disabled={!isAvailable}
            className={`mt-2 w-full font-semibold py-1.5 rounded-xl shadow-md transition-all text-sm ${
              isAvailable
                ? "bg-purple-700 hover:bg-purple-800 text-white hover:scale-105"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
