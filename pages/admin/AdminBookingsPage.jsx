// src/pages/admin/AdminBookingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // ✅ for View Modal

  // ✅ Fetch all bookings (Admin only)
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/booking", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change booking status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `import.meta.env.VITE_BACKEND_URL/api/booking/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (status === "Confirmed") {
        toast.success("✅ Booking confirmed successfully!");
      } else if (status === "Cancelled") {
        toast("⚠️ Booking cancelled", { icon: "⚠️" });
      }

      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating booking");
    }
  };

  // ✅ Delete booking with toast confirmation
  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium">
            Are you sure you want to delete this booking? <br />
            <span className="text-xs text-gray-500">
              This action cannot be undone.
            </span>
          </span>
          <div className="flex gap-3 justify-center mt-2">
            <button
              onClick={async () => {
                try {
                  await axios.delete(`import.meta.env.VITE_BACKEND_URL/api/booking/${id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  toast.dismiss(t.id);
                  toast.success("🗑️ Booking deleted successfully!");
                  fetchBookings();
                  setSelectedBooking(null); // ✅ Close modal if open
                } catch (err) {
                  toast.dismiss(t.id);
                  toast.error("❌ Error deleting booking");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
            >
              Yes
            </button>

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

  if (loading)
    return <p className="text-gray-600 text-lg">Loading bookings...</p>;

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Manage Bookings
      </h1>

      {/* ==== Table ==== */}
      <div className="overflow-x-auto shadow-md border border-gray-200">
        <table className="w-full bg-white text-xs text-gray-700">
          <thead className="bg-gray-200 text-gray-800 uppercase tracking-wide text-xs">
            <tr>
              <th className="px-3 py-3 border">ID</th>
              <th className="px-3 py-3 border">Image</th>
              <th className="px-3 py-3 border">Service</th>
              <th className="px-3 py-3 border">User Email</th>
              <th className="px-3 py-3 border">Date</th>
              <th className="px-3 py-3 border">Status</th>
              <th className="px-3 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr
                key={b._id}
                className="text-center odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-all"
              >
                {/* ID */}
                <td className="px-3 py-3 border font-medium text-gray-600">
                  {b.bookingId || `BKG${index + 1}`}
                </td>

                {/* IMAGE */}
                <td className="px-3 py-3 border">
                  <img
                    src={
                      b.serviceId?.images?.[0] ||
                      "https://via.placeholder.com/100"
                    }
                    alt={b.serviceId?.serviceName}
                    className="h-12 w-12 object-cover rounded-md mx-auto shadow-sm"
                  />
                </td>

                {/* SERVICE NAME */}
                <td className="px-3 py-3 border font-semibold text-purple-900">
                  {b.serviceId?.serviceName}
                </td>

                {/* USER EMAIL */}
                <td className="px-3 py-3 border text-gray-600">
                  {b.userEmail}
                </td>

                {/* DATE */}
                <td className="px-3 py-3 border text-gray-600">
                  {new Date(b.bookingDate).toLocaleDateString()}
                </td>

                {/* STATUS */}
                <td className="px-3 py-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.bookingStatus === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.bookingStatus === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-3 py-3 border">
                  <div className="flex gap-2 justify-center">
                    {/* View Button */}
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1 bg-blue-300 text-white rounded-md shadow-sm text-xs font-medium transition-all"
                    >
                      View
                    </button>

                    {/* Confirm Button */}
                    <button
                      onClick={() => handleStatusChange(b._id, "Confirmed")}
                      className="px-3 py-1 bg-purple-300 text-white rounded-md shadow-sm text-xs font-medium transition-all"
                    >
                      Confirm
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => handleStatusChange(b._id, "Cancelled")}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md shadow-sm text-xs font-medium transition-all"
                    >
                      Cancel
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(b._id)}
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

      {/* ==== View Booking Modal ==== */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute -top-3 -right-3 bg-rose-600 hover:bg-rose-700 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md"
            >
              ✕
            </button>

            {/* Service Image */}
            <img
              src={
                selectedBooking.serviceId?.images?.[0] ||
                "https://via.placeholder.com/200"
              }
              alt={selectedBooking.serviceId?.serviceName}
              className="w-full h-40 object-cover rounded-md mb-4"
            />

            {/* Details */}
            <h2 className="text-lg font-bold text-purple-800 mb-2 text-center">
              {selectedBooking.serviceId?.serviceName}
            </h2>

            <p className="text-gray-600 text-sm mb-1">
              <span className="font-semibold">Booking ID:</span>{" "}
              {selectedBooking.bookingId}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <span className="font-semibold">User Email:</span>{" "}
              {selectedBooking.userEmail}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedBooking.bookingDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <span className="font-semibold">Status:</span>{" "}
              {selectedBooking.bookingStatus}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-purple-300 text-gray-800 rounded-md text-sm"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedBooking._id)}
                className="px-4 py-2 bg-purple-900 text-white rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
