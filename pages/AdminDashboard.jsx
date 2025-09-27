import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminServicesPage from "./admin/AdminServicesPage";
import EditServicePage from "./admin/EditServicePage";
import AddServicePage from "./admin/AddServicePage";
import AdminBookingsPage from "./admin/AdminBookingsPage";
// import AdminAdoptionsPage from "./AdminAdoptionsPage";

export default function AdminDashboard() {

  const [servicesCount, setServicesCount] = useState(0);
  const [loadingServices, setLoadingServices] = useState(true);

  // ✅ Fetch services count
  useEffect(() => {
    const fetchServicesCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/service", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setServicesCount(res.data.length); // services array එකේ count
      } catch (err) {
        console.error("Error fetching services count", err);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesCount();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      {/* Top Header */}
      <AdminHeader />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-gray-500 mt-2">
                    Welcome to Central Pet Care Admin Panel 🚀
                  </p>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                      <h2 className="text-gray-500 text-sm">Total Pets</h2>
                      <p className="text-2xl font-bold text-purple-700">120</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                      <h2 className="text-gray-500 text-sm">Active Services</h2>
                      <p className="text-2xl font-bold text-purple-700">{loadingServices ? "Loading..." : servicesCount}</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                      <h2 className="text-gray-500 text-sm">Products in Stock</h2>
                      <p className="text-2xl font-bold text-purple-700">300</p>
                    </div>
                    <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                      <h2 className="text-gray-500 text-sm">Recent Payments</h2>
                      <p className="text-2xl font-bold text-green-600">$5,500</p>
                    </div>
                  </div>
                </>
              }
            />

            {/* 🔑 Added route for Adoptions */}
            {/* <Route path="adoptions" element={<AdminAdoptionsPage />} /> */}
             <Route path="services" element={<AdminServicesPage />} />
             <Route path="services/edit/:id" element={<EditServicePage />} />
             <Route path="services/add" element={<AddServicePage />} />
             <Route path="bookings" element={<AdminBookingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
