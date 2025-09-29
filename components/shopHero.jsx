export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 shadow-md overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 py-20 relative z-10">

        {/* Left Content */}
        <div className="text-center md:text-left">
          <span className="inline-block bg-pink-100 text-pink-600 font-semibold text-xs px-3 py-1 rounded-full mb-4 shadow-sm">
            BIG DEAL FOR PET LOVERS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-violet-900 leading-tight mb-4">
            60% Off <br /> Make Pet Shopping Easy
          </h1>
          <p className="text-violet-700 mb-6 text-base md:text-lg">
            Shop premium food, toys, and accessories for your furry friends with special discounts.
          </p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105">
            Shop Now
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end relative">
          {/* Decorative blur circle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[26rem] h-[26rem] bg-violet-400/20 rounded-full blur-3xl"></div>
          
          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ProductsPage/shop-d01-removebg-preview.png"
            alt="Happy pets with food"
            className="relative w-full max-w-4xl md:max-w-5xl drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Decorative Paw Prints */}
      <div className="absolute top-8 left-8 text-violet-300 text-6xl opacity-60">🐾</div>
      <div className="absolute bottom-12 right-12 text-violet-400 text-5xl opacity-70">🐾</div>
    </section>
  );
}
