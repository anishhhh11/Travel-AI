import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { GetplaceDetails } from "../../service/Global";
import { PHOTO_REF_URL } from "../../service/Global";
import { getLocationString } from "../../lib/location";

function UserTripCardItems({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && getPlacePhoto();
  }, [trip]);

  const getPlacePhoto = async () => {
    const data = {
      textQuery: getLocationString(trip?.userSelection?.location),
    };
    try {
      const resp = await GetplaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;
      if (!photoName) {
        console.warn("No photo found for this place.");
        return null;
      }
      const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
      setPhotoUrl(photoUrl);
      return photoUrl;
    } catch (err) {
      console.error("Error fetching place photo:", err);
      return null;
    }
  };

  return (
    <Link
      to={`/view-trip/${trip.id}`}
      className="shadow-2xl rounded-2xl no-underline block transform hover:scale-105 transition-all duration-300 h-full"
    >
      <div className="border border-white/60 dark:border-slate-700 rounded-2xl p-4 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl h-full flex flex-col">
        <div className="overflow-hidden rounded-xl mb-4">
          <img
            src={photoUrl || "/placeholder.jpg"}
            alt="Trip Placeholder"
            className="h-[200px] w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Content container with flex-grow to fill remaining space */}
        <div className="flex flex-col flex-grow">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 line-clamp-2">
            {getLocationString(trip?.userSelection?.location) || "Unknown Location"}
          </h2>

          {/* Trip info section */}
          <div className="flex-grow">
            {trip?.userSelection?.travelers && (
              <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">
                👥 {trip.userSelection.travelers}{" "}
                {trip.userSelection.travelers === 1 ? "Traveler" : "Travelers"}
              </p>
            )}

            {trip?.userSelection?.budget && (
              <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">
                💰 Budget: {trip.userSelection.budget}
              </p>
            )}
          </div>

          {/* View Details - Always at bottom */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <p className="text-blue-500 text-sm font-medium hover:text-blue-700 transition-colors duration-200">
              View Trip Details →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItems;
