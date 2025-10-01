import { FaPaw, FaStethoscope, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CategoriesSection() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: "Pet Adoption",
      description: "Find your new best friend and give a pet a loving home.",
      icon: <FaPaw className="text-pink-500 text-4xl" />,
      path: "/adopt",
    },
    {
      id: 2,
      title: "Pet Services",
      description: "Vet care, grooming, and training from trusted experts.",
      icon: <FaStethoscope className="text-pink-500 text-4xl" />,
      path: "/services",
    },
    {
      id: 3,
      title: "Pet Shop",
      description: "Shop quality food, toys, and accessories for your pets.",
      icon: <FaShoppingBag className="text-pink-500 text-4xl" />,
      path: "/shop",
    },
  ];

  return (
    <section className="w-full py-16 bg-purple-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900">
          Explore Our Services
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base max-w-xl mx-auto">
          Everything you need to adopt, care for, and shop for your beloved pets.
        </p>
        <div className="w-16 h-1 bg-pink-500 mx-auto mt-4 mb-12 rounded-full"></div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(cat.path)}
              className="cursor-pointer bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">{cat.icon}</div>

              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
