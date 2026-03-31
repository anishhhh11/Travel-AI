import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, CalendarRange, Wallet, Users, MapPin } from "lucide-react";
import { GetplaceDetails } from "../../../service/Global";
import { getLocationString } from "../../../lib/location";
import { toast } from "sonner";

const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?key=${
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY
}&maxWidthPx=800`;

function InfoSection({ trip, onDownloadPdf }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    trip && getPlacePhoto();
  }, [trip]);

  const getPlacePhoto = async () => {
    setIsLoading(true);
    const data = {
      textQuery: getLocationString(trip?.userSelection?.location),
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
      setPhotoUrl(photoUrl);
      setIsLoading(false);
      return photoUrl;
    } catch (err) {
      console.error("Error fetching place photo:", err);
      setIsLoading(false);
      return null;
    }
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    await onDownloadPdf();
    setIsDownloading(false);
  };

  const handleShare = async () => {
  const shareUrl = window.location.href;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "My Trip Plan ✈️",
        text: "Check out my trip plan!",
        url: shareUrl,
      });
      toast.success("Link copied!");
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    }
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/35 glass-card">
          {isLoading ? (
            <div className="h-[400px] w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-300 text-lg">
                Loading destination image...
              </div>
            </div>
          ) : (
            <img
              src={photoUrl || "/placeholder.jpg"}
              alt="Trip Destination"
              className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-105 dark:brightness-75"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shadow-sm">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium text-gray-800">
                {getLocationString(trip?.userSelection?.location) || "Unknown Location"}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-surface overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Dream Trip to {getLocationString(trip?.userSelection?.location) || "Unknown Location"}
            </h1>
            <p className="text-blue-100 text-lg">
              Everything you need to know about your upcoming adventure
            </p>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-grow">
                <h2 className="section-title mb-6">Trip Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 p-5 rounded-xl border-2 border-blue-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                        <CalendarRange className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-blue-700 dark:text-blue-200 text-xs font-medium uppercase tracking-wide">
                          Duration
                        </p>
                        <p className="text-blue-900 dark:text-blue-100 font-semibold text-lg">
                          {trip?.tripData?.tripDurationDays ||
                            trip?.userSelection?.tripDurationDays ||
                            trip?.userSelection?.noOfDays}{" "}
                          days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-900 p-5 rounded-xl border-2 border-green-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-slate-500 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-emerald-700 dark:text-emerald-200 text-xs font-medium uppercase tracking-wide">
                          Budget
                        </p>
                        <p className="text-emerald-900 dark:text-emerald-100 font-semibold text-lg">
                          {trip?.tripData?.budget || trip?.userSelection?.budget}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-900 p-5 rounded-xl border-2 border-purple-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-slate-500 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-purple-700 dark:text-purple-200 text-xs font-medium uppercase tracking-wide">
                          Travelers
                        </p>
                        <p className="text-purple-900 dark:text-purple-100 font-semibold text-lg">
                          {trip?.tripData?.travelers ||
                            trip?.userSelection?.travelers}{" "}
                          {(trip?.tripData?.travelers ||
                            trip?.userSelection?.travelers) === 1
                            ? "person"
                            : "people"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {/* Download Button */}
                <Button
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 py-3 cursor-pointer flex items-center justify-center dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isDownloading ? "Generating..." : "Download PDF"}
                </Button>

                {/* Share Button */}
                <Button
                  onClick={handleShare}
                  className="bg-white text-slate-900 border border-gray-300 hover:bg-gray-100 rounded-xl px-6 py-3 flex items-center justify-center dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Trip
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default InfoSection;