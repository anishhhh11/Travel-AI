import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetplaceDetails } from "../../../service/Global";
import { PHOTO_REF_URL } from "../../../service/Global";

function HotelCardItem({ item, index }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    item && getPlacePhoto();
  }, [item]);

  const getPlacePhoto = async () => {
    setIsLoading(true);
    const data = {
      textQuery: item.hotelName,
    };

    try {
      const resp = await GetplaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;

      if (!photoName) {
        console.warn("No photo found for this place.");
        setIsLoading(false);
        return null;
      }

      const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
      console.log("Photo URL:", photoUrl);
      setPhotoUrl(photoUrl);
      setIsLoading(false);
      return photoUrl;
    } catch (err) {
      console.error("Error fetching place photo:", err);
      setIsLoading(false);
      return null;
    }
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${item.hotelName},${item.address}`}
      target="_blank"
      className="no-underline block transform hover:scale-105 transition-all duration-300 h-full"
    >
      <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-xl shadow-md hover:shadow-xl hover:border-blue-300 border border-white/70 transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          {isLoading ? (
            <div className="h-[180px] w-full bg-gray-200 animate-pulse rounded-t-xl flex items-center justify-center">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : (
            <img
              src={photoUrl || "/placeholder.jpg"}
              className="h-[180px] w-full object-cover transition-transform duration-300 hover:scale-110"
              alt={item.hotelName}
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          )}

          {/* Rating Badge */}
          {item.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
              <span className="text-xs font-medium text-gray-800">
                ⭐️ {item.rating}
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-4">
          {/* Hotel Name */}
          <h2 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {item.hotelName}
          </h2>

          {/* Hotel Details */}
          <div className="flex flex-col gap-2 flex-grow">
            {/* Address */}
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-sm">📍</span>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {item.address}
              </p>
            </div>

            {/* Price */}
            {item.pricePerNightEstimate && (
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm">💰</span>
                <p className="text-sm font-medium text-gray-800">
                  {item.pricePerNightEstimate}
                  <span className="text-xs text-gray-500 ml-1">per night</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer - Always at bottom */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.rating && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <span className="text-yellow-500">⭐️</span>
                    <span className="text-xs font-medium text-gray-700">
                      {item.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-blue-500 text-xs font-medium hover:text-blue-700 transition-colors duration-200">
                View on Maps →
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
