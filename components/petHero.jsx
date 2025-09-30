export default function PetHero() {
  return (
    <section className="relative bg-gradient-to-r from-violet-100 via-violet-200 to-violet-100 shadow-md overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-12 py-24 relative z-10">

        {/* Left Content */}
        <div className="text-center md:text-left space-y-6">
          <span className="inline-block bg-purple-100 text-purple-700 font-semibold text-xs px-4 py-1 rounded-full shadow-sm">
            🐾 Give a Pet a Home
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-violet-900 leading-tight">
            Adopt, Don’t Shop <br />
            <span className="text-pink-400">Find Your New Best Friend</span>
          </h1>
          <p className="text-violet-700 text-base md:text-lg max-w-lg">
            Thousands of loving pets are waiting for a family. Give them a 
            <span className="font-semibold"> second chance</span> and bring joy into your life.  
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {/* Primary Button */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105">
              🐶 Adopt Now
            </button>
            {/* Secondary Button */}
            <button className="border border-purple-400 text-purple-700 hover:bg-purple-100 font-semibold py-3 px-6 rounded-full shadow-md transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end relative">
          {/* Decorative Glow */}
          <div className="absolute w-[28rem] h-[28rem] bg-purple-300/20 blur-3xl rounded-full right-0 top-1/2 -translate-y-1/2"></div>

          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/petHero-removebg-preview.png"
            alt="Adopt a pet"
            className="relative w-full max-w-md md:max-w-3xl drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Decorative Paw Prints */}
      <div className="absolute top-10 left-10 text-purple-300 text-5xl opacity-50">🐾</div>
      <div className="absolute bottom-16 right-16 text-purple-400 text-6xl opacity-60">🐾</div>
    </section>
  )
}
