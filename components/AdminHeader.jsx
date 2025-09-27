
export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg"
            alt="logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-lg font-bold text-purple-700">
            Central Pet Care
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Central Pet Care</p>
          </div>
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=6B21A8&color=fff"
            alt="Admin"
            className="h-10 w-10 rounded-full border border-purple-300"
          />
        </div>
      </div>
    </header>
  );
}
