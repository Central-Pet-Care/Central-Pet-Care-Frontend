import { FaShippingFast, FaTruck, FaMoneyBillWave, FaGlobe } from "react-icons/fa";

export default function ShippingInfo() {
  const shippingDetails = [
    {
      icon: <FaShippingFast className="text-3xl text-violet-600" />,
      title: "Fast Delivery",
      desc: "Delivered within 3-5 working days",
    },
    {
      icon: <FaTruck className="text-3xl text-pink-500" />,
      title: "Island-wide Delivery",
      desc: "Available anywhere in Sri Lanka",
    },
    {
      icon: <FaMoneyBillWave className="text-3xl text-green-500" />,
      title: "Free Shipping",
      desc: "On orders above LKR 5000",
    },
    {
      icon: <FaGlobe className="text-3xl text-blue-500" />,
      title: "Global Quality",
      desc: "Safe & reliable shipping standards",
    },
  ];

  return (
    <section className="mt-16 bg-gradient-to-r from-violet-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet-900 mb-10">
          Shipping & Delivery Info 🚚
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shippingDetails.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.03] transition-transform duration-300"
            >
              {item.icon}
              <h3 className="mt-4 font-semibold text-lg text-violet-700">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
