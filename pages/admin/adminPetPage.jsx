import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaPencilAlt, FaPlus, FaNotesMedical } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AdminPetsPage() {
  const [pets, setPets] = useState([]);
  const [petsLoaded, setPetsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!petsLoaded) {
      const token = localStorage.getItem("token");

      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/pets", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          console.log("✅ Pets Data:", res.data);
          setPets(res.data);
          setPetsLoaded(true);
        })
        .catch((err) => {
          console.error("❌ Error fetching pets:", err.response || err.message);
          toast.error("Failed to fetch pets");
        });
    }
  }, [petsLoaded]);

  const speciesOptions = ["All", "Dog", "Cat", "Bird", "Fish"];

  // Filter pets by search + species
  const filteredPets = pets.filter(
    (pet) =>
      pet.name?.toLowerCase().includes(search.toLowerCase()) &&
      (filterSpecies && filterSpecies !== "All"
        ? pet.species === filterSpecies
        : true)
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {/* Floating Add Button */}
      <Link
        to={"/admin/pets/addPet"}
        className="fixed right-8 bottom-8 
             flex items-center justify-center 
             w-16 h-16 
             rounded-full 
             text-white text-2xl 
             shadow-lg shadow-indigo-400/50
             bg-gradient-to-r from-[#6b73ff] to-[#5a62e6]
             hover:from-[#5a62e6] hover:to-[#4a50d6]
             transition-all duration-300 transform hover:scale-110"
      >
        <FaPlus />
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🐾 Admin Pets Management
      </h1>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search pets by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-1/3 shadow-sm focus:ring focus:ring-indigo-300 focus:outline-none"
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {speciesOptions.map((species) => (
            <button
              key={species}
              onClick={() =>
                setFilterSpecies(species === "All" ? "" : species)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
                ${
                  filterSpecies === species || (species === "All" && filterSpecies === "")
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {species}
            </button>
          ))}
        </div>
      </div>

      {petsLoaded ? (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Species</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length > 0 ? (
                filteredPets.map((pet, index) => (
                  <tr
                    key={pet._id || index}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{pet.petId}</td>

                    <td className="px-6 py-4">
                      <img
                        src={pet.images?.[0] || "/placeholder-pet.png"}
                        alt={pet.name}
                        className="w-14 h-14 object-cover rounded-full border"
                      />
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pet.name}</td>

                    <td className="px-6 py-4 text-sm text-gray-700">{pet.species}</td>

                    <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                      RS.{Number(pet.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          pet.adoptionStatus === "ADOPTED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {pet.adoptionStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex justify-center gap-4">
                      {/* Medical Records Button */}
                      <button
                        className="text-purple-600 hover:text-purple-800 transition"
                        title="Medical Records"
                        onClick={() => navigate("/admin/pets/medicalRecords", { state: { pet } })}
                      >
                        <FaNotesMedical />
                      </button>

                      {/* Edit Button */}
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit"
                        onClick={() => {
                          navigate("/admin/pets/editPet", { state: { pet } });
                        }}
                      >
                        <FaPencilAlt />
                      </button>

                      {/* Delete Button */}
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to delete this pet?")) return;

                                    try {
                       const token = localStorage.getItem("token");
                       await axios.delete(
                     `${import.meta.env.VITE_BACKEND_URL}/api/pets/${pet.petId}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                            toast.success("Pet deleted successfully");
                            // Remove pet from state immediately
                            setPets((prevPets) => prevPets.filter((p) => p.petId !== pet.petId));
                          } catch (err) {
                            console.error("❌ Delete failed:", err.response || err.message);
                            toast.error("Failed to delete pet");
                          }
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No pets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[60px] h-[60px] border-[4px] border-gray-200 border-b-[#3b82f6] animate-spin rounded-full"></div>
        </div>
      )}
    </div>
  );
}
