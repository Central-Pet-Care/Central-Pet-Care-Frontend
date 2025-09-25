import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { Routes, Route } from "react-router-dom";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminAdoptionsPage from "./AdminAdoptionsPage";

export default function AdminDashboard() {
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
                      <p className="text-2xl font-bold text-purple-700">45</p>
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
            <Route path="adoptions" element={<AdminAdoptionsPage />} />
            <Route path= "/orders" element={<AdminOrdersPage/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}
