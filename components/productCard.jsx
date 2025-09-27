import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-transform hover:scale-[1.02] duration-300">
      
      {/* 🖼️ Product Image */}
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      {/* 📦 Product Details */}
      <div className="p-4 text-center">
        {/* Name */}
        <h4 className="font-semibold text-violet-700 truncate">{product.name}</h4>

        {/* Subtitle */}
        {product.subtitle && (
          <p className="text-sm text-violet-600 mb-1">{product.subtitle}</p>
        )}

        {/* Price */}
        <span className="font-bold text-pink-500 text-lg block">
          Rs. {product.price.toLocaleString()}
        </span>

        {/* Buttons Row */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {/* View Details Button */}
          <button
            onClick={() => navigate(`/product/${product.productId}`)}
            className="flex-1 py-2 text-violet-700 border border-violet-200 hover:border-violet-400 hover:bg-violet-50 rounded-lg font-medium transition"
          >
            View Details
          </button>

          {/* Add to Cart Button */}
          <button className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-md transition">
            <FaShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
