import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import axios from "axios";
import {
  BsBoxSeam,
  BsReceipt,
  BsTruck,
  BsPerson,
  BsGeoAlt,
  BsCart4, // ✅ icon for shopping
} from "react-icons/bs";
import generateOrderForm from "../../utils/generateOrderSummary";

export default function OrderSummary() {
  const { orderId } = useParams();
  const navigate = useNavigate(); // ✅ hook for navigation
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching order:", err.response || err.message);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="w-[60px] h-[60px] border-[4px] border-gray-200 border-b-purple-600 animate-spin rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <p className="text-center text-red-500 bg-gray-50 py-10">
        Order not found ❌
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* ✅ Title + Order ID */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BsBoxSeam className="w-8 h-8 text-purple-600" /> Your Order
          </h1>
          <p className="text-gray-600 mt-2">Order ID: {order.orderId}</p>
          <p className="text-gray-600 mt-1">
            Thank you. Your order has been{" "}
            <span className="font-semibold text-green-600">{order.status}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🛒 Ordered Items */}
          <div className="lg:col-span-2 space-y-8">
            {order.orderedItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6 border border-gray-100"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">{item.itemType}</p>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">
                    Rs.{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            {/* 🧾 Order Summary */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md border-l-4 border-purple-600">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BsReceipt className="w-5 h-5 text-purple-600" /> Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rs.{order.shippingFee || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>Rs.{order.tax || 0}</span>
                </div>
                <div className="border-t my-3"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-purple-600">
                    Rs.{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* 📥 Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {/* Download Summary */}
                <button
                  onClick={() => {
                    if (!order) {
                      alert("No order data found!");
                      return;
                    }
                    generateOrderForm(order);
                  }}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-purple-700 transition"
                >
                  <BsReceipt className="w-5 h-5" />
                  Download Summary
                </button>

                {/* Track Order */}
                <button
                  onClick={() => navigate("/trackOrder")}
                  className="w-full bg-transparent border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition"
                >
                  <BsTruck className="w-5 h-5" /> Track this Order
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-green-700 transition"
                >
                  <BsCart4 className="w-5 h-5" /> Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* 👤 Customer + Shipping */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BsPerson className="w-5 h-5 text-purple-600" /> Customer
              </h3>
              <p className="text-gray-700">{order.name}</p>
              <p className="text-gray-500">{order.email}</p>
              <p className="text-gray-500">{order.phone}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BsGeoAlt className="w-5 h-5 text-purple-600" /> Shipping Address
              </h3>
              <p className="text-gray-700">{order.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
