import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/navBar";
import Footer from "../components/footer";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Tag,
  Timer,
} from "lucide-react";

export default function BookingPage() {

const navigate = useNavigate(); // <-- 🆕 useNavigate hook

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    petType: "Dog",
    serviceId: "",
    bookingDate: "",
    timeSlot: "",
    notes: "",
  });

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [messageLeft, setMessageLeft] = useState("");
  const [messageRight, setMessageRight] = useState("");
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);



  // Fetch services
  useEffect(() => {
    axios
      .get("import.meta.env.VITE_BACKEND_URL/api/service")
      .then((res) => setServices(res.data))
      .catch((err) =>
        console.error("Error fetching services:", err.response?.data || err)
      );
  }, []);

  
  // Validation rules
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        break;
      case "email":
         if (!value.trim()) error = "Email is required";
         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Email must be a valid email address";
          break;
      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(value))
          error = "Phone number must be 10 digits";
        break;
      case "serviceId":
        if (!value) error = "Please select a service";
        break;
      case "bookingDate":
        if (!value) {
          error = "Booking date is required";
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          if (selectedDate <= today) {
            error = "Please select a future date";
          }
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "serviceId") {
      const service = services.find((s) => s._id === value);
      setSelectedService(service || null);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save details
  const handleSubmitLeft = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setMessageLeft("✅ User details saved locally!");
  };

  // Confirm booking
  const handleSubmitRight = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!acceptedTerms) {
      setMessageRight("❌ You must accept the Terms & Conditions before booking.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("import.meta.env.VITE_BACKEND_URL/api/booking", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessageRight(res.data.message || "Booking created successfully ✅");

      // 🆕 Wait 1.5s and redirect to MyBookings
      setTimeout(() => {
        navigate("/my-bookings"); 
      }, 1500);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        petType: "Dog",
        serviceId: "",
        bookingDate: "",
        timeSlot: "",
        notes: "",
      });
      setSelectedService(null);
      setErrors({});
      setAcceptedTerms(false);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setMessageRight(err.response?.data?.message || "Booking failed ❌");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* ✅ Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="flex justify-center">
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ServicePage/Screenshot%202025-09-26%20062709.png"
              alt="Happy Dogs"
              className="rounded-3xl shadow-2xl w-full md:w-4/5"
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-purple-900 leading-snug">
              Book Your Pet’s <br /> Perfect Care 🐾
            </h1>
            <p className="mt-6 text-gray-700 text-lg leading-relaxed">
              From grooming and training to veterinary checkups — schedule a
              hassle-free appointment and give your furry friend the care they
              deserve.
            </p>
            <div className="mt-6 h-1 w-20 bg-purple-600 rounded"></div>
          </div>
        </div>
      </section>

      {/* ✅ Progress Steps */}
      <section className="bg-purple-50 py-8">
        <div className="max-w-4xl mx-auto flex justify-between text-purple-700 font-semibold">
          <div className="flex flex-col items-center">
            <span className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
              1
            </span>
            <p className="mt-2">Your Details</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
              2
            </span>
            <p className="mt-2">Select Service</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
              3
            </span>
            <p className="mt-2">Confirm Booking</p>
          </div>
        </div>
      </section>

      {/* ✅ Booking Section */}
      <main className="flex-grow max-w-6xl mx-auto px-6 pb-16 bg-white">
        <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-12 mt-16">
          Book Your Pet Care Service 🐶
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT FORM */}
          <form
            onSubmit={handleSubmitLeft}
            className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-lg border border-purple-100 hover:shadow-2xl transition duration-300"
          >
            <h3 className="text-2xl font-bold text-purple-800 mb-8 flex items-center gap-2">
              👤 Your Details
            </h3>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name
              </label>
              <div
                className={`flex items-center border rounded-xl px-4 ${
                  errors.name ? "border-red-500" : "border-purple-300"
                }`}
              >
                <User className="w-5 h-5 text-purple-500 mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <div
                className={`flex items-center border rounded-xl px-4 ${
                  errors.email ? "border-red-500" : "border-purple-300"
                }`}
              >
                <Mail className="w-5 h-5 text-purple-500 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Phone
              </label>
              <div
                className={`flex items-center border rounded-xl px-4 ${
                  errors.phone ? "border-red-500" : "border-purple-300"
                }`}
              >
                <Phone className="w-5 h-5 text-purple-500 mr-3" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="0771234567"
                  required
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Address (optional)
              </label>
              <div className="flex items-center border border-purple-300 rounded-xl px-4">
                <MapPin className="w-5 h-5 text-purple-500 mr-3" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  placeholder="Colombo, Sri Lanka"
                />
              </div>
            </div>

            {/* Pet Type */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Pet Type
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="w-full border border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Dog">🐕 Dog</option>
                <option value="Cat">🐈 Cat</option>
                <option value="Other">🐾 Other</option>
              </select>
            </div>

            {/* Save Details */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition duration-300"
            >
              💾 Save Details
            </button>
            {messageLeft && (
              <p className="text-center mt-4 text-purple-700 font-semibold">
                {messageLeft}
              </p>
            )}
          </form>

          {/* RIGHT FORM */}
          <form
            onSubmit={handleSubmitRight}
            className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-lg border border-purple-100 hover:shadow-2xl transition duration-300"
          >
            <h3 className="text-2xl font-bold text-purple-800 mb-8 flex items-center gap-2">
              🛠️ Service & Booking
            </h3>

            {/* Service Dropdown */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Service
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 ${
                  errors.serviceId ? "border-red-500" : "border-purple-300"
                }`}
                required
              >
                <option value="">-- Select --</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="text-red-500 text-sm mt-1">{errors.serviceId}</p>
              )}
            </div>

            {/* Auto-filled Service Details */}
            {selectedService && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl border">
                  <Tag className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">
                    {selectedService.serviceName}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl border">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">
                    Rs. {selectedService.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl border">
                  <Timer className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">
                    {selectedService.duration}
                  </span>
                </div>
              </div>
            )}

            {/* Booking Date */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Booking Date
              </label>
              <div
                className={`flex items-center border rounded-xl px-4 ${
                  errors.bookingDate ? "border-red-500" : "border-purple-300"
                }`}
              >
                <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                  required
                />
              </div>
              {errors.bookingDate && (
                <p className="text-red-500 text-sm mt-1">{errors.bookingDate}</p>
              )}
            </div>

            {/* Time Slot */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Time Slot (optional)
              </label>
              <div className="flex items-center border border-purple-300 rounded-xl px-4">
                <Clock className="w-5 h-5 text-purple-500 mr-3" />
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none"
                >
                  <option value="">-- Select a slot --</option>
                  <option value="Morning">Morning (9am - 12pm)</option>
                  <option value="Afternoon">Afternoon (1pm - 4pm)</option>
                  <option value="Evening">Evening (5pm - 8pm)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Notes / Special Instructions
              </label>
              <div className="flex items-start border border-purple-300 rounded-xl px-4">
                <FileText className="w-5 h-5 text-purple-500 mt-3 mr-3" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none resize-none"
                  placeholder="Write any special instructions here..."
                  rows={3}
                />
              </div>
            </div>

            {/* ✅ Terms & Conditions */}
            <div className="mb-5 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="terms" className="ml-3 text-gray-700 text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-purple-600 underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-purple-600 underline">
                  Privacy Policy
                </a>.
              </label>
            </div>

            {/* Confirm Booking */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition duration-300"
            >
              ✅ Confirm Booking
            </button>
            {messageRight && (
              <p className="text-center mt-4 text-purple-700 font-semibold">
                {messageRight}
              </p>
            )}
          </form>
        </div>
        
{/* 🔘 View Bookings Section */}
<div className="bg-purple-100 rounded-2xl shadow-inner px-6 py-4 mt-10 flex items-center justify-between">
  {/* 📝 Note */}
  <p className="text-purple-800 font-medium text-sm">
    💡 You can view and manage all your bookings anytime.
  </p>

  {/* 📖 Button */}
  <button
    onClick={() => navigate("/my-bookings")}
    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-xl shadow-md transition duration-300"
  >
    📖 View Bookings
  </button>
</div>


        {/* ✅ Google Map Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-10">
            📍 Find Us on the Map
          </h2>
          <div className="flex justify-center md:justify-end relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="relative w-full max-w-4xl md:max-w-5xl drop-shadow-2xl rounded-2xl overflow-hidden border-4 border-purple-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.3608518546575!2d79.88249037480887!3d6.847273493151008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25afaa307f761%3A0xe0b66ab6402425e8!2sCentral%20Pet%20Care!5e0!3m2!1sen!2slk!4v1758775385315!5m2!1sen!2slk"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
