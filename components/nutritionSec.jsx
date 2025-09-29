import { FaBone, FaUtensils, FaUserMd } from "react-icons/fa";

export default function NutritionSection() {
  const features = [
    {
      title: "Nutrition And Health",
      desc: "Proper nutrition is key to your pet’s health, supporting growth, energy, and overall well-being.",
      icon: <FaBone className="w-8 h-8 text-violet-600" />,
    },
    {
      title: "Custom Diets",
      desc: "Each pet has unique dietary needs. Tailoring their diet ensures they get essential nutrients.",
      icon: <FaUtensils className="w-8 h-8 text-violet-600" />,
    },
    {
      title: "Expert Guidance",
      desc: "Professional advice is crucial for managing your pet’s diet, ensuring they stay healthy and thrive.",
      icon: <FaUserMd className="w-8 h-8 text-violet-600" />,
    },
  ];

  return (
    <section className="relative py-20 bg-violet-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-violet-900 mb-4">
          Tailored Nutrition{" "}
          <span className="text-violet-900">For Your Pet’s Health</span>
        </h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-12 rounded-full"></div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-violet-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

     
     
    </section>
  );
}
