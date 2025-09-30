import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageSlider from "../../components/productImageSlider";
import ProductNotFound from "./productNotFound";
import { addToCart } from "../../utils/cartFunction";
import Header from "../../components/navBar";
import RecommendedProducts from "../../components/RecommendProducts";
import ShippingInfo from "../../components/shoppingInfo";
import Footer from "../../components/footer";

export default function ProductOverview() {
  const params = useParams();
  const productId = params.productId;
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/" + productId)
      .then((res) => {
        if (res.data && res.data.product) {
          setProduct(res.data.product);
          setStatus("found");
        } else {
          setStatus("not-found");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("not-found");
      });
  }, [productId]);

  function handleAddToCart() {
    addToCart(product.productId, quantity);
    toast.success(`${product.name} (x${quantity}) added to cart`);
  }

  return (
    <>
      <Header />

      <div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 font-medium rounded-lg shadow-sm transition"
          >
            ← Back
          </button>

          {status === "loading" && (
            <div className="w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-violet-300 border-t-pink-500"></div>
            </div>
          )}

          {status === "not-found" && <ProductNotFound />}

          {status === "found" && product && (
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row p-6 gap-10">
              {/* 📷 Product Image */}
              <div className="w-full md:w-[380px] flex justify-center items-center">
                <ImageSlider
                  images={
                    product.images && product.images.length > 0
                      ? product.images
                      : []
                  }
                />
              </div>

              {/* 📌 Product Details */}
              <div className="flex flex-col gap-5 flex-1">
                <h2 className="text-3xl font-extrabold text-violet-700">
                  {product.name}
                </h2>

                {/* Price + Old Price */}
                <p className="text-2xl font-semibold">
                  <span className="text-green-600">LKR.{product.price}</span>
                  {product.lastPrice && (
                    <span className="text-gray-400 line-through ml-3 text-lg">
                      LKR.{product.lastPrice}
                    </span>
                  )}
                </p>

                {/* Stock Status */}
                <p className="text-sm text-gray-500">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of Stock"}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                    <button
                      onClick={() =>
                        setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                      className="px-3 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          prev < product.stock ? prev + 1 : prev
                        )
                      }
                      className="px-3 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                {/* Add to Cart & Buy Now Buttons */}
             {/* Add to Cart & Buy Now Buttons */}
<div className="flex gap-4 mt-4">
  {/* 🛒 Add to Cart */}
  <button
    onClick={() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token) {
        // redirect to login with redirect param
        navigate(`/login?redirect=/product/${product.productId}`);
      } else if (user?.type !== "customer") {
        toast.error("Only customers can purchase products!");
      } else {
        handleAddToCart();
      }
    }}
    disabled={product.stock <= 0}
    className="px-6 py-3 bg-violet-400 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50"
  >
    🛒 Add to Cart
  </button>

  {/* ⚡ Buy It Now */}
  <button
    onClick={() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token) {
        navigate(`/login?redirect=/product/${product.productId}`);
      } else if (user?.type !== "customer") {
        toast.error("Only customers can purchase products!");
      } else {
        if (product.stock > 0) {
          navigate("/checkout", {
            state: { productId: product.productId, quantity },
          });
        } else {
          toast.error("This product is out of stock.");
        }
      }
    }}
    disabled={product.stock <= 0}
    className="px-6 py-3 bg-pink-400 hover:bg-pink-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50"
  >
    ⚡ Buy It Now
  </button>
</div>


                {/* 📑 Tabs */}
                <div className="mt-8">
                  <div className="flex gap-4 border-b pb-2">
                    {["description", "nutrition", "features", "benefits"].map(
                      (tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`capitalize pb-2 ${
                            activeTab === tab
                              ? "text-violet-600 border-b-2 border-violet-600 font-semibold"
                              : "text-gray-500 hover:text-violet-500"
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-4 text-gray-700">
                    {activeTab === "description" && (
                      <p>{product.description || "No description provided."}</p>
                    )}

                    {activeTab === "nutrition" && (
                      <ul className="list-disc list-inside">
                        {product.nutrition ? (
                          <>
                            {product.nutrition.protein && (
                              <li>Protein: {product.nutrition.protein}</li>
                            )}
                            {product.nutrition.fat && (
                              <li>Fat: {product.nutrition.fat}</li>
                            )}
                            {product.nutrition.fiber && (
                              <li>Fiber: {product.nutrition.fiber}</li>
                            )}
                            {product.nutrition.moisture && (
                              <li>Moisture: {product.nutrition.moisture}</li>
                            )}
                          </>
                        ) : (
                          <li>No nutrition data available</li>
                        )}
                      </ul>
                    )}

                    {activeTab === "features" && (
                      <ul className="list-disc list-inside">
                        {product.features && product.features.length > 0 ? (
                          product.features.map((f, idx) => (
                            <li key={idx}>{f}</li>
                          ))
                        ) : (
                          <li>No features listed.</li>
                        )}
                      </ul>
                    )}

                    {activeTab === "benefits" && (
                      <ul className="list-disc list-inside">
                        {product.benefits && product.benefits.length > 0 ? (
                          product.benefits.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))
                        ) : (
                          <li>No benefits listed.</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <RecommendedProducts/>
      <ShippingInfo/>
      <Footer/>
    </>
  );
}
