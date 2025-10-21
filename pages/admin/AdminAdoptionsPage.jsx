import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaClipboardCheck } from "react-icons/fa";
import generateAdoptionReport from "../../utils/generateAdoptionReport";

export default function AdminAdoptionsPage() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchAdoptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/adoptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdoptions(res.data);
    } catch (err) {
      console.error("❌ Error fetching adoptions:", err);
      toast.error("Failed to load adoption requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleStatusChange = async (adoptionId, status) => {
    try {
      const token = localStorage.getItem("token");
      const body = { adoptionStatus: status };

      await axios.patch(
        `http://localhost:5000/api/adoptions/${adoptionId}/status`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Adoption ${status}`);
      await fetchAdoptions();
    } catch (err) {
      console.error("❌ Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const statusOptions = ["All", "Pending", "Approved", "Rejected", "Completed"];

  const filteredAdoptions = adoptions.filter((a) =>
    filterStatus && filterStatus !== "All"
      ? a.adoptionStatus?.toLowerCase() === filterStatus.toLowerCase()
      : true
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📝 Admin Adoption Management
        </h1>

        {/* ✅ Download Report Button */}
        <button
          onClick={() => generateAdoptionReport(filteredAdoptions)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          📄 Download Monthly Report
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status === "All" ? "" : status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
              ${
                filterStatus === status || (status === "All" && filterStatus === "")
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <div className="w-[60px] h-[60px] border-[4px] border-gray-200 border-b-[#3b82f6] animate-spin rounded-full"></div>
        </div>
      ) : filteredAdoptions.length === 0 ? (
        <p className="text-center text-gray-500">No adoption requests found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Pet ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">View</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdoptions.map((adoption, index) => (
                <tr
                  key={adoption._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  {/* Pet ID */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {adoption.petId}
                  </td>

                  {/* User */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {adoption.userDetails?.firstName &&
                    adoption.userDetails?.lastName
                      ? `${adoption.userDetails.firstName} ${adoption.userDetails.lastName}`
                      : adoption.userDetails?.email ||
                        adoption.userEmail ||
                        "Unknown"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold 
                        ${
                          adoption.adoptionStatus === "Approved"
                            ? "bg-green-100 text-green-700"
                            : adoption.adoptionStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : adoption.adoptionStatus === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                    >
                      {adoption.adoptionStatus}
                    </span>
                  </td>

                  {/* View More */}
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/adoptions/pet/${adoption.petId}`}
                      className="inline-block px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm text-center transition"
                    >
                      View
                    </Link>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleStatusChange(adoption._id, "Approved")}
                      disabled={adoption.adoptionStatus === "Completed"}
                      className="text-green-600 hover:text-green-800 transition"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleStatusChange(adoption._id, "Rejected")}
                      disabled={adoption.adoptionStatus === "Completed"}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={() => handleStatusChange(adoption._id, "Completed")}
                      disabled={adoption.adoptionStatus !== "Approved"}
                      className="text-purple-600 hover:text-purple-800 transition"
                      title="Complete"
                    >
                      <FaClipboardCheck />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
