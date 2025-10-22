import { jsPDF } from "jspdf";

export default async function generatePetPDF(pet) {
  const doc = new jsPDF();

  // ===== Add Border =====
  doc.setDrawColor(128, 0, 128);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // ===== Add Logo =====
  const logoUrl =
    "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg";

  const logo = await new Promise((resolve) => {
    const image = new Image();
    image.src = logoUrl;
    image.onload = () => resolve(image);
  });

  const logoWidth = 25; // Slightly reduced
  const logoHeight = 25;
  const logoX = 20;
  const logoY = 18; // Adjusted for better top padding
  doc.addImage(logo, "JPEG", logoX, logoY, logoWidth, logoHeight);

  // ===== Header Text Positioning =====
  const textStartX = logoX + logoWidth + 5; 
  let currentY = logoY + 3; 

  // 1. Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22); 
  doc.setTextColor(128, 0, 128);
  doc.text("Central Pet Care", textStartX, currentY); 
  currentY += 10; 

  // 2. Report Generated Date (Below Company Name)
  const currentDate = new Date(pet.createdAt || Date.now()).toLocaleDateString();
  doc.setFont("helvetica", "normal"); 
  doc.setFontSize(10); 
  doc.setTextColor(100);
  doc.text(`Report Generated on: ${currentDate}`, textStartX, currentY); 
  currentY += 10; 

  // 3. Document Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18); 
  doc.setTextColor(70, 0, 70); 
  doc.text("Pet Details Report", textStartX, currentY); 
  currentY += 8; 

  // 4. Italic Description
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11); 
  doc.setTextColor(100);
  doc.text("Profile of the selected pet:", textStartX, currentY); 
  
  // Set the new starting Y for the main content (significantly reduced spacing)
  let y = currentY + 7; // Reduced from currentY + 15

  // 🗑️ REMOVED: Horizontal line separator code 
  /*
  doc.setDrawColor(128, 0, 128); 
  doc.setLineWidth(0.5);
  doc.line(15, y - 5, 195, y - 5); 
  */
  
  // ===== Pet Image (Maintain Aspect Ratio) =====
  if (pet.images?.length > 0) {
    const imgUrl = pet.images[0];

    const img = await new Promise((resolve) => {
      const image = new Image();
      image.src = imgUrl;
      image.onload = () => resolve(image);
    });

    const maxWidth = 100;
    const maxHeight = 90;
    let { width, height } = img;
    const scale = Math.min(maxWidth / width, maxHeight / height);
    width *= scale;
    height *= scale;

    const x = 105 - width / 2;
    doc.setDrawColor(150, 80, 200);
    doc.setLineWidth(1);
    doc.roundedRect(x - 5, y - 5, width + 10, height + 10, 5, 5);
    doc.addImage(img, "JPEG", x, y, width, height);
    y += height + 20;
  }

  // ===== Pet Information (Table-like List) =====
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
  
  // ===== Page Numbers and Save (including date/time for filename) =====
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
  }

  // File-safe date/time for filename
  const now = new Date();
  const pad = (num) => String(num).padStart(2, '0');
  const dateTimeStamp = 
      now.getFullYear() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      '_' +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());
      
  doc.save(`${pet.name}_details_${dateTimeStamp}.pdf`);
}