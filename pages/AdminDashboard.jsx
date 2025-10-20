import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import PaymentAdminDashboard from "./admin/PaymentAdminDashboard"; 
import PaymentView from "./admin/PaymentView";
import AdminServicesPage from "./admin/AdminServicesPage";
import EditServicePage from "./admin/EditServicePage";
import AddServicePage from "./admin/AddServicePage";
import AdminBookingsPage from "./admin/AdminBookingsPage";
import AdminPetsPage from "./admin/adminPetPage";
import AddPetPage from "./admin/addPetPage";
import HealthRecordsPage from "./admin/healthRecordsPage";
import UpdatePetPage from "./admin/editPetPage";
import AdminProductsPage from "./admin/adminProductPage";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProductForm";
import AdminAdoptionsPage from "./admin/AdminAdoptionsPage";
import AdminAdoptionViewPage from "./admin/AdminAdoptionViewPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminOrderView from "./admin/adminOrderView";
import { 
  FaBoxOpen, FaClipboardList, FaPaw, 
  FaDollarSign, FaBook, FaHome, FaShoppingCart 
} from "react-icons/fa";
import { Route, Routes } from "react-router-dom";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [petCount, setPetCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // Fetch product count
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductCount(res.data.List.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProductCount(0);
      }
    };
    fetchProducts();
  }, []);

  // Fetch pet count
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPetCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setPetCount(0);
      }
    };
    fetchPets();
  }, []);

  // Fetch order count
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderCount(res.data.orders?.length || 0);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrderCount(0);
      }
    };
    fetchOrders();
  }, []);

  // Modern reusable stat card
  const StatCard = ({ title, value, subtext, color, icon: Icon }) => (
    <div className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.01] transition-all duration-300 p-6">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}></div>
      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white text-xl shadow-md`}>
          <Icon />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 animate-fadeIn">
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-gray-500 mt-2">Welcome to Central Pet Care Admin Panel 🚀</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <StatCard 
                      title="Products in Stock" 
                      value={productCount} 
                      subtext="Available now" 
                      color="from-purple-500 to-purple-700" 
                      icon={FaBoxOpen} 
                    />
                    <StatCard 
                      title="Active Services" 
                      value="45" 
                      subtext="Running services" 
                      color="from-blue-500 to-blue-700" 
                      icon={FaClipboardList} 
                    />
                    <StatCard 
                      title="Total Pets" 
                      value={petCount} 
                      subtext="All categories" 
                      color="from-pink-500 to-pink-600" 
                      icon={FaPaw} 
                    />
                    <StatCard 
                      title="Recent Payments" 
                      value="$5,500" 
                      subtext="This month" 
                      color="from-green-500 to-green-700" 
                      icon={FaDollarSign} 
                    />
                    <StatCard 
                      title="Bookings" 
                      value="78" 
                      subtext="This week" 
                      color="from-indigo-500 to-indigo-700" 
                      icon={FaBook} 
                    />
                    <StatCard 
                      title="Adoptions" 
                      value="34" 
                      subtext="Successful adoptions" 
                      color="from-orange-500 to-orange-600" 
                      icon={FaHome} 
                    />
                    <StatCard 
                      title="Orders" 
                      value={orderCount} 
                      subtext="Completed orders" 
                      color="from-teal-500 to-teal-700" 
                      icon={FaShoppingCart} 
                    />
                  </div>
                </>
              }
            />

            <Route path="payments" element={<PaymentAdminDashboard />} />
            <Route path="payment-view" element={<PaymentView />} />
            <Route path="/pets" element={<AdminPetsPage />} />
            <Route path="/pets/addPet" element={<AddPetPage />} />
            <Route path="/pets/medicalRecords" element={<HealthRecordsPage />} />
            <Route path="/pets/editPet" element={<UpdatePetPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="/products/addProduct" element={<AddProductForm />} />
            <Route path="/products/editProduct/:productId" element={<EditProductForm />} />
            <Route path="adoptions" element={<AdminAdoptionsPage />} /> 
            <Route path="/adoptions/pet/:petId" element={<AdminAdoptionViewPage />} /> 
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="services/edit/:id" element={<EditServicePage />} />
            <Route path="services/add" element={<AddServicePage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="/orders" element={<AdminOrdersPage />} />
            <Route path="/order/:orderId" element={<AdminOrderView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
