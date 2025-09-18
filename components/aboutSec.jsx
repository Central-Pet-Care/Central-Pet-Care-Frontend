export default function AboutSection() {
  return (
    <section className="py-12 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Text content */}
          <div>
            <h2 className="text-3xl font-extrabold text-violet-700 mb-4">
              About Central Pet Care
            </h2>
            <p className="text-violet-600 text-lg mb-4">
              At Central Pet Care, we believe that every pet deserves love, care, and a safe home. 
              Our mission is to connect animals in need with compassionate families, provide trusted services, 
              and build a community where pets and people thrive together.
            </p>
            <p className="text-violet-600 text-lg">
              With a focus on compassion, quality care, and trust, we’re dedicated to supporting pet owners 
              and animal lovers in every step of their journey.
            </p>
          </div>

          {/* Image */}
          <div>
            <img
              src="https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/ad.jpg"
              alt="Happy pets and owners"
              className="rounded-2xl shadow-lg object-cover w-full h-64 md:h-80"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
