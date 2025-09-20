import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-violet-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg"
              alt="logo"
              className="cursor-pointer h-12 w-12 rounded-full mr-2"
            />
            <span className="text-xl font-bold text-violet-500">
              Central Pet Care
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow mx-4">
            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder="Search pets, products, services..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-violet-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-violet-400">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-violet-500 hover:text-pink-400 font-medium">
              Home
            </Link>
            <Link to="/pets" className="text-violet-500 hover:text-pink-400 font-medium">
              Pets
            </Link>
            <Link to="/services" className="text-violet-500 hover:text-pink-400 font-medium">
              Services
            </Link>
            <Link to="/shop" className="text-violet-500 hover:text-pink-400 font-medium">
              Shop
            </Link>

            {/* Icons */}
            <a href="#">
              <i className="fas fa-shopping-cart text-violet-500 hover:text-pink-400"></i>
            </a>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                <FaUser /> Login
              </Link>
              <Link
                to="/register"
                className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                Register
              </Link>
            </div>
            
          </nav>
        </div>
      </div>
    </header>
  );
}
