import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../service/Firebaseconfig";
import InfoSection from "./components/InfoSection";
import Hotels from "./components/Hotels";
import PlacesToVisit from "./components/PlacesToVisit";
import Footer from "./components/Footer";
import WeatherDashboard from "./components/WeatherDashboard";
import AsyncLoader from "../../components/custom/AsyncLoader";
import { getStandardLocation } from "../../lib/location";
import { downloadTripPdf } from "../../lib/pdf";
import ViewTripSkeleton from "../../components/custom/ViewTripSkeleton";
import TripMetaInfo from "./components/TripMetaInfo";

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    setIsLoading(true);
    const docRef = doc(db, "AiTrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document!");
    }
    setIsLoading(false);
  };

  const getLocationForWeather = () => {
    const location =
      trip?.userSelection?.location ||
      trip?.userSelection?.destination ||
      trip?.tripData?.location ||
      trip?.location;
    return getStandardLocation(location);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    await downloadTripPdf(trip?.tripData || {});
    setIsDownloadingPdf(false);
  };

if (isLoading) {
  return (
    <ViewTripSkeleton
      title="Loading your itinerary"
      messages={[
        "Fetching your destination...",
        "Loading hotels and activities...",
        "Preparing trip details...",
      ]}
    />
  );
}

// if (isDownloadingPdf) {
//   return (
//     <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
//       <h2 className="text-xl font-semibold">
//         Generating your PDF itinerary
//       </h2>

//       <div className="space-y-2 text-gray-600 text-sm text-center">
//         <p>Collecting itinerary details...</p>
//         <p>Formatting trip PDF...</p>
//         <p>Preparing your download...</p>
//       </div>
//     </div>
//   );
// }

  return (
    <div className="app-shell p-6 md:px-16 lg:px-28 xl:px-40 2xl:px-56">
      <div className="max-w-6xl mx-auto space-y-8">
        <InfoSection trip={trip} onDownloadPdf={handleDownloadPdf} />
        <TripMetaInfo trip={trip} />
        {getLocationForWeather() && (
          <div>
            <WeatherDashboard
              location={getLocationForWeather()}
              showRecommendations={true}
              className="shadow-lg"
            />
          </div>
        )}
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
      </div>
      <Footer />
    </div>
  );
}

export default Viewtrip;