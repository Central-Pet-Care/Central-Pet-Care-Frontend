import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTimesCircle } from "react-icons/fa";
import uploadMediaToSupabase from "../../utils/mediaUpload";


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
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /*  Form State */
  const [form, setForm] = useState(null);

  
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Fetch product on mount */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Pre-fill form with product data
const p = data.product;

setForm({
  ...p,
  size: p.size?.join(", ") || "",
  features: p.features?.join(", ") || "",
  tags: p.tags?.join(", ") || "",
  ingredients: p.ingredients?.join(", ") || "",
  protein: p.nutrition?.protein || "",
  fat: p.nutrition?.fat || "",
  fiber: p.nutrition?.fiber || "",
  moisture: p.nutrition?.moisture || "",
  expiryDate: p.expiryDate ? p.expiryDate.split("T")[0] : "",
});

setPreviewImages(p.images || []);

      } catch (err) {
        toast.error("Failed to load product");
        navigate("/admin/products");
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  /*  Field-level validation */
  const validateField = useCallback((name, value) => {
    let msg = "";
    if (name === "name" && !value) msg = "Product name is required";
    if (name === "categoryId" && !value) msg = "Category is required";
    if (name === "description" && !value) msg = "Description is required";
    if (name === "price" && (!value || value <= 0)) msg = "Price must be greater than 0";
    if (name === "stock" && (value === "" || value < 0)) msg = "Stock must be 0 or higher";
    if (name === "lastPrice" && value && value <= 0) msg = "Last price must be greater than 0";
    if (name === "expiryDate" && value) {
      const today = new Date();
      const exp = new Date(value);
      if (exp <= today) msg = "Expiry date must be in the future";
    }
    if (name === "weight" && value && value <= 0) msg = "Weight must be greater than 0";

    setErrors((prev) => ({ ...prev, [name]: msg }));
  }, []);

  /*  Handle input changes */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    },
    [validateField]
  );

  /*  Handle image uploads */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviewImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (i) => {
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== i));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));
    toast.success("🗑 Image removed");
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.description || !form.price || form.stock === "")
      return toast.error("Please fill all required fields");
    if (Object.values(errors).some(Boolean)) return toast.error("Fix validation errors first");
    if (!form.images.length) return toast.error("Please upload at least one image");

    try {
      setLoading(true);

      // 🖼Upload new images (File objects only)
      const uploadedUrls = await Promise.all(
        form.images.map(async (file) => {
          if (typeof file === "string") return file; // already uploaded
          try {
            return await uploadMediaToSupabase(file);
          } catch {
            toast.error(`❌ Failed: ${file.name}`);
            return null;
          }
        })
      );

      const payload = {
        ...form,
        size: form.size ? form.size.split(",").map((s) => s.trim()) : [],
        features: form.features ? form.features.split(",").map((f) => f.trim()) : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        ingredients: form.ingredients ? form.ingredients.split(",").map((i) => i.trim()) : [],
        nutrition: {
          protein: form.protein,
          fat: form.fat,
          fiber: form.fiber,
          moisture: form.moisture,
        },
        images: uploadedUrls.filter(Boolean),
      };

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("✅ Product updated successfully!");
      navigate("/admin/products", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /*  Loading State */
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex justify-center py-10">
      <div className="w-full max-w-5xl bg-gradient-to-br from-purple-100 via-white to-indigo-200 rounded-2xl shadow-md p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Product Name *" />
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border p-3 rounded-xl">
                <option value="">Select Category *</option>
                <option value="CAT0001">Pet Foods</option>
                <option value="CAT0002">Pet Toys</option>
                <option value="CAT0003">Pet Medicine</option>
                <option value="CAT0004">Accessories</option>
              </select>
              {errors.categoryId && <span className="text-red-500 text-sm">{errors.categoryId}</span>}
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description *"
                className="border p-3 rounded-xl w-full md:col-span-2"
                rows="3"
              />
              {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="price" type="number" min="1" value={form.price} onChange={handleChange} error={errors.price} placeholder="Price (Rs.) *" />
              <Input name="lastPrice" type="number" min="1" value={form.lastPrice} onChange={handleChange} error={errors.lastPrice} placeholder="Last Price" />
              <Input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} error={errors.stock} placeholder="Stock *" />
              <select name="status" value={form.status} onChange={handleChange} className="border p-3 rounded-xl">
                <option>Available</option>
                <option>OutOfStock</option>
                <option>Inactive</option>
              </select>
            </div>
          </section>

          {/* Additional Details (Optional) */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Additional Details (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="brand" value={form.brand} onChange={handleChange} error={errors.brand} placeholder="Brand" />
              <Input name="origin" value={form.origin} onChange={handleChange} error={errors.origin} placeholder="Origin" />
              <div className="flex flex-col">
                <select
                  name="ageGroup"
                  value={form.ageGroup}
                  onChange={handleChange}
                  className={`border p-3 rounded-xl ${errors.ageGroup ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Age Group</option>
                  <option value="Puppy/Kitten">Puppy / Kitten</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                </select>
                {errors.ageGroup && <span className="text-red-500 text-sm mt-1">{errors.ageGroup}</span>}
              </div>
              <Input name="weight" type="number" min="1" value={form.weight} onChange={handleChange} error={errors.weight} placeholder="Weight (kg)" />
              <Input name="material" value={form.material} onChange={handleChange} error={errors.material} placeholder="Material" />
              <Input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} error={errors.expiryDate} />
            </div>
          </section>

          {/* Images */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            <label htmlFor="product-images" className="border p-3 rounded-xl w-full bg-gray-50 cursor-pointer block text-gray-700">
              {previewImages.length
                ? `${previewImages.length} file${previewImages.length > 1 ? "s" : ""} selected`
                : "Choose Files"}
            </label>
            <input
              ref={fileInputRef}
              id="product-images"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Updating Product..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
