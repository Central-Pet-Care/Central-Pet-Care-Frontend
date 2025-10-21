import React from 'react';
import BankReceiptUpload from '../components/BankReceiptUpload';

const BankTransferPage = () => {
  // Example: Get orderId and paymentId from URL params or props
  const orderId = "CBC0013"; // Replace with actual order ID
  const paymentId = "payment_id_here"; // Replace with actual payment ID

  const handleUploadSuccess = (result) => {
    console.log('Upload successful:', result);
    
    // You can redirect to a confirmation page or show a success message
    alert(`Receipt uploaded successfully! Receipt ID: ${result.receiptId}`);
    
    // Optional: Redirect to order confirmation or payment history
    // window.location.href = '/order-confirmation';
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto mb-10 p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Bank Transfer Payment Instructions
        </h2>
        
        <div className="p-6 bg-gray-100 rounded-lg mb-6 border-2 border-purple-600">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Transfer to:</h3>
          <div className="flex justify-between py-3 border-b border-gray-300">
            <span className="text-base text-gray-600 font-medium">Bank Name:</span>
            <span className="text-base text-gray-900 font-bold">ABC Bank</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-300">
            <span className="text-base text-gray-600 font-medium">Account Number:</span>
            <span className="text-base text-gray-900 font-bold">9535942775533</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-300">
            <span className="text-base text-gray-600 font-medium">Account Name:</span>
            <span className="text-base text-gray-900 font-bold">Central Pet Care</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-300">
            <span className="text-base text-gray-600 font-medium">Amount:</span>
            <span className="text-base text-gray-900 font-bold">LKR 5000.00</span>
          </div>
        </div>

        <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-500">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Steps to Complete Payment:</h3>
          <ol className="list-decimal pl-6 m-0">
            <li className="text-base text-yellow-900 py-2 leading-relaxed">
              Transfer the exact amount to the bank account above
            </li>
            <li className="text-base text-yellow-900 py-2 leading-relaxed">
              Keep the receipt/confirmation from your bank
            </li>
            <li className="text-base text-yellow-900 py-2 leading-relaxed">
              Upload the receipt PDF using the form below
            </li>
            <li className="text-base text-yellow-900 py-2 leading-relaxed">
              Wait for admin verification (usually within 24 hours)
            </li>
          </ol>
        </div>
      </div>

      {/* Bank Receipt Upload Component */}
      <BankReceiptUpload 
        orderId={orderId} 
        paymentId={paymentId}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default BankTransferPage;
