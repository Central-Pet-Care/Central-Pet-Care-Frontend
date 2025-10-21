import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  BsCartCheck,
  BsBoxSeam,
  BsTruck,
  BsCloudCheck,
  BsXCircle,
  BsGear,
  BsArrowRight,
  BsArrowLeft,
} from "react-icons/bs";
import Header from "../../components/navBar";
import Footer from "../../components/footer";

export default function OrderHistory() {
  const { email } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !user.email) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }

        // ✅ Call the correct endpoint with token and email
        const res = await axios.get("import.meta.env.VITE_BACKEND_URL/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
          params: { email },
        });

        const userOrders = res.data.orders || [];

        if (userOrders.length === 0) {
          setError("No orders found for this user.");
        } else {
          setOrders(userOrders);
        }
      } catch (err) {
        console.error("Error fetching order history:", err);
        if (err.response?.status === 403) {
          setError("You are not authorized to view this user's orders.");
        } else if (err.response?.status === 404) {
          setError("No orders found for this user.");
        } else {
          setError("Failed to load orders. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [email]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <BsCartCheck className="text-gray-500" />;
      case "Preparing":
        return <BsGear className="text-yellow-600" />;
      case "Processing":
        return <BsBoxSeam className="text-green-600" />;
      case "Shipped":
        return <BsTruck className="text-purple-600" />;
      case "Delivered":
        return <BsCloudCheck className="text-green-600" />;
      case "Cancelled":
        return <BsXCircle className="text-red-500" />;
      default:
        return <BsCartCheck className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-green-50 font-sans">
      <Header />

      <main className="flex-grow py-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition font-medium"
            >
              <BsArrowLeft /> Back
            </button>
          </div>

          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            Order History
          </h2>

          {loading ? (
            <div className="flex justify-center py-32">
              <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-700 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-32 text-red-600 font-medium">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-32 text-gray-600">
              You haven’t placed any orders yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-purple-50 border-b border-purple-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Order ID</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Items</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Total</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-purple-50/30 transition-all duration-300"
                    >
                      <td className="py-3 px-4 font-medium text-purple-700">{order.orderId}</td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString("en-US")}</td>
                      <td className="py-3 px-4">{order.orderedItems?.length} item{order.orderedItems?.length > 1 ? "s" : ""}</td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-800">
                        Rs.{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span
                            className={`text-sm font-medium ${
                              order.status === "Cancelled"
                                ? "text-red-600"
                                : order.status === "Delivered"
                                ? "text-green-600"
                                : order.status === "Processing"
                                ? "text-green-600"
                                : "text-purple-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/trackOrder/${order.orderId}`)}
                          className="flex items-center justify-center gap-2 bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          Track <BsArrowRight />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
