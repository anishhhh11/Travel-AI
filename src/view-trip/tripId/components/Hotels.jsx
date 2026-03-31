import React from "react";
import { Link } from "react-router-dom";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }) {
  return (
    <div className="px-5 py-5 glass-surface mb-8">
      <h2 className="font-bold text-2xl mb-5 text-slate-800 dark:text-slate-100">
        Hotel Recommendations
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {trip?.tripData?.hotelOptions?.map((item, index) => (
          <HotelCardItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;