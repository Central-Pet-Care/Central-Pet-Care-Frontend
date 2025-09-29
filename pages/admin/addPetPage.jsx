import { useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimesCircle } from "react-icons/fa";
import uploadMediaToSupabase from "../../utils/mediaUpload";

const speciesList = ["Dog", "Cat", "Bird", "Fish", "Other"];
const sizeList = ["Unknown", "Small", "Medium", "Large", "Giant"];
const sexList = ["Unknown", "Male", "Female"];

/* Reusable input component to avoid repetition */
const Input = ({ name, value, type = "text", placeholder, min, error, onChange }) => (
  <div className="flex flex-col">
    <input
      type={type}
      name={name}
      value={value}
      min={min}
      placeholder={placeholder}
      onChange={onChange}
      className={`border p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 shadow-sm ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {/* Display inline validation error */}
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

export default function AddPetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // For resetting <input type="file">

  /* 📝 Form State */
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "Unknown",
    ageYears: "",
    size: "Unknown",
    color: "",
    description: "",
    price: "",
    images: [], // Will hold selected File objects
  });

  /*  Validation & UI State */
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]); // Local preview URLs
  const [loading, setLoading] = useState(false);

  /* ✅ Field-level validation logic */
  const validateField = useCallback((name, value) => {
    const letters = /^[A-Za-z\s]*$/;
    let msg = "";

    if (name === "name" && !value) msg = "Name is required";
    if (["name", "breed", "color"].includes(name) && value && !letters.test(value))
      msg = "Only letters allowed";
    if (name === "ageYears" && (value < 0 || value > 20)) msg = "Age must be 0–20";
    if (name === "price" && value < 1) msg = "Price must be greater than 0";

    setErrors((prev) => ({ ...prev, [name]: msg }));
  }, []);

  /*  Handle text/select input changes */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    },
    [validateField]
  );

  /*  Handle image selection (supports multiple files) */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Store File objects for upload
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    // Generate preview URLs for immediate display
    setPreviewImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);

    // Reset input so user can select again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* Remove a single selected image (both preview + file list) */
  const handleRemoveImage = (i) => {
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== i));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));
    toast.success("🗑️ Image removed");
  };

  /* Submit Form - Upload images then send data to API */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation before submit
    if (!form.name || !form.species || !form.price)
      return toast.error("Name, Species & Price are required");
    if (Object.values(errors).some(Boolean)) return;
    if (!form.images.length) return toast.error("Please upload at least one image");

    try {
      setLoading(true);

      // Upload each image to Supabase and collect URLs
      const uploadedUrls = await Promise.all(
        form.images.map(async (file) => {
          try {
            return await uploadMediaToSupabase(file);
          } catch {
            toast.error(`❌ Failed: ${file.name}`);
            return null;
          }
        })
      );

      // Prepare payload with uploaded URLs
      const payload = { ...form, images: uploadedUrls.filter(Boolean) };

      // Send to backend
      await axios.post("http://localhost:5000/api/pets", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("🐾 Pet added successfully!");

      // Navigate & reload to refresh pet list in AdminPetsPage
      navigate("../pets", { replace: true });
      setTimeout(() => window.location.reload(), 200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center py-10">
      <div className="w-full max-w-4xl bg-gradient-to-br from-purple-100 via-white to-indigo-200 rounded-2xl shadow-md p-8">
        {/* 🔙 Go back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Pet</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 🐾 Pet Info Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pet Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Pet Name *" />
              <select name="species" value={form.species} onChange={handleChange} className="border p-3 rounded-xl">
                <option value="">Select Species *</option>
                {speciesList.map((sp) => <option key={sp}>{sp}</option>)}
              </select>
              <Input name="breed" value={form.breed} onChange={handleChange} error={errors.breed} placeholder="Breed" />
              <Input name="color" value={form.color} onChange={handleChange} error={errors.color} placeholder="Color" />
            </div>
          </section>

          {/* Additional Info Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select name="sex" value={form.sex} onChange={handleChange} className="border p-3 rounded-xl">
                {sexList.map((s) => <option key={s}>{s}</option>)}
              </select>
              <Input name="ageYears" type="number" min="0" value={form.ageYears} onChange={handleChange} error={errors.ageYears} placeholder="Age (Years)" />
              <select name="size" value={form.size} onChange={handleChange} className="border p-3 rounded-xl">
                {sizeList.map((sz) => <option key={sz}>{sz}</option>)}
              </select>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-3 rounded-xl w-full mt-4"
              rows="3"
            />
          </section>

          {/* Pricing Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <Input name="price" type="number" min="1" value={form.price} onChange={handleChange} error={errors.price} placeholder="Price (Rs.) *" />
          </section>

          {/* Image Upload Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <label htmlFor="pet-images" className="border p-3 rounded-xl w-full bg-gray-50 cursor-pointer block text-gray-700">
              {previewImages.length
                ? ` ${previewImages.length} file${previewImages.length > 1 ? "s" : ""} selected`
                : "Choose Files"}
            </label>
            <input
              ref={fileInputRef}
              id="pet-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previewImages.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="Preview" className="w-24 h-24 object-cover rounded-xl border" />
                    {/*  Remove button for this image */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-100"
                    >
                      <FaTimesCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Adding Pet..." : " Add Pet"}
          </button>
        </form>
      </div>
    </div>
  );
}
