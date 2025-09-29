import { FaDog, FaCat, FaDove, FaFish } from "react-icons/fa";

export default function PetsCategories() {
  const petCategories = [
    {
      name: "Dogs",
      desc: "Friendly & loyal companions.",
      icon: <FaDog className="text-5xl text-purple-600 mb-3" />,
      targetId: "dogs",
      color: "from-purple-100 via-violet-50 to-pink-100",
    },
    {
      name: "Cats",
      desc: "Graceful and playful friends.",
      icon: <FaCat className="text-5xl text-pink-500 mb-3" />,
      targetId: "cats",
      color: "from-pink-100 via-purple-50 to-violet-200",
    },
    {
      name: "Birds",
      desc: "Beautiful feathered buddies.",
      icon: <FaDove className="text-5xl text-purple-700 mb-3" />,
      targetId: "birds",
      color: "from-violet-50 via-pink-100 to-purple-100",
    },
    {
      name: "Fishs",
      desc: "Colorful and calming pets.",
      icon: <FaFish className="text-5xl text-pink-600 mb-3" />,
      targetId: "fishs",
      color: "from-pink-100 via-violet-100 to-purple-200",
    },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="w-full py-14 bg-white">
      <h2 className="text-4xl font-extrabold text-violet-900 text-center mb-10">
        Browse by Pet Type
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
        {petCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleScroll(cat.targetId)}
            className={`flex flex-col items-center justify-center text-center rounded-3xl shadow-md bg-gradient-to-br ${cat.color} p-8 hover:shadow-xl hover:scale-105 transition`}
          >
            {cat.icon}
            <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
            <p className="text-sm text-gray-700 mt-2">{cat.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
