// import React from "react";
// import PlaceCard from "./PlaceCard";

// // function PlacesToVisit({ trip }) {
// //   const bestTime = trip?.tripData?.bestTimeToVisit || "Unknown";

// //   return (
// //     <div>
// //       <h2 className="font-bold text-lg">Places to Visit</h2>
// //       <div className="font-medium text-lg mb-2">
// //         {Object.entries(trip?.tripData?.itinerary || {}).map(
// //           ([day, places], index) => (
// //             <div key={index} className="mb-6">
// //               <h2 className="font-bold text-lg mb-2 p-3">
// //                 {`Day ${day.replace("day", "")}`}
// //               </h2>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {places.map((place, idx) => (
// //                   <div
// //                     key={`${day}-${idx}`}
// //                     className="p-4 rounded-lg bg-white"
// //                   >
// //                     {/* ✅ Display best time to visit here */}
// //                     <h2 className="font-medium text-sm text-orange-600">
// //                       🕣 Best Time to Visit: {place.bestTimetoVisit || bestTime}
// //                     </h2>

// //                     <div className="my-3">
// //                       <PlaceCard place={place} />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // function PlacesToVisit({ trip }) {
// //   const bestTime = trip?.tripData?.bestTimeToVisit || "Unknown";

// //   return (
// //     <div>
// //       <h2 className="font-bold text-lg">Places to Visit</h2>
// //       <div className="font-medium text-lg mb-2">
// //         {Object.entries(trip?.tripData?.itinerary || {}).map(
// //           ([day, dayData], index) => (
// //             <div key={index} className="mb-6">
// //               <h2 className="font-bold text-lg mb-2 p-3">
// //                 {`Day ${day.replace("day", "")}`}
// //               </h2>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {(dayData.plan || []).map((place, idx) => (
// //                   <div
// //                     key={`${day}-${idx}`}
// //                     className="p-4 rounded-lg bg-white"
// //                   >
// //                     {/* ✅ Display best time to visit here */}
// //                     <h2 className="font-medium text-sm text-orange-600">
// //                       🕣 Best Time to Visit: {place.bestTimetoVisit || bestTime}
// //                     </h2>

// //                     <div className="my-3">
// //                       <PlaceCard place={place} />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // function PlacesToVisit({ trip }) {
// //   const bestTime = trip?.tripData?.bestTimeToVisit || "Unknown";

// //   return (
// //     <div>
// //       <h2 className="font-bold text-lg">Places to Visit</h2>
// //       <div className="font-medium text-lg mb-2">
// //         {Object.entries(trip?.tripData?.itinerary || {}).map(([day, dayData], index) => {
// //           // Handle both possible formats
// //           const places = Array.isArray(dayData)
// //             ? dayData
// //             : Array.isArray(dayData?.plan)
// //             ? dayData.plan
// //             : [];

// //           return (
// //             <div key={index} className="mb-6">
// //               <h2 className="font-bold text-lg mb-2 p-3">
// //                 {`Day ${day.replace("day", "")}`}
// //               </h2>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {places.map((place, idx) => (
// //                   <div key={`${day}-${idx}`} className="p-4 rounded-lg bg-white">
// //                     <h2 className="font-medium text-sm text-orange-600">
// //                       🕣 Best Time to Visit: {place.bestTimetoVisit || bestTime}
// //                     </h2>
// //                     <div className="my-3">
// //                       <PlaceCard place={place} />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }
// function PlacesToVisit({ trip }) {
//   // Get the correct data structure from your API response
//   const itinerary = trip?.tripData?.itinerary || {};

//   return (
//     <div>
//       <h2 className="font-bold text-lg">Places to Visit</h2>
//       <div className="font-medium text-lg mb-2">
//         {Object.entries(itinerary).map(([day, dayData], index) => {
//           // The correct structure based on your screenshot: dayData.activities
//           const activities = dayData?.activities || [];
//           const dayTheme =
//             dayData?.theme || `Day ${day.replace("day", "")} Activities`;

