import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaPencilAlt, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    if (!productsLoaded) {
      const token = localStorage.getItem("token");

      axios
        .get("import.meta.env.VITE_BACKEND_URL/api/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          console.log("✅ Products Data:", res.data);
          setProducts(res.data.List || []);
          setProductsLoaded(true);
        })
        .catch((err) => {
          console.error("❌ Error fetching products:", err.response || err.message);
          toast.error("Failed to fetch products");
        });
    }
  }, [productsLoaded]);

  // 🔍 Filter by name + category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());

    const categoryMap = {
      all: true,
      foods: "CAT0001",
      toys: "CAT0002",
      medicine: "CAT0003",
      accessories: "CAT0004",
    };

    const matchesCategory =
      filterCategory === "all" ? true : p.categoryId === categoryMap[filterCategory];

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      {/* ➕ Floating Add Button */}
      <Link
        to={"/admin/products/addProduct"}
        className="absolute right-8 bottom-15 
             flex items-center justify-center 
             w-16 h-16 
             rounded-full 
             text-white text-2xl 
             shadow-lg shadow-indigo-400/50
             bg-gradient-to-r from-[#6b73ff] to-[#5a62e6]
             hover:from-[#5a62e6] hover:to-[#4a50d6]
             transition-all duration-300 transform hover:scale-110"
      >
        <FaPlus />
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🛒 Admin Products Management
      </h1>

      {/*  Search + Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/*  Search Bar */}
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 focus:ring focus:ring-indigo-300"
        />

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All" },
            { key: "foods", label: "Pet Foods" },
            { key: "toys", label: "Pet Toys" },
            { key: "medicine", label: "Pet Medicine" },
            { key: "accessories", label: "Pet Accessories" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
              ${
                filterCategory === cat.key
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-purple-700 border border-purple-300 hover:bg-purple-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {productsLoaded ? (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product._id || index}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.productId}
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={product.images?.[0] || "/placeholder-product.png"}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded border"
                      />
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.categoryId}
                    </td>

                    <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                      Rs.{product.price}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          product.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : product.status === "OutOfStock"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center flex justify-center gap-4">
                      {/*  Edit */}
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit"
                        onClick={() =>
                          navigate(`/admin/products/editProduct/${product.productId}`)
                        }
                      >
                        <FaPencilAlt />
                      </button>

                      {/*  Delete */}
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                        onClick={() => {
                          if (
                            !window.confirm(
                              "Are you sure you want to delete this product?"
                            )
                          )
                            return;

                          const token = localStorage.getItem("token");

                          axios
                            .delete(
                              `import.meta.env.VITE_BACKEND_URL/api/products/${product.productId}`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            )
                            .then(() => {
                              toast.success("Product deleted successfully");
                              setProductsLoaded(false);
                            })
                            .catch((err) => {
                              console.error(
                                "❌ Delete failed:",
                                err.response || err.message
                              );
                              toast.error("Failed to delete product");
                            });
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[60px] h-[60px] border-[4px] border-gray-200 border-b-[#3b82f6] animate-spin rounded-full"></div>
        </div>
      )}
    </div>
  );
}
