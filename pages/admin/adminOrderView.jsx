import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BsArrowLeft, BsCheckCircleFill, BsBoxSeam, BsTruck, BsCloudCheck, BsGear, BsTrash, BsArrowClockwise 
} from "react-icons/bs";
import toast from "react-hot-toast";

export default function AdminOrderView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      console.error("❌ Error fetching order:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to fetch order details.");
      toast.error(err.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order deleted successfully");
      navigate(-1);
    } catch (err) {
      console.error("❌ Delete error:", err.response || err.message);
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-green-50">
      <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !order) return (
    <div className="text-center py-20 text-red-600 font-medium">{error || "Order not found."}</div>
  );

  const steps = [
    { key: "Pending", label: "Order Placed", icon: <BsBoxSeam /> },
    { key: "Preparing", label: "Preparing", icon: <BsGear /> },
    { key: "Processing", label: "Processing", icon: <BsBoxSeam /> },
    { key: "Shipped", label: "Shipped", icon: <BsTruck /> },
    { key: "Delivered", label: "Delivered", icon: <BsCloudCheck /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-green-50 font-sans p-8">
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-700"
        >
          <BsArrowLeft /> Back to Orders
        </button>

        <div className="flex gap-3">
          <button
            onClick={fetchOrder}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <BsArrowClockwise /> Refresh
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <BsTrash /> Delete
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-purple-100 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-purple-700">Order Details</h2>
          <div className="text-right">
            <p className="font-medium text-gray-800">Order Code: <span className="font-bold">{order.orderId}</span></p>
            <p className={`font-semibold mt-1 ${isCancelled ? "text-red-600" : order.status === "Delivered" ? "text-green-600" : "text-purple-700"}`}>
              {isCancelled ? "Order Cancelled" : `Status: ${order.status}`}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="relative mb-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2 rounded-full"></div>
          {!isCancelled && (
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-600 to-green-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          )}
          <div className="flex justify-between relative z-10">
            {steps.map((step, i) => {
              const isCompleted = i <= currentStepIndex && !isCancelled;
              const isActive = i === currentStepIndex && !isCancelled;

              return (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl mb-2 shadow-sm transition-all duration-300 ${
                    isCancelled ? "bg-red-100 text-red-500 border border-red-300"
                    : isCompleted ? "bg-green-100 text-green-600 border border-green-300"
                    : isActive ? "bg-purple-100 text-purple-700 border border-purple-300 scale-110"
                    : "bg-gray-100 text-gray-400 border border-gray-300"
                  }`}>
                    {isCompleted ? <BsCheckCircleFill /> : step.icon}
                  </div>
                  <p className={`text-sm font-medium ${isCompleted || isActive ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Customer Name</p>
            <p className="text-gray-900 font-semibold text-lg">{order.user?.firstName || ""} {order.user?.lastName || ""}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Email</p>
            <p className="text-gray-900 font-medium">{order.user?.email || order.email || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Phone</p>
            <p className="text-gray-900 font-medium">{order.phone || "N/A"}</p>
          </div>
          <div className="space-y-1 md:w-1/3">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Address</p>
            <p className="text-gray-900 font-medium">{order.address || "N/A"}</p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">Ordered Items</h3>
          <div className="space-y-4">
            {order.orderedItems?.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 hover:bg-purple-50/30 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <img src={item.image || "/placeholder.png"} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-purple-700">Rs.{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Subtotal</span>
              <span>Rs.{order.totalAmount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-1">
              <span>Shipping</span>
              <span>Rs.500</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span className="text-purple-700">Rs.{((order.totalAmount || 0) + 500).toLocaleString()}</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Last Updated: {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
