import React from "react";

function TripOutput({ tripResult }) {
  const cleanTripResult = (input) => {
    if (!input) return null;

    // Remove ```json or ``` if present
    let cleaned = input
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    // ✅ Remove inline comments like: // this is a comment
    cleaned = cleaned.replace(/\/\/.*$/gm, "");

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Invalid JSON after cleanup:", err);
      return null;
    }
  };

  const trip = cleanTripResult(tripResult);

  if (!trip) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow mt-10">
        ❌ Invalid trip data format.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-[#f56551]">🎉 Trip Plan for {trip.location}</h2>

      <div className="space-y-2 text-gray-800 text-sm">
        <p><strong>📍 Location:</strong> {trip.location}</p>
        <p><strong>🗓️ Duration:</strong> {trip.tripDurationDays} Days</p>
        <p><strong>👥 Travelers:</strong> {trip.travelers}</p>
        <p><strong>💰 Budget:</strong> {trip.budget}</p>
        <p><strong>📝 Notes:</strong> {trip.notes}</p>
      </div>

      {/* Hotel Options */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-2">🏨 Hotel Options</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {trip.hotelOptions?.map((hotel, i) => (
            <div key={i} className="border p-4 rounded-lg shadow-sm bg-white">
              {hotel.imageUrl && (
                <img src={hotel.imageUrl} alt={hotel.hotelName} className="h-40 w-full object-cover rounded" />
              )}
              <h4 className="text-lg font-semibold mt-2">{hotel.hotelName}</h4>
              <p className="text-gray-600">{hotel.address}</p>
              <p>💵 <strong>{hotel.pricePerNightEstimate}</strong></p>
              <p>⭐ Rating: {hotel.rating}</p>
              <p className="text-sm mt-1 text-gray-500">{hotel.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-green-600 mb-4">📅 Itinerary</h3>
        {Object.entries(trip.itinerary || {}).map(([day, details], index) => (
          <div key={index} className="mb-8">
            <h4 className="text-lg font-bold text-purple-600 mb-2 capitalize">{day}</h4>
            {details.plan && <p className="text-sm italic mb-2">{details.plan}</p>}
            <p className="text-sm mb-2"><strong>🕒 Best Time:</strong> {details.bestTimeToVisit || details.bestTime}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {(details.activities || details.plan || []).map((place, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-white shadow-sm">
                  {place.placeImageUrl || place.imageUrl ? (
                    <img
                      src={place.placeImageUrl || place.imageUrl}
                      alt={place.placeName}
                      className="h-40 w-full object-cover rounded"
                    />
                  ) : null}
                  <h5 className="text-md font-semibold mt-2">{place.placeName}</h5>
                  <p className="text-gray-600 text-sm">{place.placeDetails}</p>
                  <p className="text-sm"><strong>🎟️ Ticket:</strong> {place.ticketPricing}</p>
                  <p className="text-sm"><strong>⭐ Rating:</strong> {place.rating}</p>
                  <p className="text-sm"><strong>🕓 Duration:</strong> {place.travelTime || place.timeToSpend}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripOutput;
