export default function StatsSection() {
  const stats = [
    { id: 1, value: "500+", label: "Pet Adoptions" },
    { id: 2, value: "2000+", label: "Happy Customers" },
    { id: 3, value: "50+", label: "Certified Vets" },
    { id: 4, value: "100%", label: "Trusted Care" },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900">
            Trusted by Thousands of Pet Lovers
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Our journey in numbers — reflecting the love, trust, and care we’ve
            built over the years.
          </p>
          <div className="mt-5 flex justify-center">
            <span className="inline-block w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-purple-50 rounded-xl py-8 px-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-3xl md:text-4xl font-extrabold text-purple-700">
                {stat.value}
              </h3>
              <p className="text-gray-700 mt-2 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
