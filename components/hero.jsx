export default function HeroSection() {
  return (
    <section className="bg-purple-100 py-20 px-6 lg:px-32 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden">
      
      {/* Text Content */}
      <div className="max-w-xl text-center lg:text-left z-10">
        <p className="text-gray-600 text-lg mb-4">
          Welcome to Central Pet Care — book all your pet care and sales
        </p>
        <h1 className="text-5xl font-extrabold text-purple-800 mb-6 leading-tight">
          CHOOSE THE BEST WAY FOR <br />
          <span className="text-green-600">YOUR PET</span> 🐾
        </h1>
        <button className="mt-6 bg-purple-800 hover:bg-purple-900 text-white py-3 px-6 rounded-xl text-base shadow-lg transition">
          Book a day to take care of your pet now
        </button>
      </div>

      {/* Pet Image Cards */}
      <div className="relative mt-16 lg:mt-0 z-10">
        
        {/* Main Dog Image Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 w-72">
          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/h-cat05.jpg"
            alt="Tiny the puppy"
            className="rounded-2xl w-full h-auto object-cover"
          />
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-purple-700">Tiny</h3>
            <p className="text-sm text-gray-500">⭐ 1k+ reviews</p>
          </div>
        </div>

        {/* Floating Cat Card */}
        <div className="absolute -bottom-10 -left-16 bg-white rounded-3xl shadow-xl p-3 w-52">
          <img
            src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/h-dog03.jpg"
            alt="Mark the cat"
            className="rounded-2xl w-full h-auto object-cover"
          />
          <div className="mt-3 text-center">
            <h3 className="text-md font-semibold text-purple-700">Mark</h3>
            <p className="text-sm text-gray-500">⭐ 1k+ reviews</p>
          </div>
        </div>

      </div>
    </section>
  );
}
