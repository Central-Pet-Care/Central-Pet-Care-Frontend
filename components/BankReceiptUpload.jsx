import React, { useState } from 'react';

const BankReceiptUpload = ({ orderId, paymentId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bankName, setBankName] = useState('ABC Bank');
  const [accountNumber, setAccountNumber] = useState('9535942775533');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a receipt file first');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('receipt', selectedFile);
      formData.append('orderId', orderId);
      if (paymentId) formData.append('paymentId', paymentId);
      formData.append('bankName', bankName);
      formData.append('accountNumber', accountNumber);

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/upload-receipt`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert('✅ Receipt uploaded successfully!');
        setSelectedFile(null);
        if (onUploadSuccess) onUploadSuccess(result);
      } else {
        alert(`❌ Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border-2 border-purple-300">
      <h3 className="text-2xl font-bold text-purple-600 mb-4">
        Upload Bank Transfer Receipt
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Bank Name
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            placeholder="ABC Bank"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            placeholder="9535942775533"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Select Receipt (PDF only)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          />
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className={`w-full p-4 text-lg font-bold rounded-lg transition ${
            uploading || !selectedFile
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : '📤 Upload Receipt'}
        </button>
      </div>
    </div>
  );
};

export default BankReceiptUpload;
