import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get orderId from URL params - NO DEFAULT VALUE
  const urlParams = new URLSearchParams(location.search);
  const orderId = urlParams.get('orderId');

  useEffect(() => {
    // Validate orderId is provided
    if (!orderId) {
      alert('❌ No Order ID provided!\n\nPlease access this page with a valid order ID:\nExample: /payment?orderId=ORD0002');
      navigate('/');
      return;
    }
    fetchOrderData();
  }, [orderId]);

  // Fetch order data from backend
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching order data for:', orderId);
      
      // Test backend connection first
      try {
        const healthCheck = await axios.get('http://localhost:5000/api/payments/config', {
          timeout: 5000
        });
        console.log('✅ Backend is connected:', healthCheck.data);
      } catch (healthError) {
        console.error('❌ Backend connection failed:', healthError);
        alert('❌ Backend server is not running!\n\nPlease start the backend server:\n1. Open terminal\n2. Navigate to backend folder\n3. Run: npm start');
        
        // NO HARDCODED DATA - Redirect to home if backend is not available
        setLoading(false);
        navigate('/');
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/payments/order/${orderId}`, {
        timeout: 10000
      });
      
      console.log('📦 Order API response:', response.data);
      
      if (response.data.success) {
        setOrderData(response.data.order);
        console.log('✅ Order data loaded:', response.data.order);
      } else {
        console.error('❌ Order not found in API response');
        alert(`Order ${orderId} not found in database!`);
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Error fetching order data:', error);
      
      if (error.code === 'ECONNREFUSED') {
        alert('❌ Cannot connect to backend server!\n\nPlease make sure the backend is running on port 5000.');
      } else if (error.response?.status === 404) {
        alert(`❌ Order ${orderId} not found in database!`);
      } else {
        alert('❌ Error loading order data. Please try again.');
      }
      
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Validate payment form (Basic frontend validation only)
  const validatePaymentData = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentData;
    
    if (!cardNumber.trim()) {
      alert('Please enter card number');
      return false;
    }
    
    if (!expiryDate.trim()) {
      alert('Please enter expiry date');
      return false;
    }
    
    if (!cvv.trim()) {
      alert('Please enter CVV');
      return false;
    }
    
    if (!cardholderName.trim()) {
      alert('Please enter cardholder name');
      return false;
    }
    
    return true;
  };

  // Handle payment processing
  const handlePayment = async () => {
    if (!validatePaymentData() || !orderData) {
      return;
    }

    setProcessing(true);
    console.log('🚀 Processing payment for order:', orderId);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/payments/process-direct',
        {
          orderId: orderId,
          cardDetails: {
            cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
            expiryMonth: paymentData.expiryDate.split('/')[0],
            expiryYear: `20${paymentData.expiryDate.split('/')[1]}`,
            cvv: paymentData.cvv,
            cardholderName: paymentData.cardholderName
          }
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment response:', response.data);

      // Store payment result with dynamic customer info
      localStorage.setItem("paymentSuccess", JSON.stringify({
        success: response.data.success,
        orderId: orderId,
        amount: orderData.totalAmount,
        transactionId: response.data.paymentId,
        message: response.data.message,
        cardLast4: response.data.data?.cardLast4,
        customerInfo: {
          // Use dynamic user data if available, fallback to shipping data
          name: orderData.userData ? 
            `${orderData.userData.firstName} ${orderData.userData.lastName}` : 
            `${orderData.shipping.firstName} ${orderData.shipping.lastName}`,
          email: orderData.email,
          phone: orderData.userData ? orderData.userData.phone : orderData.shipping.phone,
          address: orderData.userData ? orderData.userData.address : orderData.shipping.address
        },
        items: orderData.orderedItems,
        orderData: orderData
      }));

      navigate('/PayConfo');

    } catch (error) {
      console.error('❌ Payment error:', error);
      
      let errorMessage = 'Payment failed';
      let cardLast4 = paymentData.cardNumber.slice(-4);
      let errors = [];
      
      if (error.response?.data) {
        errorMessage = error.response.data.message;
        errors = error.response.data.errors || [];
        cardLast4 = error.response.data.error?.cardLast4 || cardLast4;
        
        // Show detailed validation errors from backend
        if (errors.length > 0) {
          alert(`❌ Payment Validation Failed:\n\n${errors.join('\n')}`);
        }
      } else if (error.code === 'ECONNREFUSED') {
        alert('❌ Cannot connect to backend server!\n\nPlease make sure the backend is running on port 5000.');
        errorMessage = 'Backend server not available';
      } else {
        alert('❌ Payment processing failed. Please try again.');
      }

      localStorage.setItem("paymentSuccess", JSON.stringify({
        success: false,
        orderId: orderId,
        error: errorMessage,
        errors: errors,
        cardLast4: cardLast4,
        message: errorMessage
      }));

      navigate('/PayConfo');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-lg text-purple-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">
          Complete Your Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">Order Summary</h2>
            
            {/* Order Info */}
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Customer Email:</span>
                <span className="font-semibold">{orderData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Status:</span>
                <span className="font-semibold text-blue-600">{orderData.status}</span>
              </div>
            </div>

            {/* Customer Info */}
            {orderData.userData && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium">{orderData.userData.firstName} {orderData.userData.lastName}</p>
                  <p className="text-gray-600">📧 {orderData.userData.email}</p>
                  <p className="text-gray-600">📱 {orderData.userData.phone}</p>
                  <p className="text-gray-600">🏠 {orderData.userData.address}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    👤 Account Type: {orderData.userData.type}
                  </p>
                </div>
              </div>
            )}

            {/* Shipping Address (Read-only) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{orderData.shipping.firstName} {orderData.shipping.lastName}</p>
                <p className="text-gray-600">{orderData.shipping.address}</p>
                <p className="text-gray-600">{orderData.shipping.city}, {orderData.shipping.province}</p>
                <p className="text-gray-600">{orderData.shipping.postalCode}</p>
                <p className="text-gray-600">Phone: {orderData.shipping.phone}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                ℹ️ To change shipping details, please go back to cart page
              </p>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Items ({orderData.orderedItems.length})</h3>
              <div className="space-y-3">
                {orderData.orderedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold text-purple-800">
                <span>Total Amount:</span>
                <span>LKR {orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">Payment Details</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    // Auto-format card number
                    const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setPaymentData({...paymentData, cardNumber: value});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength="19"
                />
              </div>

              {/* Expiry Date & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      // Auto-format MM/YY
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      setPaymentData({...paymentData, expiryDate: value});
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '')})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength="4"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentData.cardholderName}
                  onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Enhanced Test Cards Info */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">🧪 PayHere Test Cards:</h4>
                
                {/* Success Cards */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-green-700 mb-1">✅ Success Cards:</p>
                  <div className="text-xs text-green-600 space-y-1">
                    <p>Visa: 4916217501611292</p>
                    <p>MasterCard: 5307732125531191</p>
                    <p>AMEX: 346781005510225</p>
                  </div>
                </div>

                {/* Failure Cards */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-red-700 mb-1">❌ Failure Cards:</p>
                  <div className="text-xs text-red-600 space-y-1">
                    <p><strong>Insufficient Funds:</strong> 4024007194349121</p>
                    <p><strong>Limit Exceeded:</strong> 4929119799365646</p>
                    <p><strong>Do Not Honor:</strong> 4929768900837248</p>
                    <p><strong>Network Error:</strong> 4024007120869333</p>
                  </div>
                </div>

                <p className="text-xs text-blue-600 mt-2">
                  💡 Any other card will result in failed payment. Use any valid CVV & expiry date.
                </p>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={processing}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay LKR ${orderData.totalAmount.toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;