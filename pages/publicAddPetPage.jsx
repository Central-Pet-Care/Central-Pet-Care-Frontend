import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../utils/mediaUpload";

export default function PublicAddPetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const requiredSpecies = ["Dog", "Cat", "Bird", "Fish", "Other"];

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    ageYears: "",
    color: "",
    description: "",
    price: "",
    images: [],
    submitterName: "",
    submitterEmail: "",
    submitterPhone: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation
  const validateField = (name, value) => {
    let message = "";

    const stringFields = ["name", "breed", "color", "submitterName"];
    if (stringFields.includes(name) && /\d/.test(value)) {
      message = "This field cannot contain numbers";
    }

    if (name === "name" && !value) message = "Pet name is required";

    if (name === "species") {
      if (!value) message = "Species is required";
      else if (!requiredSpecies.includes(value))
        message = "Invalid species selected";
    }

    if (name === "price") {
      if (!value) message = "Adoption Fee is required";
      else if (Number(value) <= 0)
        message = "Adoption Fee must be greater than 0";
    }

    if (name === "ageYears") {
      if (!value) message = "Age is required";
      else if (Number(value) < 1 || Number(value) > 20)
        message = "Age must be between 1 and 20";
    }

    if (name === "submitterName" && !value) message = "Your name is required";

    if (name === "submitterEmail") {
      if (!value) message = "Your email is required";
      else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) message = "Invalid email format";
      }
    }

    if (name === "submitterPhone" && value) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value))
        message = "Phone number must be exactly 10 digits";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateForm = () => {
    let isValid = true;

    ["name", "species", "price", "submitterName", "submitterEmail", "ageYears"].forEach(
      (key) => {
        if (!validateField(key, form[key])) isValid = false;
      }
    );

    if (form.submitterPhone && !validateField("submitterPhone", form.submitterPhone))
      isValid = false;

    if (!form.images.length) {
      toast.error("Please upload at least one image");
      isValid = false;
    }

    return isValid;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const uploadedUrls = await Promise.all(
        form.images.map((file) => uploadMediaToSupabase(file))
      );

      const payload = {
        ...form,
        price: Number(form.price),
        ageYears: Number(form.ageYears),
        images: uploadedUrls.filter(Boolean),
      };

      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/pets", payload);

      toast.success(res.data.message || "Pet submitted for review!");
      setShowSuccess(true); // 🆕 show success screen
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to submit pet. Please check required fields.";
      console.error("❌ POST /api/pets error:", err.response?.data || err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 When user confirms preview modal
  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    await handleSubmit();
  };

  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-purple-100 to-blue-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-purple-700 hover:text-purple-900 font-medium flex items-center gap-2"
        >
          ⬅️ Back
        </button>

        <h1 className="text-2xl font-bold text-purple-800 text-center mb-6">
          🐾 Submit Your Pet for Review
        </h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 pt-2 border-t mt-4">
            Pet Details (Required fields marked *)
          </h2>

          {/* Pet Info Fields */}
          <input
            type="text"
            name="name"
            placeholder="Pet Name *"
            value={form.name}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}

          <select
            name="species"
            value={form.species}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.species ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Species *</option>
            {requiredSpecies.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.species && (
            <p className="text-red-500 text-sm">{errors.species}</p>
          )}

          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.breed ? "border-red-500" : ""
            }`}
          />
          {errors.breed && (
            <p className="text-red-500 text-sm">{errors.breed}</p>
          )}

          <input
            type="number"
            name="ageYears"
            placeholder="Age (Years) *"
            value={form.ageYears}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.ageYears ? "border-red-500" : ""
            }`}
            min="1"
          />
          {errors.ageYears && (
            <p className="text-red-500 text-sm">{errors.ageYears}</p>
          )}

          <input
            type="text"
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.color ? "border-red-500" : ""
            }`}
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color}</p>
          )}

          <textarea
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleChange}
            className="p-3 border rounded-xl w-full"
          />

          <input
            type="number"
            name="price"
            placeholder="Adoption Fee *"
            value={form.price}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.price ? "border-red-500" : ""
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}

          <h2 className="text-lg font-semibold text-gray-700 pt-4 border-t mt-4">
            Submitter Contact Info
          </h2>

          <input
            type="text"
            name="submitterName"
            placeholder="Your Name *"
            value={form.submitterName}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.submitterName ? "border-red-500" : ""
            }`}
          />
          {errors.submitterName && (
            <p className="text-red-500 text-sm">{errors.submitterName}</p>
          )}

          <input
            type="email"
            name="submitterEmail"
            placeholder="Your Email *"
            value={form.submitterEmail}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.submitterEmail ? "border-red-500" : ""
            }`}
          />
          {errors.submitterEmail && (
            <p className="text-red-500 text-sm">{errors.submitterEmail}</p>
          )}

          <input
            type="tel"
            name="submitterPhone"
            placeholder="Your Phone (Optional)"
            value={form.submitterPhone}
            onChange={handleChange}
            className={`p-3 border rounded-xl w-full ${
              errors.submitterPhone ? "border-red-500" : ""
            }`}
          />
          {errors.submitterPhone && (
            <p className="text-red-500 text-sm">{errors.submitterPhone}</p>
          )}

          <label className="block text-gray-600">Upload Images *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="p-3 border rounded-xl w-full"
          />
          {previewImages.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {previewImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-20 h-20 object-cover rounded-lg shadow"
                  alt={`preview-${i}`}
                />
              ))}
            </div>
          )}

          {/* 🆕 Submit button opens confirmation modal */}
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "⏳ Submitting for Review..." : "📤 Submit Pet for Review"}
          </button>
        </form>
      </div>

      {/* 🆕 Preview & Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">
              Confirm Pet Details
            </h3>
            <p className="mb-1">
              <b>Name:</b> {form.name}
            </p>
            <p className="mb-1">
              <b>Species:</b> {form.species}
            </p>
            <p className="mb-1">
              <b>Age:</b> {form.ageYears} years
            </p>
            <p className="mb-1">
              <b>Price:</b> Rs.{form.price}
            </p>
            <p className="mb-3">
              <b>Submitted by:</b> {form.submitterName}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Success Screen */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center shadow-lg w-[400px] animate-fade-in">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              🎉 Submission Successful!
            </h2>
            <p className="text-gray-600 mb-5">
              Thank you for submitting your pet. It’s now under admin review.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/pets");
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
