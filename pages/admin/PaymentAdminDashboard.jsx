import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import generatePaymentPDF from '../../utils/PaymentPDF';

const PaymentAdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Add search state
  const navigate = useNavigate();

  // Fetch payments from backend
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform your actual MongoDB data structure
      const transformedPayments = data.map(payment => ({
        id: payment._id,
        orderId: payment.orderId,
        name: payment.customerInfo?.name || 'Unknown Customer',
        email: payment.email || payment.customerInfo?.email || '',
        phone: payment.customerInfo?.phone || '',
        itemsNo: payment.items?.length || 0,
        amount: payment.amount, // Keep the original LKR amount as stored
        currency: payment.currency || 'LKR',
        payType: payment.method === 'payhere_direct' ? 'PayHere Direct' : 
                 payment.method === 'credit_card' ? 'Credit Card' : 
                 payment.paymentDetails?.paymentMethod || payment.method || 'N/A',
        status: payment.status || 'pending',
        cardLast4: payment.paymentDetails?.cardLast4 || '',
        transactionId: payment.transactionId || '',
        createdAt: payment.createdAt,
        paymentDate: payment.paymentDate,
        city: payment.customerInfo?.city || '',
        items: payment.items || []
      }));

      setPayments(transformedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments from server');
      
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const completedAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingApproval = payments.filter(p => p.status === 'pending').length;
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  // Filter payments based on search query
  const filteredPayments = payments.filter(payment => 
    payment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.payType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update status in backend
      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      // Update local state
      setPayments(payments.map(payment => 
        payment.id === id ? { ...payment, status: newStatus } : payment
      ));
      
      setEditingId(null);
      
      // Optional: Show success message
      alert('Payment status updated successfully!');
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
      
      // Fallback: Update locally even if backend fails
      setPayments(payments.map(payment => 
        payment.id === id ? { ...payment, status: newStatus } : payment
      ));
      setEditingId(null);
    }
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  const handleViewPayment = (payment) => {
    // Navigate to PaymentView with payment data
    navigate('/admin/payment-view', { state: { paymentData: payment } });
  };

  const handleGeneratePDF = () => {
    console.log('PDF button clicked!');
    console.log('Payments data:', payments);
    
    if (!payments || payments.length === 0) {
      alert('No payment data available to generate PDF');
      return;
    }
    
    try {
      generatePaymentPDF(payments);
      console.log('PDF generation completed');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Title and Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Payment Dashboard</h1>
        <div className="flex gap-4">
          {/* Add PDF Button */}
          <button
            onClick={handleGeneratePDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            📄 Generate PDF Report
          </button>
          <button
            onClick={handleRefresh}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Refresh Data
          </button>
        </div>
      </div>
      
      {/* Generate PDF Report Button */}
      

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p><strong>Warning:</strong> {error}. Showing mock data for testing.</p>
        </div>
      )}

      {/* 🔎 Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, order ID, email, status, or payment type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full shadow-md border border-gray-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                       placeholder-gray-400 text-gray-700"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        )}
      </div>

      {/* Statistics Cards - Update to use original payments data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Completed Payments No. */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Payments no.</h3>
          <p className="text-3xl font-bold text-blue-600">{completedPayments}</p>
        </div>

        {/* Payments Completed Amount */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Payments completed amount</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(completedAmount)}</p>
        </div>

        {/* Payments Need to be Approved No. */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Payments need to be approved No.</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingApproval}</p>
        </div>

        {/* Payments Need to be Approved Amount */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Payments need to be approved amount</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-300">
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">No</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Name</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Items no</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Amount</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Pay type</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Status</div>
          <div className="p-4 text-center font-medium text-gray-700">Action</div>
        </div>

        {/* Table Rows - Use filteredPayments instead of payments */}
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <>
                <p>No payments found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear search to see all payments
                </button>
              </>
            ) : (
              'No payments found. Check if your backend is running.'
            )}
          </div>
        ) : (
          filteredPayments.map((payment, index) => (
            <div key={payment.id} className="grid grid-cols-7 border-b border-gray-300 hover:bg-gray-50">
              {/* No */}
              <div className="p-4 text-center border-r border-gray-300">{index + 1}</div>
              
              {/* Name */}
              <div className="p-4 text-center border-r border-gray-300" title={`${payment.email} - ${payment.phone} - ${payment.city}`}>
                <div className="font-medium">{payment.name}</div>
                {payment.orderId && (
                  <div className="text-xs text-gray-500 mt-1">{payment.orderId}</div>
                )}
              </div>
              
              {/* Items No */}
              <div className="p-4 text-center border-r border-gray-300">{payment.itemsNo}</div>
              
              {/* Amount */}
              <div className="p-4 text-center border-r border-gray-300">
                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                {payment.cardLast4 && (
                  <div className="text-xs text-gray-500 mt-1">****{payment.cardLast4}</div>
                )}
              </div>
              
              {/* Pay Type */}
              <div className="p-4 text-center border-r border-gray-300">{payment.payType}</div>
              
              {/* Status */}
              <div className="p-4 text-center border-r border-gray-300">
                {editingId === payment.id ? (
                  <select 
                    value={payment.status}
                    onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    autoFocus
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                )}
              </div>
              
              {/* Action */}
              <div className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => handleEdit(payment.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm px-2 py-1"
                    disabled={editingId === payment.id}
                  >
                    {editingId === payment.id ? 'Editing...' : 'Edit'}
                  </button>
                  <button 
                    onClick={() => handleViewPayment(payment)}
                    className="text-green-600 hover:text-green-800 font-medium text-sm px-2 py-1 border-l border-gray-300 pl-2"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentAdminDashboard;