import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import uploadMediaToSupabase from "../../utils/mediaUpload";

const speciesList = ["Dog", "Cat", "Bird", "Fish", "Other"];
const sizeList = ["Unknown", "Small", "Medium", "Large", "Giant"];
const sexList = ["Unknown", "Male", "Female"];

export default function UpdatePetPage() {
  const navigate = useNavigate();
  const pet = useLocation().state?.pet;

  // Form state - holds all pet data
  const [form, setForm] = useState({
    name: "", species: "", breed: "", sex: "Unknown",
    ageYears: "", size: "Unknown", color: "",
    description: "", price: "", adoptionStatus: "AVAILABLE", images: []
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Local preview images for UI
  const [previewImages, setPreviewImages] = useState([]);

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Load pet data when navigating from list
  useEffect(() => {
    if (!pet) return navigate("/admin/pets"); // redirect if no pet selected
    setForm({ ...form, ...pet });
    setPreviewImages(pet.images || []);
  }, [pet]);

  // Validate individual fields as user types
  const validateField = (name, value) => {
    const letters = /^[A-Za-z\s]*$/;
    let msg = "";
    if (name === "name" && !value) msg = "Name required";
    if (["name", "breed", "color"].includes(name) && value && !letters.test(value))
      msg = "Only letters allowed";
    if (name === "ageYears" && (value < 0 || value > 20)) msg = "Age 0–20";
    if (name === "price" && value < 1) msg = "Price > 0";
    setErrors((p) => ({ ...p, [name]: msg }));
  };

  // Handle text/select input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  // Handle new image uploads
  const handleImageChange = async (e) => {
    const files = [...e.target.files];

    // Add selected files to preview
    setPreviewImages([...form.images, ...files.map((f) => URL.createObjectURL(f))]);

    // Upload images to Supabase (or any storage)
    const uploaded = await Promise.all(files.map(async (file) => {
      try {
        return await uploadMediaToSupabase(file);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    }));

    // Save only successfully uploaded images
    setForm((p) => ({ ...p, images: [...p.images, ...uploaded.filter(Boolean)] }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Quick validation
    if (!form.name || !form.species || !form.price)
      return toast.error("Name, Species, Price required");
    if (Object.values(errors).some((m) => m)) return;
    if (!form.images.length) return toast.error("Upload at least one image");

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/pets/${pet.petId}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("🐾 Pet updated!");
      navigate("../pets", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update pet");
    } finally {
      setLoading(false);
    }
  };

  // Reusable input component
  const Input = ({ name, type = "text", placeholder, min }) => (
    <div>
      <input
        type={type}
        name={name}
        value={form[name]}
        min={min}
        placeholder={placeholder}
        onChange={handleChange}
        className={`border p-3 rounded-xl w-full focus:ring-2 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[name] && <span className="text-red-500 text-sm">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex justify-center py-10">
      <div className="w-full max-w-4xl bg-gradient-to-br from-purple-100 via-white to-indigo-200 rounded-2xl shadow-md p-8">
        
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-600 mb-6">
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Update Pet</h1>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="name" placeholder="Pet Name *" />
            <select name="species" value={form.species} onChange={handleChange} className="border p-3 rounded-xl">
              <option value="">Select Species *</option>
              {speciesList.map((s) => <option key={s}>{s}</option>)}
            </select>
            <Input name="breed" placeholder="Breed" />
            <Input name="color" placeholder="Color" />
          </section>

          {/* Additional Info Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="sex" value={form.sex} onChange={handleChange} className="border p-3 rounded-xl">
              {sexList.map((s) => <option key={s}>{s}</option>)}
            </select>
            <Input name="ageYears" type="number" min="0" placeholder="Age (Years)" />
            <select name="size" value={form.size} onChange={handleChange} className="border p-3 rounded-xl">
              {sizeList.map((s) => <option key={s}>{s}</option>)}
            </select>
          </section>

          {/* Description */}
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Description" rows="3"
            className="border p-3 rounded-xl shadow-sm w-full" />

          {/* Price */}
          <Input name="price" type="number" min="1" placeholder="Price (Rs.) *" />

          {/* Image Upload Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <input type="file" accept="image/*" multiple onChange={handleImageChange}
              className="border p-3 rounded-xl w-full bg-gray-50" />
            
            {/* Image Preview */}
            <div className="flex flex-wrap gap-3 mt-4">
              {previewImages.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="w-24 h-24 object-cover rounded-xl border shadow-md" />
                  
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImages(previewImages.filter((_, idx) => idx !== i));
                      setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Updating..." : "💾 Update Pet"}
          </button>
        </form>
      </div>
    </div>
  );
}
