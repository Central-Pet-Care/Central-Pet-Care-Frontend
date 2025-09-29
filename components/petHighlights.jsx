import { FaHome, FaPaw, FaHandsHelping } from "react-icons/fa";

export default function AdoptionHighlights() {
  return (
    <section className="bg-gradient-to-b from-violet-50 via-pink-50 to-violet-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-violet-900">
            Why Adopt a Pet?
          </h2>
          <p className="mt-3 text-violet-700 max-w-2xl mx-auto text-base md:text-lg">
            Adoption not only changes the life of a pet, but it also brings joy,
            love, and companionship to your home. Here’s why you should adopt today.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white hover:bg-violet-50 rounded-3xl shadow-md hover:shadow-xl transition p-8 text-center">
            <div className="flex justify-center mb-4 text-5xl text-purple-600">
              <FaHome />
            </div>
            <h3 className="text-xl font-bold text-violet-900 mb-2">
              A Safe Home
            </h3>
            <p className="text-violet-700 text-sm">
              Give abandoned pets a second chance with a warm and safe home.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white hover:bg-violet-50 rounded-3xl shadow-md hover:shadow-xl transition p-8 text-center">
            <div className="flex justify-center mb-4 text-5xl text-pink-500">
              <FaPaw />
            </div>
            <h3 className="text-xl font-bold text-violet-900 mb-2">
              Save a Life
            </h3>
            <p className="text-violet-700 text-sm">
              Every adoption saves a life and gives pets hope for a brighter future.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white hover:bg-violet-50 rounded-3xl shadow-md hover:shadow-xl transition p-8 text-center">
            <div className="flex justify-center mb-4 text-5xl text-purple-700">
              <FaHandsHelping />
            </div>
            <h3 className="text-xl font-bold text-violet-900 mb-2">
              Lifelong Bond
            </h3>
            <p className="text-violet-700 text-sm">
              Create a lifelong friendship filled with unconditional love.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
