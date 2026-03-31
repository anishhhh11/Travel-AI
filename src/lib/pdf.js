import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const imageToDataUrl = async (url) => {
  if (!url) return null;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const downloadTripPdf = async (tripData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 50;
  const safeLocation = tripData?.location || "Trip Itinerary";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TravelAI Itinerary", margin, y);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Location: ${safeLocation}`, margin, y);
  y += 18;
  doc.text(`Duration: ${tripData?.tripDurationDays || "-"} days`, margin, y);
  y += 18;
  doc.text(`Travelers: ${tripData?.travelers || "-"}`, margin, y);
  y += 18;
  doc.text(`Budget: ${tripData?.budget || "-"}`, margin, y);
  y += 24;

  const coverImage = await imageToDataUrl(
    tripData?.hotelOptions?.[0]?.imageUrl || tripData?.itinerary?.day1?.activities?.[0]?.placeImageUrl
  );
  if (coverImage) {
    doc.addImage(coverImage, "JPEG", margin, y, pageWidth - margin * 2, 170);
    y += 190;
  }

  const hotels = tripData?.hotelOptions || [];
  if (hotels.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Recommended Hotels", margin, y);
    y += 12;

    autoTable(doc, {
      startY: y + 8,
      head: [["Hotel", "Address", "Price", "Rating"]],
      body: hotels.map((hotel) => [
        hotel.hotelName || "-",
        hotel.address || "-",
        hotel.pricePerNightEstimate || hotel.pricePerNight || "-",
        `${hotel.rating || "-"}`,
      ]),
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [30, 64, 175] },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  const itineraryEntries = Object.entries(tripData?.itinerary || {})
    .sort(([keyA], [keyB]) => {
      // Extract day numbers and sort numerically
      const dayA = parseInt(keyA.replace("day", ""), 10);
      const dayB = parseInt(keyB.replace("day", ""), 10);
      return dayA - dayB;
    });
  
  for (const [day, details] of itineraryEntries) {
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`${day.toUpperCase()} - ${details?.theme || "Itinerary"}`, margin, y);
    y += 14;

    const activities = details?.activities || [];
    autoTable(doc, {
      startY: y + 6,
      head: [["Time", "Place", "Details", "Price", "Duration"]],
      body: activities.map((activity) => [
        activity.time || "-",
        activity.placeName || "-",
        activity.placeDetails || "-",
        activity.ticketPricing || "-",
        activity.timeToSpend || "-",
      ]),
      styles: { fontSize: 8, cellPadding: 5 },
      headStyles: { fillColor: [249, 115, 22] },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 18;
  }

  doc.save(`travelAI-${safeLocation.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};
