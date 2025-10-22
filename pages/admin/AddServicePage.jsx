import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Tag,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AddServicePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceId: "",
    serviceName: "",
    miniDescription: "",
    description: "",
    price: "",
    duration: "",
    images: [""],
  });

  const [errors, setErrors] = useState({});

  //  Validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "serviceId":
        if (!value.trim()) error = "Service ID is required";
        else if (!/^SVC00/.test(value))
          error = "Service ID must start with 'SVC00'";
        break;

      case "serviceName":
        if (!value.trim()) error = "Service Name is required";
        else if (!/^[A-Za-z\s]+$/.test(value))
          error = "Service Name must contain only letters (no numbers)";
        break;

      case "miniDescription":
        if (!value.trim()) error = "Mini Description is required";
        else if (/\d/.test(value))
          error = "Mini Description cannot contain numbers";
        break;

      case "price":
        if (!value) error = "Price is required";
        else if (Number(value) <= 0) error = "Price must be greater than 0";
        break;

      case "duration":
        if (!value) error = "Duration is required";
        else if (value <= 0) error = "Duration must be greater than 0";
        break;

      case "images":
        if (
          value &&
          !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)
        ) {
          error = "Must be a valid image URL (jpg, png, gif, webp)";
        }
        break;

      default:
        break;
    }

    return error;
  };

  //  Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  //  Handle image separately
  const handleImageChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, images: [value] });

    const errorMsg = validateField("images", value);
    setErrors({ ...errors, images: errorMsg });
  };

  //  Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        newErrors[key] = validateField(key, formData.images[0]);
      } else {
        newErrors[key] = validateField(key, formData[key]);
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg)) {
      toast.error("❌ Please fix the errors before saving!");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/service", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("✅ Service added successfully!");
      navigate("/admin/services");
    } catch (err) {
      console.error("❌ Error adding service:", err);
      toast.error("Failed to add service!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-purple-700 flex items-center justify-center gap-2">
          ➕ Add New Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service ID */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <Hash className="w-5 h-5 text-purple-600" /> Service ID
            </label>
            <input
              type="text"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
            />
            {errors.serviceId && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceId}</p>
            )}
          </div>

          {/* Service Name */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <Tag className="w-5 h-5 text-purple-600" /> Service Name
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
            />
            {errors.serviceName && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceName}</p>
            )}
          </div>

          {/* Mini Description */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <FileText className="w-5 h-5 text-purple-600" /> Mini Description
            </label>
            <input
              type="text"
              name="miniDescription"
              value={formData.miniDescription}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
            />
            {errors.miniDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.miniDescription}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <FileText className="w-5 h-5 text-purple-600" /> Full Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300 resize-y"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                <DollarSign className="w-5 h-5 text-purple-600" /> Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                <Clock className="w-5 h-5 text-purple-600" /> Duration
              </label>
              <input
                type="text"
                name="duration"
                placeholder="e.g., 2 hours 30 minutes"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
              />
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <ImageIcon className="w-5 h-5 text-purple-600" /> Image URL
            </label>
            <input
              type="text"
              name="images"
              value={formData.images[0]}
              onChange={handleImageChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-300"
            />
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">{errors.images}</p>
            )}
            {formData.images[0] && !errors.images && (
              <img
                src={formData.images[0]}
                alt="Preview"
                className="mt-4 h-48 w-full object-cover rounded-xl border shadow"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="px-5 py-2 rounded-lg bg-purple-300 text-gray-800 font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-900 text-white font-semibold shadow hover:bg-green-600 transition"
            >
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
