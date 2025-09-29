export default function AdminHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg"
            alt="logo"
            className="h-10 w-10 rounded-full shadow-md ring-2 ring-purple-100 hover:scale-110 transition-transform duration-200"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
            Central Pet Care
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-200 placeholder-gray-400"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 transition-colors duration-200">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
              Admin
            </p>
            <p className="text-xs text-gray-500">Central Pet Care</p>
          </div>
          <div className="flex items-center gap-1">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=6B21A8&color=fff"
              alt="Admin"
              className="h-10 w-10 rounded-full border-2 border-purple-400 shadow-md hover:scale-110 transition-transform duration-200"
            />
            <i className="fas fa-chevron-down text-gray-500 text-xs group-hover:text-purple-600 transition-colors duration-200"></i>
          </div>
        </div>
      </div>
    </header>
  );
}
