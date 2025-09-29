import { FaBone, FaPuzzlePiece, FaCapsules, FaDog } from "react-icons/fa";

export default function CategoriesBanner() {
  const categories = [
    {
      name: "Pet Foods",
      desc: "Nutritious meals your pets love.",
      icon: <FaBone className="text-5xl text-purple-600 mb-3" />,
      link: "#pet-foods", // 👈 Section ID
      color: "from-purple-100 via-pink-100 to-pink-200",
    },
    {
      name: "Toys",
      desc: "Fun & playtime essentials.",
      icon: <FaPuzzlePiece className="text-5xl text-pink-500 mb-3" />,
      link: "#toys",
      color: "from-pink-100 via-purple-50 to-purple-200",
    },
    {
      name: "Medicines",
      desc: "Health & wellness support.",
      icon: <FaCapsules className="text-5xl text-purple-700 mb-3" />,
      link: "#medicines",
      color: "from-purple-50 via-pink-100 to-purple-100",
    },
    {
      name: "Accessories",
      desc: "Stylish gear for your pets.",
      icon: <FaDog className="text-5xl text-pink-600 mb-3" />,
      link: "#accessories",
      color: "from-pink-100 via-purple-100 to-purple-200",
    },
  ];

  return (
    <div className="w-full py-14 bg-white">
      <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.link}
            className={`flex flex-col items-center justify-center text-center rounded-3xl shadow-md bg-gradient-to-br ${cat.color} p-8 hover:shadow-xl hover:scale-105 transition`}
          >
            {cat.icon}
            <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
            <p className="text-sm text-gray-700 mt-2">{cat.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
