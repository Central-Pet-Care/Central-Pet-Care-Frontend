import jsPDF from "jspdf";

export default async function generateAdoptionCertificate(adoption) {
  const doc = new jsPDF("p", "mm", "a4");

  const personalInfo = adoption.personalInfo || {};
  const adopterName = personalInfo.fullName || "Unknown Adopter";
  const adopterPhone = personalInfo.phone || "N/A";
  const adopterAddress = personalInfo.address || "N/A";

  const pet = adoption.petDetails || {};
  const petName = pet.name || "Unknown Pet";
  const petSpecies = pet.species || "Unknown";
  const petBreed = pet.breed || "Unknown";
  const petAge = pet.ageYears ? `${pet.ageYears} years` : "Unknown";

  const adoptionDate = adoption.adoptionDate
    ? new Date(adoption.adoptionDate).toLocaleDateString()
    : adoption.updatedAt
    ? new Date(adoption.updatedAt).toLocaleDateString()
    : adoption.createdAt
    ? new Date(adoption.createdAt).toLocaleDateString()
    : "Unknown";

  // Create border
  doc.setDrawColor(85, 37, 130);
  doc.setLineWidth(4);
  doc.rect(10, 10, 190, 277);

  // Add logo
  const logoUrl =
    "https://fhuoudyottvtaawdswlz.supabase.co/storage/v1/object/public/images/Logo-new.jpg";
  const logoImg = await fetch(logoUrl)
    .then((res) => res.blob())
    .then((blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });

  doc.addImage(logoImg, "JPEG", 30, 20, 25, 25);

  // Header
  doc.setFontSize(22);
  doc.setTextColor(85, 37, 130);
  doc.text("Central Pet Care", 105, 30, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.setTextColor(85, 37, 130);
  doc.text("Certificate of Adoption", 105, 55, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("This pet has been successfully adopted by:", 105, 70, { align: "center" });

  // Adopter & Pet Info
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);

  const startY = 85;
  const lineHeight = 12;

  const fields = [
    ["Adopter Name:", adopterName],
    ["Address:", adopterAddress],
    ["Phone:", adopterPhone],
    ["Pet Name:", petName],
    ["Species:", petSpecies],
    ["Breed:", petBreed],
    ["Age:", petAge],
    ["Adoption Date:", adoptionDate],
  ];

  fields.forEach(([label, value], index) => {
    const y = startY + index * lineHeight;
    doc.setFont("times", "bold");
    doc.text(label, 40, y);
    doc.setFont("times", "normal");
    doc.text(value, 100, y);
  });

  // Thank you message
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(85, 37, 130);
  doc.text("Thank you for giving this pet a loving forever home!", 105, 185, { align: "center" });

  // Signature line
  doc.setDrawColor(100, 100, 100);
  doc.line(130, 240, 190, 240);
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.text("Authorized Signature", 160, 248, { align: "center" });

  
  const now = new Date();
  const issuedOn = now.toLocaleString(); 
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Issued On: ${issuedOn}`, 20, 270); 

  doc.save("adoption_certificate.pdf");
}
