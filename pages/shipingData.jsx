import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShippingDetailsPage = () => {
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    province: "",
    city: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save shipping info and cart data to localStorage
    const cartData = {
      items: [
        { name: "Premium Dog Food", quantity: 2, price: 120 },
        { name: "Pet Grooming Service", quantity: 1, price: 80 },
        { name: "Vaccination Package", quantity: 1, price: 100 },
      ],
      deliveryCost: 15,
      discount: 15,
      totalItems: 4,
    };

    const orderData = {
      shippingInfo,
      cartData,
    };

    localStorage.setItem("pendingOrder", JSON.stringify(orderData));

    // Redirect to Payment Page
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col">
      <div className="max-w-6xl mx-auto py-10 px-4 bg-white shadow rounded-xl">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">Shipping Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingInfo.fullName}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={shippingInfo.province}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingDetailsPage;