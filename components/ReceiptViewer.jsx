import React, { useState, useEffect } from 'react';

const ReceiptViewer = ({ receiptId }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (receiptId) {
      fetchReceiptMetadata();
    }
  }, [receiptId]);

  const fetchReceiptMetadata = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/receipt/${receiptId}/info`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      } else {
        setError('Failed to load receipt information');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/receipt/${receiptId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = metadata?.filename || 'receipt.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download receipt');
      }
    } catch (err) {
      alert('Network error');
      console.error('Download error:', err);
    }
  };

  if (!receiptId) {
    return <div className="p-5 text-center text-gray-400 italic">No receipt uploaded yet</div>;
  }

  if (loading) {
    return <div className="p-5 text-center text-gray-600 italic">Loading receipt information...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-lg font-bold text-gray-700 mb-4">
        Receipt Information
      </h4>
      
      {metadata && (
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Filename:</span>
            <span className="text-sm text-gray-900 font-semibold">{metadata.filename}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Upload Date:</span>
            <span className="text-sm text-gray-900 font-semibold">
              {new Date(metadata.uploadDate).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600 font-medium">File Size:</span>
            <span className="text-sm text-gray-900 font-semibold">
              {(metadata.length / 1024).toFixed(2)} KB
            </span>
          </div>

          {metadata.metadata?.orderId && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Order ID:</span>
              <span className="text-sm text-gray-900 font-semibold">{metadata.metadata.orderId}</span>
            </div>
          )}

          {metadata.metadata?.bankName && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Bank Name:</span>
              <span className="text-sm text-gray-900 font-semibold">{metadata.metadata.bankName}</span>
            </div>
          )}

          {metadata.metadata?.accountNumber && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Account Number:</span>
              <span className="text-sm text-gray-900 font-semibold">{metadata.metadata.accountNumber}</span>
            </div>
          )}

          {metadata.metadata?.uploadedBy && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Uploaded By:</span>
              <span className="text-sm text-gray-900 font-semibold">{metadata.metadata.uploadedBy}</span>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={handleDownload} 
        className="w-full p-3 text-base font-bold text-white bg-purple-600 rounded-lg cursor-pointer transition-colors hover:bg-purple-700"
      >
        📥 Download Receipt PDF
      </button>
    </div>
  );
};

export default ReceiptViewer;