// src/pages/admin/AdminServicesPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";


export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("import.meta.env.VITE_BACKEND_URL/api/service");
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("❌ Failed to load services!");
      setLoading(false);
    }
  };

  // ✅ Delete Service with Toast Confirmation
const handleDelete = async (id) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium">
          Are you sure you want to delete this service? <br />
          <span className="text-xs text-gray-500">
            This action cannot be undone.
          </span>
        </span>
        <div className="flex gap-3 justify-center mt-2">
          {/* Yes Button */}
          <button
            onClick={async () => {
              try {
                await axios.delete(`import.meta.env.VITE_BACKEND_URL/api/service/${id}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });

                // remove from state
                setServices((prev) => prev.filter((s) => s._id !== id));

                toast.dismiss(t.id);
                toast.success("🗑️ Service deleted successfully!");
              } catch (err) {
                console.error("❌ Error deleting service:", err);
                toast.dismiss(t.id);
                toast.error("❌ Error deleting service");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
          >
            Yes
          </button>

          {/* No Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-400 text-white rounded-md text-xs"
          >
            No
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};


  if (loading) return <p>Loading services...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* ==== Header with Add Button ==== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Manage Services
          </h1>
          <p className="text-gray-600 text-sm">
            Add, edit or delete services here.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/services/add")}
          className="px-5 py-2 bg-blue-950 text-white rounded-lg shadow-md font-semibold transition-all text-sm"
        >
          Add Service
        </button>
      </div>

      {/* ==== Table ==== */}
      <div className="overflow-x-auto shadow-md border border-gray-200">
        <table className="w-full bg-white text-xs text-gray-700">
          <thead className="bg-gray-200 text-gray-800 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-3 py-3 border">ID</th>
              <th className="px-3 py-3 border">Image</th>
              <th className="px-3 py-3 border">Name</th>
              <th className="px-3 py-3 border">Mini Description</th>
              <th className="px-3 py-3 border">Duration</th>
              <th className="px-3 py-3 border">Price</th>
              <th className="px-3 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr
                key={service._id}
                className="text-center odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <td className="px-3 py-3 border font-medium text-gray-600">
                  {service.serviceId || `SVC${index + 1}`}
                </td>
                <td className="px-3 py-3 border">
                  <img
                    src={
                      service.images?.[0] || "https://via.placeholder.com/100"
                    }
                    alt={service.serviceName}
                    className="h-12 w-12 object-cover rounded-md mx-auto shadow-sm"
                  />
                </td>
                <td className="px-3 py-3 border font-semibold text-purple-900">
                  {service.serviceName}
                </td>
                <td className="px-3 py-3 border text-gray-500 text-[11px] italic">
                  {service.miniDescription}
                </td>
                <td className="px-3 py-3 border text-gray-600">
                  {service.duration}
                </td>
                <td className="px-3 py-3 border font-bold text-green-600">
                  ${service.price}
                </td>
                <td className="px-3 py-3 border">
                  <div className="flex gap-2 justify-center">
                    {/* View Button */}
                    <button
                      onClick={() => setSelectedService(service)}
                      className="px-3 py-1 bg-purple-300 text-white rounded-md shadow-sm text-xs font-medium transition-all"
                    >
                      View
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() =>
                        navigate(`/admin/services/edit/${service._id}`)
                      }
                      className="px-3 py-1 bg-purple-600 text-white rounded-md shadow-sm text-xs font-medium transition-all"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="px-3 py-1 bg-purple-900 text-white rounded-md shadow-sm text-xs font-medium transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==== Modal for View ==== */}
      {selectedService && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-sm relative animate-fadeIn text-xs">
            {/* Close Button (fixed top-right) */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute -top-3 -right-3 bg-rose-600 hover:bg-rose-700 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md text-sm"
            >
              ✕
            </button>

            {/* Service Image */}
            <img
              src={
                selectedService.images?.[0] ||
                "https://via.placeholder.com/200"
              }
              alt={selectedService.serviceName}
              className="w-full h-36 object-cover rounded-lg mb-3 shadow"
            />

            {/* Service Name */}
            <h2 className="text-lg font-bold text-indigo-700 text-center mb-1">
              {selectedService.serviceName}
            </h2>

            {/* Mini Description */}
            {selectedService.miniDescription && (
              <p className="text-gray-500 text-center mb-1 italic text-[11px]">
                "{selectedService.miniDescription}"
              </p>
            )}

            {/* Full Description */}
            <p className="text-gray-700 mb-3 text-center leading-snug text-xs">
              {selectedService.description}
            </p>

            {/* Details */}
            <div className="flex justify-between items-center bg-gray-100 rounded-md p-2 mb-3 shadow-inner text-xs">
              <span className="text-gray-600">
                ⏱ {selectedService.duration || "N/A"}
              </span>
              <span className="text-green-600 font-bold text-sm">
                ${selectedService.price}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setSelectedService(null)}
                className="px-3 py-1 bg-purple-300 text-black rounded-md shadow-sm text-xs"
              >
                Close
              </button>
              <button
                onClick={() =>
                  navigate(`/admin/services/edit/${selectedService._id}`)
                }
                className="px-3 py-1 bg-purple-600 text-white rounded-md shadow-sm text-xs"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
