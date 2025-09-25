import { useState, useEffect } from "react";

import { loadCart } from "../../utils/cartFunction";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/navBar";
import Footer from "../../components/footer";

export default function ShippingScreen() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
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
          "http://localhost:5000/api/products/cart-products",
          { ids }
        );
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching cart products", err);
      }
    }
    fetchProducts();
  }, [cart]);

  // merge cart with products
  const mergedCart = cart.map((c) => {
    const product = products.find((p) => p.productId === c.productId) || {};
    return { ...c, ...product };
  });

  const total = mergedCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );

  // handle form input change
  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.phone) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const orderData = {
        orderId: "ORD" + Date.now(),
        email: "guest@example.com", // if no auth
        orderedItems: mergedCart.map((item) => ({
          itemType: "product",
          itemId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.images?.[0] || "",
        })),
        totalAmount: total,
        shipping,
        status: "Preparing",
      };

      await axios.post("http://localhost:5000/api/orders", orderData);

      localStorage.removeItem("cart"); // clear cart
      navigate("/payment"); // next step
    } catch (err) {
      console.error("Error creating order", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      < Header/>

      <main className="flex-1 max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-violet-700 mb-6">Shipping</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={shipping.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                value={shipping.address}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">City</label>
                <input
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Province</label>
                <input
                  type="text"
                  name="province"
                  value={shipping.province}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-700 text-white py-3 rounded-lg font-medium hover:bg-violet-800 transition"
            >
              Save & Continue
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="text-xl font-semibold mb-4 text-violet-700">
            Order Summary
          </h3>
          <div className="space-y-4">
            {mergedCart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-gray-800">
                  LKR {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span className="text-violet-700">LKR {total.toLocaleString()}</span>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}
