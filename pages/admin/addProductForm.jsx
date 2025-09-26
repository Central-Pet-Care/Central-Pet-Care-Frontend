import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadMediaToSupabase from "../../utils/mediaUpload";

export default function AddProductForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    brand: "",
    origin: "",
    price: "",
    lastPrice: "",
    stock: "",
    status: "Available",
    weight: "",
    material: "",
    ageGroup: "",
    expiryDate: "",
    size: "",
    features: "",
    tags: "",
    ingredients: "",
    protein: "",
    fat: "",
    fiber: "",
    moisture: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // ✅ Centralized validation
  const validate = (form) => {
    let errs = {};
    const nameRegex = /^[A-Za-z0-9\s]{3,}$/; // product name >=3 chars

    // Product Info
    if (!form.name.trim()) errs.name = "Product name is required";
    else if (!nameRegex.test(form.name)) errs.name = "Invalid product name";

    if (!form.categoryId) errs.categoryId = "Category is required";
    if (!form.description.trim()) errs.description = "Description is required";

    // Pricing & Stock
    if (!form.price || Number(form.price) <= 0) {
      errs.price = "Price must be greater than 0";
    }
    if (!form.lastPrice && Number(form.lastPrice) <= 0) {
      errs.lastPrice = "Last price must be greater than 0";
    }
    if (!form.stock === "" || Number(form.stock) < 0) {
      errs.stock = "Stock must be 0 or higher";
    }

    // Additional details are optional, only validate if entered
    if (!form.expiryDate) {
      const today = new Date();
      const exp = new Date(form.expiryDate);
      if (exp <= today) errs.expiryDate = "Expiry date must be in the future";
    }
    if (!form.weight && Number(form.weight) <= 0) {
      errs.weight = "Weight must be greater than 0";
    }

    return errs;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...form, [id]: value };
    setForm(updatedForm);

    const errs = validate(updatedForm);
    setErrors(errs);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const promisesArray = Array.from(files).map((file) =>
        uploadMediaToSupabase(file)
      );

      const uploadedUrls = await Promise.all(promisesArray);

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading images");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
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
      };

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/products", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success("✅ Product added successfully!");
      navigate("/admin/products");

      setForm({
        name: "",
        categoryId: "",
        description: "",
        brand: "",
        origin: "",
        price: "",
        lastPrice: "",
        stock: "",
        status: "Available",
        weight: "",
        material: "",
        ageGroup: "",
        expiryDate: "",
        size: "",
        features: "",
        tags: "",
        ingredients: "",
        protein: "",
        fat: "",
        fiber: "",
        moisture: "",
        images: [],
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-medium">Product Name *</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="e.g. Dog Food"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div>
                <label className="font-medium">Category *</label>
                <select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                >
                  <option value="">Select a category</option>
                  <option value="CAT0001">Pet Foods</option>
                  <option value="CAT0002">Pet Toys</option>
                  <option value="CAT0003">Pet Medicine</option>
                  <option value="CAT0004">Accessories</option>
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="font-medium">Description *</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="A short product description"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-medium">Price *</label>
                <input
                  type="number"
                  id="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="12.99"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>
              <div>
                <label className="font-medium">Last Price</label>
                <input
                  type="number"
                  id="lastPrice"
                  value={form.lastPrice}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="14.99"
                />
                {errors.lastPrice && <p className="text-red-500 text-sm">{errors.lastPrice}</p>}
              </div>
              <div>
                <label className="font-medium">Stock *</label>
                <input
                  type="number"
                  id="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="100"
                />
                {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
              </div>
              <div>
                <label className="font-medium">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                >
                  <option>Available</option>
                  <option>OutOfStock</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details (Optional) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Additional Details (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-medium">Brand</label>
                <input
                  id="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="Brand Name"
                />
              </div>
              <div>
                <label className="font-medium">Origin</label>
                <input
                  id="origin"
                  value={form.origin}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="e.g. USA"
                />
              </div>
              <div>
                <label className="font-medium">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="font-medium">Age Group</label>
                <input
                  id="ageGroup"
                  value={form.ageGroup}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  placeholder="e.g. Adult Dogs"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Product Images</h2>
            <input type="file" multiple onChange={handleImageUpload} className="mt-4" />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            <div className="flex gap-2 mt-4 flex-wrap">
              {form.images.map((url, idx) => (
                <img key={idx} src={url} alt="preview" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="reset"
              onClick={() => {
                setForm({
                  name: "",
                  categoryId: "",
                  description: "",
                  brand: "",
                  origin: "",
                  price: "",
                  lastPrice: "",
                  stock: "",
                  status: "Available",
                  weight: "",
                  material: "",
                  ageGroup: "",
                  expiryDate: "",
                  size: "",
                  features: "",
                  tags: "",
                  ingredients: "",
                  protein: "",
                  fat: "",
                  fiber: "",
                  moisture: "",
                  images: [],
                });
                setErrors({});
              }}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
