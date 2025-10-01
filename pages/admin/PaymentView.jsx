import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state?.paymentData;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(paymentData?.status);

  // If no payment data, redirect back
  if (!paymentData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Payment Data Found</h2>
          <button 
            onClick={() => navigate('/admin/payments')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  // Check if payment type requires manual approval
  const requiresManualApproval = () => {
    const payType = paymentData.payType?.toLowerCase();
    return payType === 'cod' || 
           payType === 'bank transfer' || 
           payType === 'banktransfer' ||
           payType?.includes('cod') || 
           payType?.includes('bank');
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    
    try {
      // Call backend to update payment status
      const response = await fetch(`http://localhost:5000/api/payments/${paymentData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      // Update local status
      setCurrentStatus(newStatus);
      
      // Show success message
      alert(`Payment ${newStatus} successfully!`);
      
      // Optional: Navigate back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/payments');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(`Failed to ${newStatus} payment. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePayment = async () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this payment?\n\nOrder ID: ${paymentData.orderId}\nCustomer: ${paymentData.name}\nAmount: ${formatCurrency(paymentData.amount)}\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // Call backend to delete payment
      const response = await fetch(`http://localhost:5000/api/payments/${paymentData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }

      // Show success message
      alert('Payment deleted successfully!');
      
      // Navigate back to dashboard immediately
      navigate('/admin/payments');
      
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payment Details</h1>
          <p className="text-gray-600 mt-1">Order ID: {paymentData.orderId}</p>
        </div>
        <button 
          onClick={() => navigate('/admin/payments')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer Information</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Name:</span>
              <span className="text-gray-800">{paymentData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Email:</span>
              <span className="text-gray-800">{paymentData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Phone:</span>
              <span className="text-gray-800">{paymentData.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">City:</span>
              <span className="text-gray-800">{paymentData.city || 'N/A'}</span>
            </div>
          </div>

          {/* Payment Method Details */}
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3 border-b pb-2">Payment Method</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Payment Type:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{paymentData.payType}</span>
                {requiresManualApproval() && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Manual Review Required
                  </span>
                )}
              </div>
            </div>
            {paymentData.cardLast4 && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Card Number:</span>
                <span className="text-gray-800">****{paymentData.cardLast4}</span>
              </div>
            )}
            {paymentData.transactionId && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Transaction ID:</span>
                <span className="text-gray-800 font-mono text-sm">{paymentData.transactionId}</span>
              </div>
            )}
          </div>

          {/* Timeline - Keep this section for time tracking */}
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3 border-b pb-2">Timeline</h3>
          <div className="space-y-3">
            {paymentData.createdAt && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Order Created:</span>
                <span className="text-gray-800 text-sm">{formatDate(paymentData.createdAt)}</span>
              </div>
            )}
            {paymentData.paymentDate && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Payment Date:</span>
                <span className="text-gray-800 text-sm">{formatDate(paymentData.paymentDate)}</span>
              </div>
            )}
            {/* Show current timestamp for when admin is viewing */}
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Viewed At:</span>
              <span className="text-gray-800 text-sm">{formatDate(new Date())}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Items Ordered */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Items Ordered</h2>
          
          {/* Order Items */}
          {paymentData.items && paymentData.items.length > 0 ? (
            <div className="space-y-3">
              {paymentData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No individual items available</p>
              <p className="text-sm mt-1">Total items: {paymentData.itemsNo}</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Order ID:</span>
                <span className="text-gray-800 font-mono text-sm">{paymentData.orderId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Number of Items:</span>
                <span className="text-gray-800">{paymentData.itemsNo}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Currency:</span>
                <span className="text-gray-800">{paymentData.currency}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  currentStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
                  currentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </span>
              </div>
              
              {/* Total Amount - Prominent display */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800 text-lg">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(paymentData.amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <button 
          onClick={() => navigate('/admin/payments')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Back to Dashboard
        </button>
        
        {/* Only show Approve/Reject for COD and Bank Transfer payments */}
        {requiresManualApproval() && currentStatus === 'pending' && (
          <>
            <button 
              onClick={() => handleStatusUpdate('approved')}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium"
            >
              {isUpdating ? 'Updating...' : 'Approve Payment'}
            </button>
            <button 
              onClick={() => handleStatusUpdate('rejected')}
              disabled={isUpdating}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium"
            >
              {isUpdating ? 'Updating...' : 'Reject Payment'}
            </button>
          </>
        )}
        
        {requiresManualApproval() && currentStatus === 'approved' && (
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
              ✅ Payment Approved
            </span>
            <button 
              onClick={() => handleStatusUpdate('completed')}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
            >
              {isUpdating ? 'Updating...' : 'Mark as Completed'}
            </button>
          </div>
        )}
        
        {currentStatus === 'completed' && (
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
            ✅ Payment Completed
          </span>
        )}
        
        {/* Show Delete Button only for Rejected payments */}
        {currentStatus === 'rejected' && (
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
              ❌ Payment Rejected
            </span>
            <button 
              onClick={handleDeletePayment}
              disabled={isDeleting}
              className="bg-gray-400 hover:bg-red-500 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium border border-gray-600 hover:border-red-600 transition-colors duration-200"
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete Payment'}
            </button>
          </div>
        )}

        {/* Message for non-manual payment types */}
        {!requiresManualApproval() && (
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
            ℹ️ This payment was processed automatically
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentView;