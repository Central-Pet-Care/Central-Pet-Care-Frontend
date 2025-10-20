import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BsBoxSeam,
  BsTruck,
  BsReceipt,
  BsCloudCheck,
  BsGear,
  BsCheckCircleFill,
  BsArrowLeft,
  BsClockHistory,
} from "react-icons/bs";
import Header from "../../components/navBar";
import Footer from "../../components/footer";

export default function OrderTrack() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchOrder() {
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Fixed: use /api/orders/:orderId endpoint
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data) {
          setError("Order not found.");
        } else {
          setOrder(res.data); // backend returns a single object
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err.response?.data?.message || "Failed to load order. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [token, orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-green-50">
        <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-medium">{error}</div>
    );
  }

  const steps = [
    { key: "Pending", label: "Order Placed", icon: <BsReceipt /> },
    { key: "Preparing", label: "Preparing", icon: <BsGear /> },
    { key: "Processing", label: "Processing", icon: <BsBoxSeam /> },
    { key: "Shipped", label: "Shipped", icon: <BsTruck /> },
    { key: "Delivered", label: "Delivered", icon: <BsCloudCheck /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "Cancelled";

  const statusColor = isCancelled
    ? "text-red-600"
    : order.status === "Delivered"
    ? "text-green-600"
    : "text-green-600";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-green-50 font-sans relative">
      <Header />

      <main className="flex-grow py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Back + Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition"
            >
              <BsArrowLeft /> Back
            </button>

            <div className="text-sm text-right">
              <p className="text-gray-500">ORDER CODE</p>
              <p className="font-semibold text-purple-700">{order.orderId}</p>
              <p className={`font-medium mt-1 ${statusColor}`}>
                {isCancelled ? "Order Cancelled" : `Status: ${order.status}`}
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-purple-100 transition-all hover:shadow-xl">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2 rounded-full"></div>

              {!isCancelled && (
                <div
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-600 to-green-400 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                ></div>
              )}

              {steps.map((step, i) => {
                const isCompleted = i <= currentStepIndex && !isCancelled;
                const isActive = i === currentStepIndex && !isCancelled;

                const stepColor = isCompleted
                  ? "bg-green-100 text-green-600 border-green-300"
                  : isActive
                  ? "bg-purple-100 text-purple-700 border-purple-300 scale-110"
                  : "bg-gray-100 text-gray-400 border-gray-300";

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center relative z-10"
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-xl mb-2 shadow-sm transition-all duration-300 ${stepColor}`}
                    >
                      {isCompleted ? <BsCheckCircleFill /> : step.icon}
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isCompleted || isActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-purple-50 hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-purple-700 mb-4">
                Delivery Information
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 space-y-1 mb-6 bg-purple-50/20">
                <p className="font-medium text-gray-800">{order.name}</p>
                <p className="text-gray-600">{order.phone}</p>
                <p className="text-gray-600">{order.address}</p>
              </div>

              <h3 className="text-lg font-semibold text-purple-700 mb-4">
                Ordered Items
              </h3>
              <div className="space-y-4">
                {(order.orderedItems || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 hover:bg-purple-50/40 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-purple-700">
                      Rs.{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border border-purple-50 hover:shadow-lg transition-all">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs.{order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Rs.500</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t pt-3">
                    <span>Total</span>
                    <span className="text-purple-700">
                      Rs.{(order.totalAmount + 500)?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                  Last updated:{" "}
                  {order.updatedAt
                    ? new Date(order.updatedAt).toLocaleString("en-US")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        <button
          onClick={() => navigate(`/orders/${user.email}`)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-green-500 text-white px-5 py-3 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          <BsClockHistory className="text-lg" /> View Order History
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white text-purple-700 border border-purple-300 px-5 py-3 rounded-full shadow-sm hover:bg-purple-50 hover:scale-105 transition-all"
        >
          <BsArrowLeft className="text-lg" /> Track Another Order
        </button>
      </div>

      <Footer />
    </div>
  );
}
