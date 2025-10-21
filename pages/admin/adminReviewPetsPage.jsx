import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";

export default function AdminReviewPetsPage({ onPetApproved }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [viewing, setViewing] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const speciesOptions = ["Dog", "Cat", "Bird", "Fish", "Other"];

  const token = localStorage.getItem("token");

  // Fetch pending submissions only
  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/pets/pending/public",
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSubmissions(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch pending pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === "pending") fetchPendingSubmissions();
    else setSubmissions([]); // show empty for approved/rejected until backend is ready
  }, [statusFilter]);

  const handleAction = async (id, action) => {
    if (!token) {
      toast.error("⚠️ You must be logged in as admin");
      return;
    }
    try {
      setLoading(true);
      if (action === "approved") {
        const res = await axios.put(
          `import.meta.env.VITE_BACKEND_URL/api/pets/${id}/approve`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Pet approved successfully");
        if (onPetApproved) onPetApproved(res.data);
      } else if (action === "rejected") {
        await axios.delete(`import.meta.env.VITE_BACKEND_URL/api/pets/${id}/reject`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("❌ Pet rejected and removed");
      }
      fetchPendingSubmissions();
      setViewing(false);
    } catch (err) {
      console.error("Action error:", err.response?.data || err.message);
      toast.error(`Failed to ${action} pet`);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (pet) => {
    setSelectedPet(pet);
    setViewing(true);
  };

  // Filter by search & species
  const filteredSubmissions = submissions.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? pet.species === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🐾 Review Pet Submissions
      </h1>

      {/* Status Tabs */}
      <div className="flex gap-4 justify-center mb-6">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by pet name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-xl w-full md:w-1/3"
        />

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          {["All", ...speciesOptions].map((species) => (
            <button
              key={species}
              onClick={() => setCategory(species === "All" ? "" : species)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === species || (species === "All" && !category)
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {species}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-b-indigo-500 animate-spin rounded-full"></div>
        </div>
      ) : statusFilter !== "pending" ? (
        <p className="text-center text-gray-600">
          No {statusFilter} pets available. Backend not implemented yet.
        </p>
      ) : filteredSubmissions.length === 0 ? (
        <p className="text-center text-gray-600">No pets found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Species</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Age</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Color</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((pet, index) => (
                <tr
                  key={pet._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{pet.petId || "-"}</td>
                  <td className="px-6 py-4">
                    <img
                      src={pet.images?.[0] || "/placeholder-pet.png"}
                      alt={pet.name}
                      className="w-14 h-14 object-cover rounded-full border shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pet.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pet.species}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pet.ageYears || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pet.color || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">RS.{pet.price || 0}.00</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    {statusFilter === "pending" && (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
                          onClick={() => handleAction(pet._id, "approved")}
                          title="Approve"
                        >
                          <FaCheckCircle size={20} />
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
                          onClick={() => handleAction(pet._id, "rejected")}
                          title="Reject"
                        >
                          <FaTimesCircle size={20} />
                        </button>
                      </>
                    )}
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
                      onClick={() => viewDetails(pet)}
                      title="View Details"
                    >
                      <FaEye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {viewing && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative shadow-xl">
            <button
              onClick={() => setViewing(false)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedPet.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Species:</span> {selectedPet.species}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Breed:</span> {selectedPet.breed}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Age:</span> {selectedPet.ageYears || "N/A"} years</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Sex:</span> {selectedPet.sex || "Unknown"}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Size:</span> {selectedPet.size || "Unknown"}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Color:</span> {selectedPet.color || "N/A"}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Price:</span> RS.{selectedPet.price}.00</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Submitted By:</span> {selectedPet.submitterName || "Unknown"}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Email:</span> {selectedPet.submitterEmail || "-"}</p>
                <p className="text-gray-500 mb-1"><span className="font-semibold">Phone:</span> {selectedPet.submitterPhone || "-"}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{selectedPet.description}</p>

            {selectedPet.images?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-4">
                {selectedPet.images.map((img, i) => (
                  <img key={i} src={img} alt={`Detail ${i}`} className="w-28 h-28 object-cover rounded-xl shadow-sm" />
                ))}
              </div>
            )}

            {statusFilter === "pending" && (
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
                  onClick={() => handleAction(selectedPet._id, "approved")}
                  title="Approve"
                >
                  <FaCheckCircle size={24} />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
                  onClick={() => handleAction(selectedPet._id, "rejected")}
                  title="Reject"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
