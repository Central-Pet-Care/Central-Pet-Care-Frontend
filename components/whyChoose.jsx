import { FaUserMd, FaAmbulance, FaUsers, FaLeaf } from "react-icons/fa";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <FaUserMd className="text-pink-500 text-3xl" />,
      title: "Certified Staff & Vets",
      description: "Our team is fully qualified to provide expert care.",
    },
    {
      icon: <FaAmbulance className="text-pink-500 text-3xl" />,
      title: "24/7 Emergency",
      description: "Always here when you need us most.",
    },
    {
      icon: <FaUsers className="text-pink-500 text-3xl" />,
      title: "Community Trusted",
      description: "Loved by local families and their pets.",
    },
    {
      icon: <FaLeaf className="text-pink-500 text-3xl" />,
      title: "Eco-friendly Products",
      description: "Safe for pets, kind to the planet.",
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-700">
            Why Choose Us
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Trusted by the community for quality, care, and compassion.
          </p>
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-purple-50 p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
