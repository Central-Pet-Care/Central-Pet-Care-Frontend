import { jsPDF } from "jspdf";

export default async function generatePetPDF(pet) {
  const doc = new jsPDF();

  // ===== Add Border =====
  doc.setDrawColor(128, 0, 128);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // ===== Header =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(128, 0, 128);
  doc.text("Central Pet Care", 105, 25, { align: "center" });

  doc.setFontSize(20);
  doc.text("Pet Details Report", 105, 40, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Profile of the selected pet:", 105, 50, { align: "center" });

  let y = 65;

  // ===== Pet Image (Maintain Aspect Ratio) =====
  if (pet.images?.length > 0) {
    const imgUrl = pet.images[0];

    const img = await new Promise((resolve) => {
      const image = new Image();
      image.src = imgUrl;
      image.onload = () => resolve(image);
    });

    const maxWidth = 100; // Max allowed width in PDF
    const maxHeight = 90; // Max allowed height in PDF
    let { width, height } = img;

    // 🔧 Maintain aspect ratio
    const scale = Math.min(maxWidth / width, maxHeight / height);
    width *= scale;
    height *= scale;

    const x = 105 - width / 2; // Center image
    doc.setDrawColor(150, 80, 200);
    doc.setLineWidth(1);
    doc.roundedRect(x - 5, y - 5, width + 10, height + 10, 5, 5);
    doc.addImage(img, "JPEG", x, y, width, height);
    y += height + 20;
  }

  // ===== Pet Information =====
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Pet Information", 20, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Name: ${pet.name}`, 20, y); y += 8;
  doc.text(`Breed: ${pet.breed}`, 20, y); y += 8;
  doc.text(`Species: ${pet.species}`, 20, y); y += 8;
  doc.text(`Sex: ${pet.sex}`, 20, y); y += 8;
  doc.text(`Age: ${pet.ageYears} years`, 20, y); y += 8;
  doc.text(`Size: ${pet.size}`, 20, y); y += 8;
  doc.text(`Color: ${pet.color}`, 20, y); y += 8;
  doc.text(`Status: ${pet.adoptionStatus}`, 20, y); y += 8;
  doc.text(`Price: Rs. ${pet.price}`, 20, y);
  y += 20;

  // ===== Description =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Description", 20, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const descLines = doc.splitTextToSize(
    pet.description || "No description available.",
    170
  );
  doc.text(descLines, 20, y);
  y += descLines.length * 6 + 20;

  // ===== Page Numbers =====
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
  }

  doc.save(`${pet.name}_details.pdf`);
}
