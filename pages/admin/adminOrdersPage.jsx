import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { FaTrash, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!ordersLoaded) {
      const token = localStorage.getItem("token");

      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          console.log("✅ Orders Data:", res.data);
          setOrders(res.data.orders || res.data || []);
          setOrdersLoaded(true);
        })
        .catch((err) => {
          console.error("❌ Error fetching orders:", err.response || err.message);
          toast.error("Failed to fetch orders");
        });
    }
  }, [ordersLoaded]);

  //  Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "all"
        ? true
        : o.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  //  Update Order Status
  const updateStatus = (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(`Order ${orderId} updated to ${newStatus}`);
        setOrdersLoaded(false); // reload orders
      })
      .catch((err) => {
        console.error("❌ Update failed:", err.response || err.message);
        toast.error("Failed to update order");
      });
  };

  //  Delete Order
  const deleteOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    const token = localStorage.getItem("token");
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Order deleted successfully");
        setOrdersLoaded(false);
      })
      .catch((err) => {
        console.error("❌ Delete failed:", err.response || err.message);
        toast.error("Failed to delete order");
      });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📦 Admin Order Management
      </h1>

      {/* Search + Status Buttons */}
      <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by Order ID or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-72 focus:ring focus:ring-indigo-300"
        />

        <div className="flex flex-wrap gap-2">
          {["all", "preparing", "processing", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                  ${
                    selectedStatus === status
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white text-purple-700 border border-purple-300 hover:bg-purple-100"
                  }`}
              >
                {status === "all"
                  ? "All Status"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {ordersLoaded ? (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={order._id || index}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.email}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                      Rs.{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.orderId, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Preparing">Preparing</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-4">
                      {/* Refresh Status */}
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Refresh Status"
                        onClick={() => setOrdersLoaded(false)}
                      >
                        <FaSync />
                      </button>

                      {/* Delete */}
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                        onClick={() => deleteOrder(order.orderId)}
                      >
                        <FaTrash />
                      </button>

                      {/* View Order */}
                      <button
  className="text-purple-600 hover:text-purple-800 transition"
  title="View Order"
  onClick={() => navigate(`/admin/order/${order.orderId}`)}
>
  <BsEye />
</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[60px] h-[60px] border-[4px] border-gray-200 border-b-[#3b82f6] animate-spin rounded-full"></div>
        </div>
      )}
    </div>
  );
}