//           return (
//             <div key={index} className="mb-6">
//               <h2 className="font-bold text-lg mb-2 p-3">
//                 Day {day.replace("day", "")} - {dayTheme}
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {activities.map((activity, idx) => (
//                   <div
//                     key={`${day}-${idx}`}
//                     className="p-4 rounded-lg bg-white shadow-md"
//                   >
//                     {/* Display activity time */}
//                     <h3 className="font-medium text-sm text-orange-600 mb-2">
//                       🕐 {activity.time} - Best Time:{" "}
//                       {activity.bestTimeToVisit || "Anytime"}
//                     </h3>

//                     {/* Display place name
//                     <h4 className="font-bold text-lg text-gray-800 mb-2">
//                       {activity.placeName}
//                     </h4> */}

//                     {/* Display place details */}
//                     {/* <p className="text-gray-600 mb-3 text-sm">
//                       {activity.placeDetails}
//                     </p> */}

//                     {/* Display additional info */}
//                     <div className="flex justify-between items-center text-xs text-gray-500">
//                       <span>⭐ {activity.rating}</span>
//                       <span>💰 {activity.ticketPricing}</span>
//                       <span>⏱️ {activity.timeToSpend}</span>
//                     </div>

//                     {/* Display place image if available
//                     {activity.placeImageUrl && (
//                       <img
//                         src={activity.placeImageUrl}
//                         alt={activity.placeName}
//                         className="w-full h-32 object-cover rounded-md mt-3"
//                         onError={(e) => {
//                           // Hide image if it fails to load
//                           e.target.style.display = "none";
//                         }}
//                       />
//                     )} */}

//                     <div className="my-3">
//                       {/* Pass the activity data to PlaceCard component */}
//                       <PlaceCard place={activity} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default PlacesToVisit;
import React from "react";
import PlaceCard from "./PlaceCard"; // Import your PlaceCard component

function PlacesToVisit({ trip }) {
  // Get the correct data structure from your API response
  const itinerary = trip?.tripData?.itinerary || {};

  return (
    <div className="p-6 glass-surface">
      <h2 className="font-bold text-2xl mb-6 text-gray-800 dark:text-gray-100">
        Places to Visit
      </h2>

      <div className="space-y-8">
        {Object.entries(itinerary)
          .sort(([keyA], [keyB]) => {
            // Extract day numbers and sort numerically
            const dayA = parseInt(keyA.replace("day", ""), 10);
            const dayB = parseInt(keyB.replace("day", ""), 10);
            return dayA - dayB;
          })
          .map(([day, dayData], index) => {
          // The correct structure based on your screenshot: dayData.activities
          const activities = dayData?.activities || [];
          const dayTheme =
            dayData?.theme || `Day ${day.replace("day", "")} Activities`;

          return (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-md rounded-xl p-6 shadow-sm border border-white/60 dark:bg-slate-900/70 dark:border-slate-700"
            >
              <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                Day {day.replace("day", "")} - {dayTheme}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((activity, idx) => (
                  <div
                    key={`${day}-${idx}`}
                    className="bg-white/75 backdrop-blur-md rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-white/70 hover:border-blue-200 dark:bg-slate-900/80 dark:border-slate-700 dark:hover:border-blue-400"
                  >
                    {/* Activity Header */}
                    <div className="mb-4">
                      <h3 className="font-medium text-sm text-orange-400 dark:text-orange-300 mb-2 flex items-center">
                        🕐 {activity.time}
                        <span className="ml-2 text-gray-500 dark:text-gray-300">
                          • Best Time: {activity.bestTimeToVisit || "Anytime"}
                        </span>
                      </h3>
                    </div>

                    {/* Activity Stats */}
                    <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <span className="flex items-center text-xs text-gray-600 dark:text-gray-200">
                        ⭐{" "}
                        <span className="ml-1 font-medium">
                          {activity.rating}
                        </span>
                      </span>
                      <span className="flex items-center text-xs text-gray-600 dark:text-gray-200">
                        💰{" "}
                        <span className="ml-1 font-medium">
                          {activity.ticketPricing}
                        </span>
                      </span>
                      <span className="flex items-center text-xs text-gray-600 dark:text-gray-200">
                        ⏱️{" "}
                        <span className="ml-1 font-medium">
                          {activity.timeToSpend}
                        </span>
                      </span>
                    </div>

                    {/* Place Card Component */}
                    <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                      <PlaceCard place={activity} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Day Summary or Additional Info */}
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-300">
                  <p>No activities planned for this day</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {Object.keys(itinerary).length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-900 rounded-xl">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            🗺️
          </div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-200 mb-2">
            No Itinerary Available
          </h3>
          <p className="text-gray-500 dark:text-gray-300">
            Your trip itinerary will appear here once generated.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlacesToVisit;
