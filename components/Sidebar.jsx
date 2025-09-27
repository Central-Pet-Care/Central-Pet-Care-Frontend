import { FaPaw, FaServicestack, FaBox, FaShoppingCart, FaCreditCard, FaHeart, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-purple-200 p-6 bg-white shadow-md">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Admin Panel</h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <Link
          to="/admin/pets"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaPaw className="text-purple-700" size={18} />
          Pets
        </Link>

        <Link
          to="/admin/services"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaServicestack className="text-purple-700" size={18} />
          Services
        </Link>

        <Link
          to="/admin/bookings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaCalendarCheck className="text-purple-700" size={18} />
          Bookings
        </Link>

        <Link
          to="/admin/adoptions"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaHeart className="text-purple-700" size={18} />
          Adoptions
        </Link>

        <Link
          to="/admin/products"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaBox className="text-purple-700" size={18} />
          Products
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaShoppingCart className="text-purple-700" size={18} />
          Orders
        </Link>

        <Link
          to="/admin/payments"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-200 transition text-sm font-medium"
        >
          <FaCreditCard className="text-purple-700" size={18} />
          Payments
        </Link>
      </nav>
    </aside>
  );
}
