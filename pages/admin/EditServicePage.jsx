// src/pages/admin/EditServicePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Icons
import {
  FileText,
  Type,
  AlignLeft,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";

export default function EditServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    serviceName: "",
    miniDescription: "",
    description: "",
    price: "",
    duration: "",
    images: [""],
  });

  // ✅ Fetch service details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/service/${id}`)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
        toast.error("❌ Failed to load service details");
        setLoading(false);
      });
  }, [id]);

  // ✅ Validation logic
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "serviceName":
        if (!value.trim()) error = "Service name is required";
        else if (/\d/.test(value)) error = "Service name cannot contain numbers";
        break;
      case "miniDescription":
        if (!value.trim()) error = "Mini description is required";
        else if (/\d/.test(value))
          error = "Mini description cannot contain numbers";
        break;
      case "price":
        if (!value) error = "Price is required";
        else if (value <= 0) error = "Price must be greater than 0";
        break;
      case "duration":
        if (!value) error = "Duration is required";
        else if (isNaN(value)) error = "Duration must be a number";
        else if (value <= 0) error = "Duration must be greater than 0";
        break;
      case "description":
        if (!value.trim()) error = "Full description is required";
        break;
      default:
        break;
    }
    return error;
  };

  // ✅ Handle input changes with live validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("⚠️ Please fix the errors before saving");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/service/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("✅ Service updated successfully!");
      navigate("/admin/services");
    } catch (err) {
      console.error("❌ Error updating service:", err);
      toast.error("Failed to update service!");
    }
  };

  // ✅ Handle delete
  const handleDelete = async () => {
    if (window.confirm("❗ Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:5000/api/service/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("🗑️ Service deleted successfully!");
        navigate("/admin/services");
      } catch (err) {
        console.error("❌ Error deleting service:", err);
        toast.error("Failed to delete service!");
      }
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading service...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
          ✏️ Edit Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Service Name
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className={`w-full pl-10 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.serviceName
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
            </div>
            {errors.serviceName && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>
            )}
          </div>

          {/* Mini Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mini Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="miniDescription"
                value={formData.miniDescription}
                onChange={handleChange}
                className={`w-full pl-10 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.miniDescription
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
            </div>
            {errors.miniDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.miniDescription}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Description
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                className={`w-full pl-10 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 min-h-[200px] resize-y ${
                  errors.description
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-10 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.price
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-400"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Duration
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full pl-10 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.duration
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-400"
                  }`}
                />
              </div>
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="images"
                value={formData.images[0]}
                onChange={(e) =>
                  setFormData({ ...formData, images: [e.target.value] })
                }
                className="w-full pl-10 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-400"
              />
            </div>
            {formData.images[0] && (
              <img
                src={formData.images[0]}
                alt="Preview"
                className="mt-3 h-40 w-full object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="flex items-center gap-2 px-4 py-2 bg-purple-300 text-gray-800 rounded-md shadow-sm"
            >
              <XCircle className="w-5 h-5" /> Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-purple-900 text-white rounded-md shadow"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white font-semibold rounded-md shadow"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
