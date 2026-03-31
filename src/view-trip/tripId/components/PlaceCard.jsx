import React from "react";
import { Button } from "../../../components/ui/button";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GetplaceDetails } from "../../../service/Global";
import { useEffect } from "react";
import { useState } from "react";
const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?key=${
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY
}&maxWidthPx=800`;
function PlaceCard({ place }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    place && getPlacePhoto();
  }, [place]);
  const getPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName,
    };

    try {
      const resp = await GetplaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;

      if (!photoName) {
        console.warn("No photo found for this place.");
        return null;
      }

      const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
      console.log("Photo URL:", photoUrl);
      setPhotoUrl(photoUrl);

      return photoUrl;
    } catch (err) {
      console.error("Error fetching place photo:", err);
      return null;
    }
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${place.placeName} (${place.geoCoordinates.latitude},${place.geoCoordinates.longitude})`}
      target="_blank"
    >
      {" "}
      <div className="border border-white/70 bg-white/70 backdrop-blur-md rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img
          src={photoUrl ? photoUrl : "/placeholder.jpg"}
          alt={place.placeName}
          className="w-[130px] h-[130px] rounded-xl"
        />

        <div>
          <h2 className="font-bold text-lg">{place.placeName}</h2>
          <p className="text-sm text-gray-400">{place.placeDetails}</p>
          <h2 className="text-sm"> ⭐️{place.rating}</h2>
          <Button size="sm">
            <FaMapLocationDot />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
