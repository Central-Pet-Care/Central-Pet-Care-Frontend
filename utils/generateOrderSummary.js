import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default async function generateOrderForm(order) {
  const doc = new jsPDF("p", "mm", "a4");

  // 🎨 Theme colors
  const purple = [125, 78, 172]; // paw logo purple
  const lightPurple = [242, 235, 250]; // light background

  // ========== Company Header ==========
  const logoUrl =
    "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg";

  const logoImg = await fetch(logoUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

  doc.addImage(logoImg, "JPEG", 15, 12, 25, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...purple);
  doc.text("ORDER SUMMARY", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Central Pet Care", 105, 28, { align: "center" });

  // ========== Order Details ==========
  const orderId = order.orderId || "N/A";
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Order No: ${orderId}`, 160, 20);
  doc.text(`Date: ${orderDate}`, 160, 28);

  // Customer & Shipping Info
  const shipping = order.shipping || {};
  const customerName = `${shipping.firstName || ""} ${shipping.lastName || ""}`;
  const customerAddress = `${shipping.address || ""}, ${shipping.city || ""}, ${shipping.province || ""} ${shipping.postalCode || ""}`;
  const customerPhone = shipping.phone || "N/A";
  const customerEmail = order.email || "N/A";

  // Bill To
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...purple);
  doc.text("Bill To:", 15, 50);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(customerName, 15, 57);
  doc.text(customerEmail, 15, 63);
  doc.text(customerPhone, 15, 69);

  // Ship To
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...purple);
  doc.text("Ship To:", 110, 50);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(customerAddress, 110, 57);

  // ========== Items Table ==========
  const tableData = order.orderedItems.map((item) => [
    item.quantity,
    item.name,
    "0%", // tax column
    `Rs.${item.price}`,
    `Rs.${item.price * item.quantity}`,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [["QTY", "DESCRIPTION", "TAX", "UNIT PRICE", "LINE TOTAL"]],
    body: tableData,
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: purple,
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      fillColor: lightPurple,
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  // ========== Totals ==========
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 140, finalY);
  doc.text(`Rs.${order.totalAmount}`, 190, finalY, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...purple);
  doc.text("TOTAL:", 140, finalY + 8);
  doc.text(`Rs.${order.totalAmount}`, 190, finalY + 8, { align: "right" });

  // ========== Signature ==========
  doc.setDrawColor(180, 180, 180);
  doc.line(20, 260, 80, 260);
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text("Authorized Signature", 25, 266);

  // ========== Footer ==========
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...purple);
  doc.text("Thank You for Your Business!", 105, 285, { align: "center" });

  // Save
  doc.save(`order_${orderId}.pdf`);
}
