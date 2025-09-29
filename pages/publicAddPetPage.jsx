import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../utils/mediaUpload";

export default function PublicAddPetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    ageYears: "",
    color: "",
    description: "",
    price: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    const letters = /^[A-Za-z\s]*$/;
    let message = "";

    if (name === "name" && !value) message = "Pet name is required";
    if (["name", "breed", "color"].includes(name) && value && !letters.test(value))
      message = "Only letters allowed";
    if (name === "ageYears" && value && (value < 0 || value > 20))
      message = "Age must be between 0 and 20";
    if (name === "price" && value && value <= 0)
      message = "Price must be greater than 0";

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviewImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(form).forEach((key) => validateField(key, form[key]));
    if (!form.name || !form.species || !form.price) isValid = false;
    if (!form.images.length) {
      toast.error("Please upload at least one image");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Upload images to Supabase
      const uploadedUrls = await Promise.all(
        form.images.map((file) => uploadMediaToSupabase(file))
      );

      await axios.post("http://localhost:5000/api/pets", {
        ...form,
        images: uploadedUrls.filter(Boolean),
      });

      toast.success("✅ Pet submitted for review!");
      navigate("/pets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit pet");
    } finally {
      setLoading(false);
    }
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
          🐾 Submit Your Pet
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Pet Name"
              value={form.name}
              onChange={handleChange}
              className={`p-3 border rounded-xl w-full ${errors.name ? "border-red-500" : ""}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Species */}
          <div>
            <select
              name="species"
              value={form.species}
              onChange={handleChange}
              className={`p-3 border rounded-xl w-full ${errors.species ? "border-red-500" : ""}`}
              required
            >
              <option value="">Select Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Fish">Fish</option>
              <option value="Other">Other</option>
            </select>
            {errors.species && <p className="text-red-500 text-sm">{errors.species}</p>}
          </div>

          {/* Breed */}
          <div>
            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={form.breed}
              onChange={handleChange}
              className={`p-3 border rounded-xl w-full ${errors.breed ? "border-red-500" : ""}`}
            />
            {errors.breed && <p className="text-red-500 text-sm">{errors.breed}</p>}
          </div>

          {/* Age */}
          <div>
            <input
              type="number"
              name="ageYears"
              placeholder="Age (Years)"
              value={form.ageYears}
              onChange={handleChange}
              className={`p-3 border rounded-xl w-full ${errors.ageYears ? "border-red-500" : ""}`}
              min="0"
            />
            {errors.ageYears && <p className="text-red-500 text-sm">{errors.ageYears}</p>}
          </div>

          {/* Color */}
          <div>
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={form.color}
              onChange={handleChange}
              className={`p-3 border rounded-xl w-full ${errors.color ? "border-red-500" : ""}`}
            />
            {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleChange}
            className="p-3 border rounded-xl w-full"
          />

          {/* Price */}
          <div>
            <input
              type="number"
              name="price"
              placeholder="Adoption Fee"
              value={form.price}
              onChange={handleChange}
              className={`p-3 border rounded-xl w-full ${errors.price ? "border-red-500" : ""}`}
              required
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* Image Upload */}
          <label className="block text-gray-600">Upload Images</label>
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
                <img key={i} src={src} className="w-20 h-20 object-cover rounded-lg shadow" />
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "⏳ Uploading..." : "📤 Submit Pet"}
          </button>
        </form>
      </div>
    </div>
  );
}
