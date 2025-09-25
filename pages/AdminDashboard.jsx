import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { Routes, Route } from "react-router-dom";
import AdminPetsPage from "./admin/adminPetPage";
import AddPetPage from "./admin/addPetPage";
import HealthRecordsPage from "./admin/healthRecordsPage";
import UpdatePetPage from "./admin/editPetPage";
import { useEffect, useState } from "react";
import axios from "axios";

// import AdminAdoptionsPage from "./AdminAdoptionsPage";



export default function AdminDashboard() {
  const [petCount, setPetCount] = useState(0);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPetCount(res.data.length); // ✅ count pets
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setPetCount(0);
      }
    };

    fetchPets();
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
                      <p className="text-2xl font-bold text-purple-700">{petCount}</p>
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
            {/* <Route path="adoptions" element={<AdminAdoptionsPage />} /> */}
            <Route path="/pets" element={<AdminPetsPage />} />
            <Route path="/pets/addPet" element={<AddPetPage />} />
            <Route path="/pets/medicalRecords" element={<HealthRecordsPage />} />
            <Route path="/pets/editPet" element={<UpdatePetPage />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}
