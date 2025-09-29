import {
  FaTachometerAlt,
  FaPaw,
  FaServicestack,
  FaBox,
  FaShoppingCart,
  FaCreditCard,
  FaHeart,
  FaCalendarCheck,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { to: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/admin/pets", icon: <FaPaw />, label: "Pets" },
    { to: "/admin/services", icon: <FaServicestack />, label: "Services" },
    { to: "/admin/bookings", icon: <FaCalendarCheck />, label: "Bookings" },
    { to: "/admin/adoptions", icon: <FaHeart />, label: "Adoptions" },
    { to: "/admin/products", icon: <FaBox />, label: "Products" },
    { to: "/admin/orders", icon: <FaShoppingCart />, label: "Orders" },
    { to: "/admin/payments", icon: <FaCreditCard />, label: "Payments" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg rounded-r-2xl border-r border-gray-100 flex flex-col justify-between">
      <div className="p-5">
        {/* Modern Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 shadow-inner">
            <FaShieldAlt size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Manage & Control
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 font-semibold shadow-sm"
                    : "text-purple-600 hover:bg-purple-50 hover:text-purple-800"
                }`}
              >
                {/* Purple left bar for active */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1.5 bg-purple-600 rounded-r-lg"></span>
                )}

                {/* Icon circle */}
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-purple-200 text-purple-700"
                      : "bg-purple-50 text-purple-500"
                  }`}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`transition-all duration-200 ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-5 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 font-medium"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500">
            <FaSignOutAlt size={16} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
