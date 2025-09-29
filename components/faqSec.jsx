import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FAQSection() {
  const faqs = [
    {
      question: "How can I adopt a pet?",
      answer:
        "Browse pets on our adoption page, fill out the adoption form, and our team will guide you step by step.",
    },
    {
      question: "Do you provide veterinary care?",
      answer:
        "Yes! Our certified vets provide checkups, vaccinations, and emergency care for adopted and registered pets.",
    },
    {
      question: "What services do you offer?",
      answer:
        "From grooming and training to boarding and pet sitting, we provide a wide range of professional pet services.",
    },
    {
      question: "Is product delivery available?",
      answer:
        "Yes, we deliver pet food, toys, and accessories to your doorstep with fast and reliable shipping.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base max-w-xl mx-auto">
            Quick answers about adoption, vet care, services, and delivery.
          </p>
          <div className="w-16 h-1 bg-pink-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-purple-100 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="text-gray-900 font-medium text-base">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-purple-700 transform transition ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
