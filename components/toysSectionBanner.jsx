import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ProductCard from "../components/productCard"

export default function Toys() {
  const [products, setProducts] = useState([])
  const [loadingStatus, setLoadingStatus] = useState("loading") // loaded, loading, error

  useEffect(() => {
    if (loadingStatus === "loading") {
      axios.get("http://localhost:5000/api/products?category=CAT0002")
        .then((res) => {
          setProducts(res.data.List)
          setLoadingStatus("loaded")
        })
        .catch((err) => {
          console.error(err)
          toast.error("Failed to fetch products.")
          setLoadingStatus("error")
        })
    }
  }, [loadingStatus])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      
      {/* 🎉 Toys Section Banner */}
      <div className="relative w-full bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between px-10 py-12 mb-12">
        
        {/* Left - Text */}
        <div className="max-w-lg text-center md:text-left">
          <h3 className="text-sm font-semibold text-purple-800 tracking-wide uppercase mb-2">
            New Arrivals
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Fun & Durable <span className="text-purple-700">Pet Toys</span>
          </h2>
          <p className="text-gray-700 text-base mt-3">
            Discover playful, safe, and vet-approved toys designed 
            to keep your pets happy and active every day.
          </p>
          <button className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl shadow-md transition duration-300">
            🎁 Explore Toys
          </button>
        </div>

        {/* Right - Image */}
        <div className="relative mt-8 md:mt-0 flex-1 flex items-center justify-center">
          <div className="w-[750px] h-54 bg-white rounded-2xl shadow-lg border border-purple-200 flex items-center justify-center overflow-hidden">
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/t-banner02.webp"
              alt="Pet Toys Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 🐾 Section header */}
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-extrabold text-purple-900 flex items-center gap-3">
          Pet Toys
        </h2>
        <div className="w-30 h-1 bg-pink-500 rounded-full mt-2"></div>
      </div>

      {/* Product Grid */}
      {loadingStatus === "loading" && (
        <p className="text-center text-purple-600">Loading products...</p>
      )}
      {loadingStatus === "error" && (
        <p className="text-center text-red-500">Failed to load products.</p>
      )}
      {loadingStatus === "loaded" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
