// components/Weather/WeatherCard.js
import React from 'react';
import { Sun, Cloud, CloudRain, MapPin, Calendar, AlertTriangle, Info, CloudSun } from 'lucide-react';

export const WeatherIcon = ({ type, className = "w-8 h-8" }) => {
  const icons = {
    sun: <Sun className={`${className} text-yellow-500`} />,
    cloud: <Cloud className={`${className} text-gray-500`} />,
    rain: <CloudRain className={`${className} text-blue-500`} />,
    partlyCloud: <CloudSun className={`${className} text-blue-500`} />,
    // partlyCloud: (
    //   <div className="relative">
    //     <Sun className={`${className.replace('w-8 h-8', 'w-6 h-6')} text-yellow-500 absolute top-0 left-1`} />
    //     <Cloud className={`${className.replace('w-8 h-8', 'w-6 h-6')} text-gray-400 absolute top-1 left-0`} />
    //   </div>
    // )
  };
  
  return icons[type] || icons.sun;
};

export const MonthlyWeatherCard = ({ data, isSelected, onClick }) => {
  return (
    <div
      className={`bg-gray-50 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-white border-2 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'
      } ${data.isCurrentMonth ? 'ring-2 ring-blue-200' : ''}`}
      onClick={onClick}
    >
      <div className="text-sm font-semibold text-gray-600 mb-2">{data.month}</div>
      <div className="flex justify-center mb-3">
        <WeatherIcon type={data.icon} />
      </div>
      <div className="text-xs font-medium text-gray-700 mb-2">{data.temp}</div>
      <div className={`text-xs text-white px-2 py-1 rounded-full ${data.aqiColor}`}>
        {data.aqiLabel}
      </div>
      {data.isCurrentMonth && (
        <div className="mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export const WeatherRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <Info className="w-5 h-5" />
        Weather Recommendations
      </h3>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-2">
            {rec.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            )}
            <span className="text-sm text-gray-700">{rec.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BestTimeToVisit = ({ bestTime, location }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        Weather in {location?.split(',')[0] || 'Location'}
      </h2>
      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
        <Calendar className="w-4 h-4" />
        Best time to visit {bestTime}
      </div>
    </div>
  );
};