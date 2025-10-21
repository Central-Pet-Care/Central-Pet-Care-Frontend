import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import BankReceiptUpload from '../components/BankReceiptUpload';

const PaymentPage = () => {
  const { orderId } = useParams();   // ✅ fix orderId
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('payhere');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order data
   const fetchOrderData = async () => {
  if (!orderId) {
    setError('No Order ID provided');
    setLoading(false);
    return;
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/payments/order/${orderId}`);
    console.log("Fetched order response:", response.data); //  check structure in console


    if (response.data.success) {
      const order = response.data.order || response.data.data || response.data.orders;
      setOrderData(order);
    } else {
      setError('Order not found');
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Cannot connect to server');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  // Process payment
const handlePayment = async () => {
  setProcessing(true);

  try {
    const paymentPayload = {
      orderId: orderId,
      paymentMethod: paymentMethod
    };


    if (paymentMethod === 'payhere') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        alert('Please fill all card details');
        setProcessing(false);
        return;
      }
      paymentPayload.cardDetails = {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName
      };
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/process-direct`, paymentPayload);

  
    const resultData = {
      success: response.data.success,
      orderId: orderId,
      amount: orderData.totalAmount,
      paymentMethod: paymentMethod,
      message: response.data.message,
      name: orderData.customerInfo?.name,
      email: orderData.customerInfo?.email,
      phone: orderData.customerInfo?.phone,
      address: orderData.customerInfo?.address,
      items: orderData.orderedItems
    };

    if (paymentMethod === 'payhere') {
      resultData.transactionId = response.data.paymentId;
      resultData.cardLast4 = response.data.data?.cardLast4;
    } else if (paymentMethod === 'bank_transfer') {
      resultData.bankDetails = response.data.bankDetails;
    }

    localStorage.setItem("paymentSuccess", JSON.stringify(resultData));
    navigate('/PayConfo');

  } catch (error) {
    localStorage.setItem("paymentSuccess", JSON.stringify({
      success: false,
      orderId: orderId,
      paymentMethod: paymentMethod,
      error: error.response?.data?.message || 'Payment failed',
      message: error.response?.data?.message || 'Payment system error'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading order data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white py-2 px-4 rounded"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">
          Complete Your Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT - Customer Info & Payment Method */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Customer Information</h2>
                 <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {orderData.customerInfo?.name}</p>
                      <p><strong>Email:</strong> {orderData.customerInfo?.email}</p>
                      <p><strong>Phone:</strong> {orderData.customerInfo?.phone}</p>
                      <p><strong>Address:</strong> {orderData.customerInfo?.address}</p>
                </div>

            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                {/* PayHere Card */}
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payhere"
                    checked={paymentMethod === 'payhere'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-blue-600">💳 PayHere (Credit/Debit Card)</p>
                    <p className="text-sm text-gray-600">Pay securely with your card</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-green-600">💰 Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-purple-600">🏦 Bank Transfer</p>
                    <p className="text-sm text-gray-600">Transfer to our bank account</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Card Details (Only for PayHere) */}
            {paymentMethod === 'payhere' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-4">Card Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setPaymentData({...paymentData, cardNumber: value});
                      }}
                      className="w-full p-3 border rounded-lg"
                      maxLength="19"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          setPaymentData({...paymentData, expiryDate: value});
                        }}
                        className="w-full p-3 border rounded-lg"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '')})}
                        className="w-full p-3 border rounded-lg"
                        maxLength="4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <p><strong>Test Cards:</strong></p>
                    <p>✅ Success: 4916217501611292</p>
                    <p>❌ Fail: 4024007194349121</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-4">Bank Transfer Details</h3>
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <p className="text-lg font-bold text-purple-800">Account Number: 9535942775533</p>
                  <p className="text-purple-600">Bank Name: ABC Bank</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please transfer the exact amount and keep the receipt for verification.
                  </p>
                </div>

                {/* Bank Receipt Upload Component */}
                <BankReceiptUpload 
                  orderId={orderId}
                  onUploadSuccess={(result) => {
                    console.log('Receipt uploaded successfully:', result);
                    alert('Receipt uploaded successfully! Admin will verify your payment within 24 hours.');
                    // Optionally redirect to confirmation page
                    // navigate('/order-confirmation');
                  }}
                />
              </div>
            )}
          </div>

          {/* RIGHT - Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-purple-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-semibold">{orderData.orderId}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Items ({orderData.orderedItems.length})</h3>
              <div className="space-y-2">
                {orderData.orderedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">LKR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold text-purple-800">
                <span>Total Amount:</span>
                <span>LKR {orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                paymentMethod === 'cod' ? 'Confirm Order (COD)' :
                paymentMethod === 'bank_transfer' ? 'Get Bank Details' :
                `Pay LKR ${orderData.totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
