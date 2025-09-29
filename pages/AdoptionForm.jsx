// src/pages/AdoptionForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function AdoptionForm() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes("/edit");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    age: "",
    alternateEmail: "",
    homeEnvironment: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation function
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full Name is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Only letters are allowed in Full Name";
        return "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^\d{10}$/.test(value))
          return "Phone must be exactly 10 digits";
        return "";
      case "age":
        if (!value) return "Age is required";
        if (!/^\d+$/.test(value)) return "Age must be a number";
        if (parseInt(value, 10) < 15) return "Age must be 15 or older";
        return "";
      case "alternateEmail":
        if (!value) return "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      case "address":
        if (!value.trim()) return "Address is required";
        return "";
      case "homeEnvironment":
        if (!value.trim()) return "Home Environment is required";
        return "";
      case "experience":
        if (!value.trim()) return "Experience is required";
        return "";
      default:
        return "";
    }
  };

  // ✅ Run validation live
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ✅ Prefill data when editing
  useEffect(() => {
    if (!isEditMode || !petId) return;

    const fetchAdoption = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${API_BASE}/api/adoptions/my/pet/${petId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData({
          fullName: data.personalInfo?.fullName || "",
          phone: data.personalInfo?.phone || "",
          address: data.personalInfo?.address || "",
          age: data.personalInfo?.age || "",
          alternateEmail: data.alternateEmail || "",
          homeEnvironment: data.homeEnvironment || "",
          experience: data.experience || "",
        });
      } catch (err) {
        console.error("Error loading adoption:", err);
        toast.error("Failed to load adoption details");
      }
    };

    fetchAdoption();
  }, [isEditMode, petId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submit
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const errMsg = validateField(key, formData[key]);
      if (errMsg) newErrors[key] = errMsg;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      let res;

      const payload = {
        alternateEmail: formData.alternateEmail,
        homeEnvironment: formData.homeEnvironment,
        experience: formData.experience,
        personalInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          age: formData.age,
        },
      };

      if (isEditMode && petId) {
        res = await axios.put(`${API_BASE}/api/adoptions/pet/${petId}`, payload, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        toast.success(res.data?.message || "Adoption updated successfully!");
      } else {
        res = await axios.post(`${API_BASE}/api/adoptions/apply`, { petId, ...payload }, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        toast.success(res.data?.message || "Adoption request submitted!");
      }

      navigate("/adoptions");
    } catch (err) {
      console.error("Adoption submit error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-200 via-blue-100 to-white min-h-screen flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 relative">
        <Link
          to={isEditMode ? "/adoptions" : `/petInfo/${petId}`}
          className="absolute top-4 left-4 text-purple-700 hover:text-purple-900 text-2xl font-bold"
          title="Back"
        >
          ←
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isEditMode ? "Edit Adoption Request ✏️" : "Adoption Form 🐾"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.fullName ? "border-red-500" : ""
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.address ? "border-red-500" : ""
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.age ? "border-red-500" : ""
              }`}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          {/* Alternate Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Alternate Email</label>
            <input
              type="email"
              name="alternateEmail"
              value={formData.alternateEmail}
              onChange={handleChange}
              placeholder="example@domain.com"
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.alternateEmail ? "border-red-500" : ""
              }`}
            />
            {errors.alternateEmail && (
              <p className="text-red-500 text-sm">{errors.alternateEmail}</p>
            )}
          </div>

          {/* Home Environment */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Home Environment</label>
            <input
              type="text"
              name="homeEnvironment"
              value={formData.homeEnvironment}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.homeEnvironment ? "border-red-500" : ""
              }`}
            />
            {errors.homeEnvironment && (
              <p className="text-red-500 text-sm">{errors.homeEnvironment}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience with Pets</label>
            <textarea
              name="experience"
              rows="3"
              value={formData.experience}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 ${
                errors.experience ? "border-red-500" : ""
              }`}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">{errors.experience}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : isEditMode ? "Update Request" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

