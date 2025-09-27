import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';

// Import your components
import HomePage from '../pages/homePage.jsx';
import LoginPage from '../pages/loginPage.jsx';
import PaymentPage from '../pages/PaymentPage.jsx';
import PayConfo from '../pages/PayConfo.jsx';
import ShippingData from '../pages/shipingData.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';

// Import other components
import NavBar from '../components/navBar.jsx';
import Footer from '../components/footer.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <NavBar /> {/* NavBar here - shows on all pages */}
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shipping" element={<ShippingData />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/PayConfo" element={<PayConfo />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1>Page Not Found</h1></div>} />
        </Routes>
        <Footer /> {/* Footer here - shows on all pages */}
      </div>
    </Router>
  );
}

export default App;
