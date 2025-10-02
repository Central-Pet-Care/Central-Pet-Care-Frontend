import { useState, useEffect } from "react";
import { loadCart } from "../../utils/cartFunction";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/navBar";
import Footer from "../../components/footer";

export default function ShippingScreen() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const navigate = useNavigate();

  const citiesByProvince = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    Uva: ["Badulla", "Monaragala"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"],
  };

  // Load cart
  useEffect(() => {
    setCart(loadCart());
  }, []);

  // Fetch product details
  useEffect(() => {
    async function fetchProducts() {
      if (cart.length === 0) return;
      try {
        const ids = cart.map((c) => c.productId);
        const res = await axios.post(
          "http://localhost:5000/api/products/cart-products",
          { ids }
        );
        setProducts(res.data.products || []);
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

  const subtotal = mergedCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );
  const shippingFee = subtotal > 0 ? 500 : 0;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleProvinceChange = (e) => {
    const value = e.target.value;
    setShipping((prev) => ({
      ...prev,
      province: value,
      city: "",
    }));
    setErrors({ ...errors, province: "" });
  };

  // ✅ Validation
  const validate = () => {
    let errs = {};
    const nameRegex = /^[A-Za-z]{2,}(?: [A-Za-z]+)*$/;

    if (!shipping.firstName.trim()) errs.firstName = "First name required";
    else if (!nameRegex.test(shipping.firstName))
      errs.firstName = "Invalid first name";

    if (!shipping.lastName.trim()) errs.lastName = "Last name required";
    else if (!nameRegex.test(shipping.lastName))
      errs.lastName = "Invalid last name";

    if (!shipping.address.trim()) errs.address = "Address required";
    if (!shipping.province) errs.province = "Province required";
    if (!shipping.city) errs.city = "City required";

    if (shipping.postalCode && !/^\d{5}$/.test(shipping.postalCode)) {
      errs.postalCode = "Postal code must be 5 digits";
    }

    if (!/^07\d{8}$/.test(shipping.phone)) {
      errs.phone = "Enter valid Sri Lankan phone (07XXXXXXXX)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Submit with JWT token
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const orderData = {
        orderedItems: mergedCart.map((item) => ({
          itemType: "product",
          itemId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.images?.[0] || "",
        })),
        name: `${shipping.firstName} ${shipping.lastName}`,
        address: `${shipping.address}, ${shipping.city}, ${shipping.province}, ${shipping.postalCode}`,
        phone: shipping.phone,
        totalAmount: total,
        status: "Pending",
      };

      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const { orderId, message } = res.data;
      setMessage(message || "Order created successfully ✅");

      // ✅ Save customer info to localStorage for PayConfo.jsx
      localStorage.setItem(
        "paymentSuccess",
        JSON.stringify({
          success: true,
          orderId,
          amount: total,
          paymentMethod: "pending", // updated after actual payment
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: "", // add if you collect in future
          phone: shipping.phone,
          message: "Order created. Proceed to payment.",
        })
      );

      // Clear form
      setShipping({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        phone: "",
      });

      // Go to payment
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Order failed ❌");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-violet-700 mb-6">Shipping</h2>

          {message && (
            <div className="mb-4 p-3 rounded bg-gray-100 text-gray-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={shipping.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={shipping.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm">Address</label>
              <input
                type="text"
                name="address"
                value={shipping.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            {/* Province + City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Province</label>
                <select
                  name="province"
                  value={shipping.province}
                  onChange={handleProvinceChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Province</option>
                  {Object.keys(citiesByProvince).map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm">{errors.province}</p>
                )}
              </div>
              <div>
                <label className="block text-sm">City</label>
                <select
                  name="city"
                  value={shipping.city}
                  onChange={handleChange}
                  disabled={!shipping.province}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                >
                  <option value="">Select City</option>
                  {shipping.province &&
                    citiesByProvince[shipping.province].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Postal Code + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shipping.postalCode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm">{errors.postalCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX"
                  className="w-full border rounded px-3 py-2"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-700 text-white py-3 rounded font-medium hover:bg-violet-800 transition"
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
                  className="w-16 h-16 rounded object-cover border"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold">
                  LKR {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>LKR {shippingFee.toLocaleString()}</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-violet-700">
              LKR {total.toLocaleString()}
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
