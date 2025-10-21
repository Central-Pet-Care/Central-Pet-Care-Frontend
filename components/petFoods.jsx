import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ProductCard from "../components/productCard"

export default function PetFoods() {
  const [products, setProducts] = useState([]) // category-only
  const [allProducts, setAllProducts] = useState([]) // all categories
  const [loadingStatus, setLoadingStatus] = useState("loading") // loaded, loading, error
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load only pet foods for default view
    axios
      .get("import.meta.env.VITE_BACKEND_URL/api/products?category=CAT0001")
      .then((res) => {
        setProducts(res.data.List)
        setLoadingStatus("loaded")
      })
      .catch((err) => {
        console.error(err)
        toast.error("Failed to fetch pet foods.")
        setLoadingStatus("error")
      })

    // Load ALL products for searching
    axios
      .get("import.meta.env.VITE_BACKEND_URL/api/products")
      .then((res) => setAllProducts(res.data.List))
      .catch((err) =>
        console.error("Failed to fetch all products for search", err)
      )
  }, [])

  // 🔎 Logic:
  // if searchQuery is empty → show only pet foods
  // if searchQuery has text → search across all products
  const displayedProducts =
    searchQuery.trim() === ""
      ? products
      : allProducts.filter((product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      {/* 🐶 Promo Banner */}
      <div className="relative w-full bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between px-10 py-8 mb-12">
        <div className="max-w-lg text-center md:text-left">
          <h3 className="text-sm font-semibold text-purple-800 tracking-wide uppercase mb-2">
            Limited Time Offer
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Save <span className="text-purple-700">20% OFF</span> on
            <br /> Premium Pet Food
          </h2>
          <p className="text-gray-700 text-base mt-3">
            Healthy, delicious & vet-approved meals for your pets.
            <br /> Shop now and get a{" "}
            <span className="font-semibold">free pet checkup</span>.
          </p>
          <button className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl shadow-md transition duration-300">
            🛒 Shop Now
          </button>
        </div>

        <div className="relative mt-8 md:mt-0 flex-1 flex items-center justify-center">
          <div className="w-72 h-72 rounded-full opacity-20 absolute blur-2xl"></div>
          <div className="w-[750px] h-54 bg-white rounded-2xl shadow-lg border border-purple-200 flex items-center justify-center overflow-hidden">
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/petfood03%20(1).jpeg"
              alt="Pet Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 🐾 Section header + Search in one row */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-purple-900 flex items-center gap-3">
            Pet Foods
          </h2>
          <div className="w-30 h-1 bg-pink-500 rounded-full mt-2"></div>
        </div>

        {/* 🔎 Search Bar */}
        <div className="relative w-full md:w-80 mt-4 md:mt-0">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search across all products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full shadow-md border border-gray-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                       placeholder-gray-400 text-gray-700"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loadingStatus === "loading" && (
        <p className="text-center text-purple-600">Loading products...</p>
      )}
      {loadingStatus === "error" && (
        <p className="text-center text-red-500">Failed to load products.</p>
      )}
      {loadingStatus === "loaded" && (
        <>
          {displayedProducts.length === 0 ? (
            <p className="text-center text-gray-600">
              No products match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
