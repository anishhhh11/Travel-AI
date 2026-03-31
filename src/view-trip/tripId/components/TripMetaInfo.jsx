import React from "react";
import { Plane, Train, Bus, ArrowRightLeft, IndianRupee } from "lucide-react";

const getTransportIcon = (mode) => {
  switch (mode) {
    case "Flight":
      return <Plane className="w-5 h-5 text-blue-600" />;
    case "Train":
      return <Train className="w-5 h-5 text-green-600" />;
    case "Bus":
      return <Bus className="w-5 h-5 text-orange-600" />;
    default:
      return <ArrowRightLeft className="w-5 h-5 text-purple-600" />;
  }
};

function TripMetaInfo({ trip }) {
  const data = trip?.tripData || {};

  const transport = data?.transportationOptions;
  const currency = data?.currencyInfo;

  const safeConversion =
  currency?.localCurrency === "INR"
    ? "1 INR = 1 INR"
    : currency?.conversionToINR;

  if (!transport && !currency) return null;

  return (
    <div className="glass-surface p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Travel Essentials
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 🚀 Transport */}
        {transport && (
          <div className="bg-white/70 backdrop-blur rounded-xl p-5 shadow-sm border border-gray-100 dark:bg-slate-900/80 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              {getTransportIcon(transport.bestMode)}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Best Transport: {transport.bestMode}
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {transport.details}
            </p>

            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-200">
              <span>⏱ {transport.travelTime}</span>
              <span>💸 {transport.estimatedCost}</span>
            </div>
          </div>
        )}

        {/* 💱 Currency */}
        {currency && (
          <div className="bg-white/70 backdrop-blur rounded-xl p-5 shadow-sm border border-gray-100 dark:bg-slate-900/80 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Currency Info
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Local Currency: <strong>{currency.localCurrency}</strong>
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Conversion: <strong>{safeConversion}</strong>
            </p>

            <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              Daily Spend: {currency.averageDailySpendINR}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripMetaInfo;