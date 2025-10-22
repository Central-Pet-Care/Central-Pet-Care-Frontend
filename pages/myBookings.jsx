import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/navBar";
import Footer from "../components/footer";
import { Trash, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/booking/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bookings", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      console.error("No token found in localStorage");
    }
  }, []);

  // ✅ Delete Booking
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter((b) => b._id !== id));
      toast.success("Booking deleted successfully!");
    } catch (err) {
      console.error("Error deleting booking", err);
      toast.error("Failed to delete booking!");
    }
  };

  
  // ✅ Add to Cart
  const handleAddToCart = async (booking) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/cart",
        {
          serviceId: booking.serviceId?._id,
          bookingId: booking._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart", err);
      toast.error("Failed to add to cart!");
    }
  };

  // ✅ Generate PDF
const handleGeneratePdf = (booking) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Modern Brand Colors (Lavender + Aqua + Slate)
  const deepPurple = [94, 53, 177];
  const accentAqua = [0, 180, 155];
  const darkText = [40, 40, 50];
  const lightGray = [150, 150, 150];
  const dividerGray = [220, 220, 220];
  const softBg = [245, 243, 255];

  
  //  GRADIENT HEADER (simulated)
  doc.setFillColor(...deepPurple);
  doc.rect(0, 0, 210, 40, "F");

  // Optional logo
  const logoUrl =
    "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg";
  const img = new Image();
  img.src = logoUrl;
  img.onload = () => {
    doc.addImage(img, "JPEG", 15, 10, 20, 20);
  };

  // Title text
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Central Pet Care", 105, 23, { align: "center" });

  // Date
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${dateStr} ${timeStr}`, 150, 32);

  
  // MAIN TITLE
  doc.setFontSize(18);
  doc.setTextColor(...deepPurple);
  doc.setFont("helvetica", "bold");
  doc.text("Booking Confirmation", 20, 58);

  // Accent divider
  doc.setDrawColor(...accentAqua);
  doc.setLineWidth(1);
  doc.line(20, 60, 190, 60);

 
  // BOOKING DETAILS
  const startY = 75;
  const boxHeight = 80;
  doc.setFillColor(...softBg);
  doc.roundedRect(15, startY - 5, 180, boxHeight, 5, 5, "F");
  doc.setDrawColor(...dividerGray);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, startY - 5, 180, boxHeight, 5, 5);

  const info = [
    ["Booking ID", booking._id],
    ["Service", booking.serviceId?.serviceName || "N/A"],
    ["Price", `Rs. ${booking.serviceId?.price || "N/A"}`],
    ["Date", new Date(booking.bookingDate).toLocaleDateString()],
    ["Status", booking.bookingStatus],
    ["Email", booking.userEmail],
  ];

  let y = startY + 10;
  doc.setFontSize(12);
  info.forEach(([label, value], i) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...deepPurple);
    doc.text(`${label}:`, 25, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkText);
    doc.text(String(value), 70, y);
    y += 12;

    // Divider line between rows
    if (i < info.length - 1) {
      doc.setDrawColor(...dividerGray);
      doc.setLineWidth(0.2);
      doc.line(25, y - 5, 185, y - 5);
    }
  });

  // THANK YOU SECTION
  const thankY = y + 15;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...accentAqua);
  doc.text("Thank you for booking with Central Pet Care!", 105, thankY, {
    align: "center",
  });

  doc.setTextColor(...lightGray);
  doc.text(
    "We look forward to caring for your beloved pet with love and dedication 🐾",
    105,
    thankY + 8,
    { align: "center" }
  );

  //FOOTER
  doc.setDrawColor(...deepPurple);
  doc.setLineWidth(0.6);
  doc.line(20, 285, 190, 285);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text(
    "Central Pet Care • www.centralpetcare.lk • +94 77 123 4567",
    105,
    292,
    { align: "center" }
  );

  // ✅ SAVE PDF
  doc.save(`CentralPetCare_Booking_${booking._id}.pdf`);
};

  return (
    <>
      <Header />

      {/* ✅ Hero Section */}
      <section className="relative bg-purple-100 py-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-27%20023659.png"
              alt="Bookings"
              className="rounded-3xl shadow-2xl h-[350px] object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-purple-900 leading-snug mb-6">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-purple-900">
                Bookings
              </span>{" "}
              🐾
            </h1>

            <p className="text-black max-w-lg mb-6">
              Track all your confirmed, pending, and completed bookings here.
              Manage your pet’s care with ease and enjoy stress-free service
              updates.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#bookings"
                className="px-6 py-3 rounded-full bg-purple-900 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                View My Bookings
              </a>
              <a
                href="/services"
                className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-700 font-semibold hover:bg-purple-50 transition"
              >
                Book a New Service
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Bookings Grid */}
      <div id="bookings" className="relative min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <h2 className="text-4xl font-bold text-purple-800 mb-12 text-center drop-shadow-sm">
            ✨ My Bookings
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 text-xl">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">
              No bookings found.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="relative p-5 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-2xl transition-transform duration-300"
                >
                  {/* Service Image */}
                  {booking.serviceId?.images?.length > 0 && (
                    <img
                      src={booking.serviceId.images[0]}
                      alt={booking.serviceId?.serviceName || "Service"}
                      className="w-full h-40 object-cover rounded-xl mb-4 shadow-md"
                    />
                  )}

                  {/* Service Name */}
                  <h3 className="text-xl font-semibold text-purple-900 mb-4 tracking-wide">
                    {booking.serviceId?.serviceName || "Service"}
                  </h3>

                  {/* Email */}
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Email:</strong> {booking.userEmail || "N/A"}
                  </p>

                  {/* Service Info */}
                  <div className="space-y-2 text-gray-800 text-sm">
                    <p>
                      <strong>💰 Price:</strong> Rs.{" "}
                      {booking.serviceId?.price || "N/A"}
                    </p>
                    <p>
                      <strong>⏳ Duration:</strong>{" "}
                      {booking.serviceId?.duration || "N/A"}
                    </p>
                    <p>
                      <strong>📅 Date:</strong>{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>📋 Status:</strong>{" "}
                      <span
                        className={`ml-2 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                          booking.bookingStatus === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.bookingStatus === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.bookingStatus || "Pending"}
                      </span>
                    </p>
                  </div>

                  {/* ✅ Action Buttons */}
                  {booking.bookingStatus === "Pending" && (
                    <div className="mt-5">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-800 font-medium hover:bg-purple-200 transition text-sm"
                      >
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  )}

                  {booking.bookingStatus === "Confirmed" && (
                    <div className="mt-5 flex gap-3">
                      
                      <button
                        onClick={() => handleGeneratePdf(booking)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium hover:bg-green-200 transition text-sm"
                      >
                        <FileDown size={16} /> Download PDF
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
