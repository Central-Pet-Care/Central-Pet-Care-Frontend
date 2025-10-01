import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default async function generatePaymentPDF(paymentsData) {
  console.log('generatePaymentPDF called with:', paymentsData);
  
  if (!paymentsData || paymentsData.length === 0) {
    alert('No payment data provided');
    return;
  }

  try {
    const doc = new jsPDF("p", "mm", "a4");

    // 🎨 Theme colors - keeping the same purple theme
    const purple = [125, 78, 172];
    const lightPurple = [242, 235, 250];
    const green = [34, 197, 94];
    const red = [239, 68, 68];
    const blue = [59, 130, 246];

    // ========== Company Header - KEEP ==========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...purple);
    doc.text("PAYMENT REPORT", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Central Pet Care", 105, 28, { align: "center" });

    // ========== Report Details - KEEP ==========
    const reportDate = new Date().toLocaleDateString();
    const reportTime = new Date().toLocaleTimeString();

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Report Date: ${reportDate}`, 160, 20);
    doc.text(`Generated: ${reportTime}`, 160, 28);

    // ========== Calculate Statistics ==========
    const completedPayments = paymentsData.filter(p => p.status === 'completed').length;
    const completedAmount = paymentsData
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingApproval = paymentsData.filter(p => p.status === 'pending').length;
    const pendingAmount = paymentsData
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const formatCurrency = (amount) => {
      return `Rs ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Updated format date and time helper function
    const formatDateTime = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      });
    };

    const formatTime = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    // ========== Statistics Cards - KEEP ==========
    let startY = 45;
    const cardWidth = 45;
    const cardHeight = 25;
    const cardSpacing = 47;

    // Card 1: Completed Payments Count
    doc.setFillColor(...lightPurple);
    doc.rect(15, startY, cardWidth, cardHeight, 'F');
    doc.setDrawColor(...purple);
    doc.rect(15, startY, cardWidth, cardHeight, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...purple);
    doc.text("Completed Payments", 37.5, startY + 8, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(...blue);
    doc.text(completedPayments.toString(), 37.5, startY + 18, { align: "center" });

    // Card 2: Completed Amount
    doc.setFillColor(...lightPurple);
    doc.rect(15 + cardSpacing, startY, cardWidth, cardHeight, 'F');
    doc.setDrawColor(...purple);
    doc.rect(15 + cardSpacing, startY, cardWidth, cardHeight, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...purple);
    doc.text("Completed Amount", 37.5 + cardSpacing, startY + 8, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(...green);
    doc.text(formatCurrency(completedAmount), 37.5 + cardSpacing, startY + 18, { align: "center" });

    // Card 3: Pending Count
    doc.setFillColor(...lightPurple);
    doc.rect(15 + (cardSpacing * 2), startY, cardWidth, cardHeight, 'F');
    doc.setDrawColor(...purple);
    doc.rect(15 + (cardSpacing * 2), startY, cardWidth, cardHeight, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...purple);
    doc.text("Pending Payments", 37.5 + (cardSpacing * 2), startY + 8, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(...red);
    doc.text(pendingApproval.toString(), 37.5 + (cardSpacing * 2), startY + 18, { align: "center" });

    // Card 4: Pending Amount
    doc.setFillColor(...lightPurple);
    doc.rect(15 + (cardSpacing * 3), startY, cardWidth, cardHeight, 'F');
    doc.setDrawColor(...purple);
    doc.rect(15 + (cardSpacing * 3), startY, cardWidth, cardHeight, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...purple);
    doc.text("Pending Amount", 37.5 + (cardSpacing * 3), startY + 8, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(...red);
    doc.text(formatCurrency(pendingAmount), 37.5 + (cardSpacing * 3), startY + 18, { align: "center" });

    // ========== Table with Balanced Columns ==========
    const tableData = paymentsData.map((payment, index) => [
      index + 1,
      payment.name || 'N/A',
      payment.itemsNo || 0,
      formatCurrency(payment.amount || 0),
      payment.payType || 'N/A',
      payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'N/A',
      formatDateTime(payment.createdAt || payment.paymentDate), // Date column
      formatTime(payment.createdAt || payment.paymentDate)      // Time column
    ]);

    autoTable(doc, {
      startY: startY + cardHeight + 10, // Small gap after cards
      head: [["No", "Customer", "Items", "Amount", "Pay Type", "Status", "Date", "Time"]],
      body: tableData,
      theme: "striped",
      styles: { 
        fontSize: 8,
        cellPadding: 2 // Reduced padding
      },
      headStyles: {
        fillColor: purple,
        textColor: 255,
        halign: "center",
        fontStyle: "bold"
      },
      // Balanced column widths to fill the page width better
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },  // No
        1: { halign: "left", cellWidth: 35 },    // Customer - increased
        2: { halign: "center", cellWidth: 15 },  // Items - increased
        3: { halign: "right", cellWidth: 32 },   // Amount - increased
        4: { halign: "center", cellWidth: 26 },  // Pay Type - increased
        5: { halign: "center", cellWidth: 22 },  // Status - increased
        6: { halign: "center", cellWidth: 20 },  // Date - increased
        7: { halign: "center", cellWidth: 20 }   // Time - increased
      },
      // Make table use full width
      tableWidth: 'auto',
      margin: { left: 15, right: 15 }
    });

    // ========== Signature Area - MOVED UP AFTER TABLE ==========
    let finalY = doc.lastAutoTable.finalY + 20; // Space after table
    
    doc.setDrawColor(0, 0, 0); // Black line
    doc.setLineWidth(0.5);
    doc.line(20, finalY, 80, finalY); // Signature line
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Authorized Signature", 25, finalY + 6);

    // ========== Footer - MOVED UP ==========
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(...purple);
    doc.text("Central Pet Care - Payment Management System", 105, finalY + 25, { align: "center" });

    // Save PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`payment_report_${timestamp}.pdf`);
    
    console.log('PDF saved successfully');
    alert('PDF generated successfully!');
    
  } catch (error) {
    console.error('Error in PDF generation:', error);
    alert('Error generating PDF: ' + error.message);
    throw error;
  }
}

// Add this function to PaymentAdminDashboard.jsx
const handleRefresh = () => {
  console.log('Refreshing data...');
  fetchPayments();
};