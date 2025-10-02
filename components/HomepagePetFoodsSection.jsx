import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";

export default function HomepagePetFoodsSection() {
  const [products, setProducts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    if (loadingStatus === "loading") {
      axios
        .get("http://localhost:5000/api/products?category=CAT0001")
        .then((res) => {
          // ✅ Show only 4 products
          setProducts((res.data.List || []).slice(0, 4));
          setLoadingStatus("loaded");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch pet foods.");
          setLoadingStatus("error");
        });
    }
  }, [loadingStatus]);

  return (
    <section className="w-full py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
       <div className="text-center mb-12">
  <h2 className="text-3xl md:text-4xl font-extrabold text-purple-800">
     Featured Pet Foods
  </h2>
  <p className="text-gray-600 mt-3 text-base md:text-lg">
    Nutritious & tasty meals your pets will love 🐾
  </p>
  <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 rounded-full"></div>
</div>

        {/* Products */}
        {loadingStatus === "loading" && (
          <p className="text-center text-purple-600 text-sm">
            Loading products...
          </p>
        )}
        {loadingStatus === "error" && (
          <p className="text-center text-red-500 text-sm">
            Failed to load products.
          </p>
        )}
        {loadingStatus === "loaded" && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/shop")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-300"
              >
                View All Products
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
