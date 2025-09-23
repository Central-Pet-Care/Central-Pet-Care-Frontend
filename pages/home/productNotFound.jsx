export default function ProductNotFound() {
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-violet-50 px-4">
      <div className="text-center">
        {/* Icon / Illustration */}
        <div className="mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="Not Found"
            className="w-28 h-28 mx-auto opacity-80"
          />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold text-violet-600 mb-3">404</h1>
        <p className="text-xl text-violet-500 font-medium mb-6">
          Oops! Product not found 🐾
        </p>

        {/* Go Back Button */}
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-md transition-all duration-200"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
