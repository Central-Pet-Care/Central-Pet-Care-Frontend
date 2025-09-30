import React, { useState, useEffect } from 'react';

const PayConfo = () => {
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = localStorage.getItem("paymentSuccess");
    
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        setPaymentResult(parsedResult);
      } catch (error) {
        setPaymentResult({
          success: false,
          message: "Error loading payment result"
        });
      }
    } else {
      setPaymentResult({
        success: false,
        message: "No payment data found"
      });
    }
    
    setLoading(false);
  }, []);

  const handleBackToShop = () => {
    localStorage.removeItem("paymentSuccess");
    window.location.href = '/';
  };

  const handleTryAgain = () => {
    if (paymentResult?.orderId) {
      window.location.href = `/payment?orderId=${paymentResult.orderId}`;
    } else {
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-800">Loading...</p>
        </div>
      </div>
    );
  }

  if (!paymentResult || !paymentResult.success) {
    return (
      <div className="min-h-screen bg-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-500 text-white p-6 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-3xl font-bold">Payment Failed</h1>
              <p className="text-red-100 mt-2">{paymentResult?.message || 'Payment system error'}</p>
            </div>
            <div className="p-6 text-center">
              <button 
                onClick={handleTryAgain}
                className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 font-semibold mr-4"
              >
                Try Again
              </button>
              <button 
                onClick={handleBackToShop}
                className="bg-gray-500 text-white py-3 px-8 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS CASES
  if (paymentResult.paymentMethod === 'cod') {
    return (
      <div className="min-h-screen bg-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-yellow-500 text-white p-6 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h1 className="text-3xl font-bold">Order Confirmed - Cash on Delivery</h1>
              <p className="text-yellow-100 mt-2">Pay when you receive your order</p>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-yellow-800 mb-2">💡 Important:</h3>
                <p className="text-yellow-700">Please have the exact amount ready when your order arrives.</p>
                <p className="text-yellow-700">Amount to pay: <strong>LKR {paymentResult.amount}</strong></p>
              </div>
              <div className="text-center">
                <button 
                  onClick={handleBackToShop}
                  className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentResult.paymentMethod === 'bank_transfer') {
    return (
      <div className="min-h-screen bg-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-500 text-white p-6 text-center">
              <div className="text-6xl mb-4">🏦</div>
              <h1 className="text-3xl font-bold">Bank Transfer Details</h1>
              <p className="text-purple-100 mt-2">Please transfer to the account below</p>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-6 text-center">
                <h3 className="font-bold text-purple-800 mb-4 text-xl">Transfer Details:</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-purple-800">Account: 9535942775533</p>
                  <p className="text-lg text-purple-600">Bank: ABC Bank</p>
                  <p className="text-lg font-bold text-purple-800">Amount: LKR {paymentResult.amount}</p>
                </div>
                <div className="mt-4 p-4 bg-white rounded border">
                  <p className="text-sm text-gray-600">
                    <strong>Important:</strong> Please use Order ID "{paymentResult.orderId}" as the transfer reference.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <button 
                  onClick={handleBackToShop}
                  className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PayHere Card Success
  return (
    <div className="min-h-screen bg-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-500 text-white p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold">Payment Successful!</h1>
            <p className="text-green-100 mt-2">{paymentResult.message}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-green-600">✅ Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">{paymentResult.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">LKR {paymentResult.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card:</span>
                    <span className="font-mono">****{paymentResult.cardLast4}</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Customer Info</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {paymentResult.customerInfo?.name}</p>
                  <p><strong>Email:</strong> {paymentResult.customerInfo?.email}</p>
                  <p><strong>Phone:</strong> {paymentResult.customerInfo?.phone}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button 
                onClick={handleBackToShop}
                className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayConfo;
