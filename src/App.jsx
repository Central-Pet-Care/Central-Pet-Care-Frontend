import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/homePage.jsx';
import LoginPage from '../pages/loginPage.jsx';
import PaymentPage from '../pages/PaymentPage.jsx';
import PayConfo from '../pages/PayConfo.jsx';
import ShippingData from '../pages/shipingData.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home and Auth Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Payment Flow Routes */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/PayConfo" element={<PayConfo />} />
          <Route path="/shipping" element={<ShippingData />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Catch all route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
