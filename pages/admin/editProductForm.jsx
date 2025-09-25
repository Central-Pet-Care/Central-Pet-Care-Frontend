import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadMediaToSupabase from "../../utils/mediaUpload";

export default function EditProductForm() {
  const { productId } = useParams(); // /admin/products/edit/:id
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Load product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        // Convert arrays → comma separated text for editing
        setForm({
          ...data,
          size: data.size?.join(", ") || "",
          features: data.features?.join(", ") || "",
          tags: data.tags?.join(", ") || "",
          ingredients: data.ingredients?.join(", ") || "",
          protein: data.nutrition?.protein || "",
          fat: data.nutrition?.fat || "",
          fiber: data.nutrition?.fiber || "",
          moisture: data.nutrition?.moisture || "", 
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadMediaToSupabase(file))
      );

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

  const validateForm = () => {
    if (!form.name || form.name.length < 3) {
      toast.error("Product name must be at least 3 characters long.");
      return false;
    }
    if (!form.categoryId) {
      toast.error("Please select a category.");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Price must be greater than 0.");
      return false;
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      toast.error("Stock must be 0 or higher.");
      return false;
    }
    if (form.expiryDate) {
      const today = new Date();
      const exp = new Date(form.expiryDate);
      if (exp <= today) {
        toast.error("Expiry date must be in the future.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...form,
        size: form.size ? form.size.split(",").map((s) => s.trim()) : [],
        features: form.features ? form.features.split(",").map((f) => f.trim()) : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        ingredients: form.ingredients
          ? form.ingredients.split(",").map((i) => i.trim())
          : [],
        nutrition: {
          protein: form.protein,
          fat: form.fat,
          fiber: form.fiber,
          moisture: form.moisture,
        },
      };

      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:5000/api/products/${productId}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      toast.success("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update product.");
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-medium">Product ID</label>
                <input
                  value={form.productId}
                  disabled
                  className="w-full border rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="font-medium">Product Name *</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="font-medium">Category *</label>
                <select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-4 py-2"
                >
                  <option value="">Select a category</option>
                  <option value="CAT0001">Pet Foods</option>
                  <option value="CAT0002">Pet Toys</option>
                  <option value="CAT0003">Pet Medicine</option>
                  <option value="CAT0004">Accessories</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="font-medium">Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-md px-4 py-2"
                />
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
                  required
                  className="w-full border rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="font-medium">Last Price</label>
                <input
                  type="number"
                  id="lastPrice"
                  value={form.lastPrice}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="font-medium">Stock *</label>
                <input
                  type="number"
                  id="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-4 py-2"
                />
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

          {/* Product Images */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Product Images</h2>
            <input type="file" multiple onChange={handleImageUpload} className="mt-4" />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            <div className="flex gap-2 mt-4 flex-wrap">
             {(form.images || []).map((url, idx) => (
            <img key={idx} src={url} alt="preview" className="w-20 h-20 object-cover rounded" />
          ))}

            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
