import jsPDF from "jspdf";

export default async function generateAdoptionReport(adoptions) {
  if (!adoptions || adoptions.length === 0) {
    alert("No adoption records to include in report!");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  // ===== SUMMARY METRICS =====
  const total = adoptions.length;
  const approved = adoptions.filter(a => a.adoptionStatus === "Approved").length;
  const rejected = adoptions.filter(a => a.adoptionStatus === "Rejected").length;
  const completed = adoptions.filter(a => a.adoptionStatus === "Completed").length;
  const pending = adoptions.filter(a => a.adoptionStatus === "Pending").length;
  const successRate = ((approved + completed) / total * 100).toFixed(1);

  // ===== PET TYPE ANALYSIS =====
  const petTypes = {};
  adoptions.forEach(a => {
    const type = a.petDetails?.species || "Unknown";
    petTypes[type] = (petTypes[type] || 0) + 1;
  });

  let mostAdopted = "N/A";
  let leastAdopted = "N/A";
  const typeEntries = Object.entries(petTypes);
  if (typeEntries.length > 0) {
    typeEntries.sort((a, b) => b[1] - a[1]);
    mostAdopted = `${typeEntries[0][0]} (${typeEntries[0][1]})`;
    leastAdopted = `${typeEntries[typeEntries.length - 1][0]} (${typeEntries[typeEntries.length - 1][1]})`;
  }

  // ===== LOGO =====
  const logoUrl =
    "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg";
  const logoImg = await fetch(logoUrl)
    .then(res => res.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));
  doc.addImage(logoImg, "JPEG", 15, 15, 30, 30);

  // ===== TITLE =====
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${monthName} ${year} Adoption Report`, 105, 30, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Report Date: ${now.toLocaleString()}`, 105, 38, { align: "center" });

  // ===== SUMMARY SECTION =====
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 25, 56);

  doc.setFont("helvetica", "normal");
  const summaryStartY = 65;
  const summarySpacing = 8;
  const summaryLines = [
    `Total Adoption Requests: ${total}`,
    `Total Approved: ${approved}`,
    `Total Rejected: ${rejected}`,
    `Total Completed: ${completed}`,
    `Pending Requests: ${pending}`,
    `Overall Adoption Success Rate: ${successRate}%`,
    `Most Adopted Pet Type: ${mostAdopted}`,
    `Least Adopted Pet Type: ${leastAdopted}`
  ];
  summaryLines.forEach((line, i) => {
    doc.text(line, 25, summaryStartY + i * summarySpacing);
  });

  // ===== DETAILED ADOPTIONS TABLE =====
  let tableStartY = summaryStartY + summaryLines.length * summarySpacing + 10;
  doc.setFont("helvetica", "bold");
  const tableHeaderHeight = 10;
  const rowHeight = 8;

  const tableCols = ["Pet ID", "Type", "Breed", "Age", "Status", "Applicant"];
  const colX = [25, 55, 90, 130, 150, 175];
  const colWidths = [30, 30, 35, 20, 25, 50];

  // Draw table header (plain black text)
  tableCols.forEach((header, i) => {
    doc.setTextColor(0, 0, 0);
    doc.text(header, colX[i], tableStartY);
  });

  // Draw table rows
  doc.setFont("helvetica", "normal");
  let y = tableStartY + rowHeight;

  adoptions.forEach((a, idx) => {
    const pet = a.petDetails || {};
    const applicant = a.personalInfo || {};

    const row = [
      a.petId || "N/A",
      pet.species || "N/A",
      pet.breed || "N/A",
      pet.ageYears ? pet.ageYears.toString() : pet.age?.toString() || "N/A",
      a.adoptionStatus || "N/A",
      applicant.fullName || "N/A"
    ];

    // Alternating row colors
    if (idx % 2 === 0) {
      doc.setFillColor(235, 245, 255);
    } else {
      doc.setFillColor(245, 255, 245);
    }
    doc.rect(23, y - 6, 170, rowHeight, "F");

    // Draw row text
    row.forEach((val, i) => {
      doc.setTextColor(0, 0, 0);
      doc.text(val, colX[i], y, { continued: false });
    });

    y += rowHeight;

    // Add new page if exceeds
    if (y > 270) {
      doc.addPage();
      y = 20;

      // Redraw table header (plain black text)
      doc.setFont("helvetica", "bold");
      tableCols.forEach((header, i) => {
        doc.setTextColor(0, 0, 0);
        doc.text(header, colX[i], y);
      });
      y += rowHeight;
      doc.setFont("helvetica", "normal");
    }
  });

  // ===== CONCLUSION =====
  const conclusionStartY = y + 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Conclusion", 25, conclusionStartY);

  doc.setFont("helvetica", "normal");
  const conclusionText = `This month, ${monthName} ${year}, shows a total of ${total} adoption requests. The adoption program continues to be effective with a success rate of ${successRate}%. Focus should be on reducing pending requests and encouraging adoption of less popular pet types.`;
  doc.text(conclusionText, 25, conclusionStartY + 8, { maxWidth: 160 });

  // ===== FOOTER =====
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Generated on: ${now.toLocaleString()}`, 20, 292);

  // ===== SAVE PDF =====
  doc.save(`Monthly_Adoption_Report_${monthName}_${year}.pdf`);
}
