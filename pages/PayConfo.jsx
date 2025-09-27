import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PayConfo = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for URL parameters (from PayHere redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const orderId = urlParams.get('orderId');

    if (success !== null && orderId) {
      // Payment returned from PayHere
      if (success === 'true') {
        // Success - get pending payment data
        const pendingPayment = localStorage.getItem("pendingPayment");
        if (pendingPayment) {
          const paymentInfo = JSON.parse(pendingPayment);
          setPaymentData({
            success: true,
            orderId: orderId,
            amount: paymentInfo.amount,
            currency: paymentInfo.currency,
            method: paymentInfo.method,
            status: 'completed',
            message: 'Payment completed successfully via PayHere',
            customerInfo: paymentInfo.customerInfo,
            items: paymentInfo.items
          });
          localStorage.removeItem("pendingPayment");
        }
      } else {
        // Failed
        setPaymentData({
          success: false,
          orderId: orderId,
          amount: 0,
          currency: 'LKR',
          method: 'payhere',
          status: 'failed',
          message: 'Payment was cancelled or failed',
          error: 'Payment was cancelled by user or payment gateway'
        });
      }
    } else {
      // Check localStorage for payment data (from direct processing)
      const paymentResult = localStorage.getItem("paymentSuccess");
      
      if (paymentResult) {
        try {
          const parsedData = JSON.parse(paymentResult);
          setPaymentData(parsedData);
          console.log("Payment confirmation data:", parsedData);
        } catch (error) {
          console.error("Error parsing payment data:", error);
          navigate('/payment');
          return;
        }
      } else {
        console.log("No payment data found, redirecting to payment");
        navigate('/payment');
        return;
      }
    }
    
    setLoading(false);
  }, [navigate]);

  const handleContinueShopping = () => {
    localStorage.removeItem("paymentSuccess");
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-lg text-purple-700">Loading payment confirmation...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">No Payment Data Found</h2>
          <p className="text-gray-600 mb-4">Unable to load payment confirmation</p>
          <button 
            onClick={() => navigate('/payment')}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
          >
            Back to Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Success/Error Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center">
            {paymentData.success ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful! ✅</h1>
                <p className="text-gray-600 mb-4">{paymentData.message}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">Status:</span>
                    <span className="font-bold text-green-700">
                      {paymentData.status === 'completed' ? '✅ Completed' : paymentData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-green-800">Order ID:</span>
                    <span className="font-mono text-green-700">{paymentData.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-green-800">Amount:</span>
                    <span className="font-bold text-green-700">LKR {paymentData.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                  {paymentData.paymentId && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-green-800">Payment ID:</span>
                      <span className="font-mono text-green-700">{paymentData.paymentId}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed ❌</h1>
                <p className="text-gray-600 mb-4">{paymentData.message}</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-800">Status:</span>
                    <span className="font-bold text-red-700">❌ Failed</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-red-800">Error:</span>
                    <span className="text-red-700">{paymentData.error}</span>
                  </div>
                  {paymentData.cardLast4 && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-red-800">Card Used:</span>
                      <span className="text-red-700">****{paymentData.cardLast4}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {paymentData.success ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Payment Completed Successfully! 🎉</h3>
              <p className="text-gray-600">Your order has been processed and you will receive a confirmation email shortly.</p>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Payment Failed</h3>
              <p className="text-gray-600">Don't worry! You can try again or choose a different payment method.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/payment')}
                  className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-3 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayConfo;
