import { useEffect, useState } from "react";
import { loadCart, removeFromCart, updateCartQty } from "../../utils/cartFunction";
import Header from "../../components/navBar";
import Footer from "../../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (cart.length === 0) return;
      try {
        const ids = cart.map((c) => c.productId);
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/products/cart-products",
          { ids }
        );
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching cart products", err);
      }
    }
    fetchProducts();
  }, [cart]);

  const mergedCart = cart.map((c) => {
    const product = products.find((p) => p.productId === c.productId) || {};
    return { ...c, ...product };
  });

  const total = mergedCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );

  const handleRemove = (productId) => {
    const updated = removeFromCart(productId);
    setCart(updated);
  };

  const handleQtyChange = (productId, action) => {
    const updated = updateCartQty(productId, action);
    setCart(updated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        {/* Cart Table */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-violet-700">
              Shopping Cart
            </h2>
            <span className="text-gray-500 font-medium">
              {mergedCart.length} Items
            </span>
          </div>

          {mergedCart.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-3">Product Details</th>
                  <th className="pb-3 text-center">Quantity</th>
                  <th className="pb-3 text-center">Price</th>
                  <th className="pb-3 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {mergedCart.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-violet-50/50 transition"
                  >
                    {/* Product */}
                    <td className="py-4 flex items-center gap-4">
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.categoryId}
                        </p>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </td>

                    {/* Qty */}
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleQtyChange(item.productId, "decrease")}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span>{item.qty || 0}</span>
                        <button
                          onClick={() => handleQtyChange(item.productId, "increase")}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 text-center text-gray-700">
                      LKR {(item.price || 0).toLocaleString()}
                    </td>

                    {/* Total */}
                    <td className="py-4 text-center font-semibold text-violet-700">
                      LKR {((item.price || 0) * (item.qty || 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 py-6 text-center">
              Your cart is empty.
            </p>
          )}

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 text-violet-600 font-medium hover:underline flex items-center gap-2"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="text-xl font-semibold mb-4 text-violet-700">
            Order Summary
          </h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{mergedCart.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>LKR 0</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mt-4">
            <label className="text-sm text-gray-500">Promo Code</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Enter your code"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                Apply
              </button>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total Cost</span>
            <span className="text-violet-700">LKR {total.toLocaleString()}</span>
          </div>

          <button
           onClick={() => navigate("/shipping")}
           className="mt-6 w-full bg-violet-700 text-white py-3 rounded-lg font-medium hover:bg-violet-800 transition">
            Proceed to Checkout
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
