import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import generatePaymentPDF from '../../utils/PaymentPDF';

const PaymentAdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      // ✅ Transform to consistent frontend structure
      const transformed = (Array.isArray(data) ? data : []).map((p) => ({
        id: p._id,
        orderId: p.orderId || 'N/A',
        name: p.customerInfo?.name || 'Unknown Customer',
        email: p.email || p.customerInfo?.email || '',
        phone: p.customerInfo?.phone || '',
        itemsNo: p.items?.length || 0,
        amount: Number(p.amount) || 0,
        currency: p.currency || 'LKR',
        payType:
          p.method === 'payhere_direct'
            ? 'PayHere Direct'
            : p.method === 'credit_card'
            ? 'Credit Card'
            : p.paymentDetails?.paymentMethod || p.method || 'N/A',
        status: p.status || 'pending',
        cardLast4: p.paymentDetails?.cardLast4 || '',
        transactionId: p.transactionId || '',
        createdAt: p.createdAt,
        paymentDate: p.paymentDate,
        city: p.customerInfo?.city || '',
        items: p.items || [],
      }));

      setPayments(transformed);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to fetch payments from server');
    } finally {
      setLoading(false);
    }
  };

  // --- Statistics ---
  const completedPayments = payments.filter((p) => p.status === 'completed').length;
  const completedAmount = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingApproval = payments.filter((p) => p.status === 'pending').length;
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // --- Search ---
  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.orderId.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.transactionId.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      p.payType.toLowerCase().includes(q)
    );
  });

  // --- Actions ---
  const handleEdit = (id) => setEditingId(id);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update payment status');

      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      setEditingId(null);
      alert('✅ Payment status updated successfully!');
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('❌ Failed to update payment status.');
      setEditingId(null);
    }
  };

  const handleRefresh = () => fetchPayments();

  const handleViewPayment = (payment) =>
    navigate('/admin/payment-view', { state: { paymentData: payment } });

  const handleGeneratePDF = () => {
    if (!payments.length) {
      alert('No payment data available to generate PDF');
      return;
    }
    try {
      generatePaymentPDF(payments);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF: ' + err.message);
    }
  };

  const formatCurrency = (amount) =>
    `Rs ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  // --- UI ---
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Payment Dashboard</h1>
        <div className="flex gap-4">
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p><strong>Warning:</strong> {error}</p>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
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
        {searchQuery && (
          <div className="text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Payments No.</h3>
          <p className="text-3xl font-bold text-blue-600">{completedPayments}</p>
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Payments Completed Amount</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(completedAmount)}</p>
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Payments No.</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingApproval}</p>
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Payments Amount</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-300">
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">No</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Name</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Items</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Amount</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Pay Type</div>
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-300">Status</div>
          <div className="p-4 text-center font-medium text-gray-700">Action</div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <>
                <p>No payments found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              'No payments found.'
            )}
          </div>
        ) : (
          filteredPayments.map((p, i) => (
            <div key={p.id} className="grid grid-cols-7 border-b border-gray-300 hover:bg-gray-50">
              <div className="p-4 text-center border-r border-gray-300">{i + 1}</div>
              <div className="p-4 text-center border-r border-gray-300" title={`${p.email} - ${p.phone} - ${p.city}`}>
                <div className="font-medium">{p.name}</div>
                {p.orderId && <div className="text-xs text-gray-500 mt-1">{p.orderId}</div>}
              </div>
              <div className="p-4 text-center border-r border-gray-300">{p.itemsNo}</div>
              <div className="p-4 text-center border-r border-gray-300">
                <div className="font-medium">{formatCurrency(p.amount)}</div>
                {p.cardLast4 && <div className="text-xs text-gray-500 mt-1">****{p.cardLast4}</div>}
              </div>
              <div className="p-4 text-center border-r border-gray-300">{p.payType}</div>
              <div className="p-4 text-center border-r border-gray-300">
                {editingId === p.id ? (
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    autoFocus
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : p.status === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : p.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                )}
              </div>
              <div className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm px-2 py-1"
                    disabled={editingId === p.id}
                  >
                    {editingId === p.id ? 'Editing...' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleViewPayment(p)}
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
