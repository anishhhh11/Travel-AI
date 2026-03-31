import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Cloud,
  CloudRain,
  CloudSun,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  Sun,
} from "lucide-react";
import { getStandardLocation } from "../../../lib/location";

const createWeatherService = () => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  const fetchCoordinates = async (query) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("Failed to fetch coordinates");
    return response.json();
  };

  const getCoordinates = async (location) => {
    const standardized = getStandardLocation(location);
    const cityCountry = standardized
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const city = cityCountry[0] || "";
    const country = cityCountry[cityCountry.length - 1] || "";
    const cityWithoutPostal = city.replace(/^\d+\s+/, "").trim();
    const asciiCity = cityWithoutPostal
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    const candidates = [
      standardized,
      cityWithoutPostal && country ? `${cityWithoutPostal}, ${country}` : "",
      cityWithoutPostal,
      asciiCity && country ? `${asciiCity}, ${country}` : "",
      asciiCity,
      standardized.split(",")[0]?.trim(),
      standardized.replace(",", " "),
    ].filter(Boolean);
    for (const candidate of candidates) {
      const data = await fetchCoordinates(candidate);
      if (data?.length) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
          name: data[0].name,
          country: data[0].country,
        };
      }
    }
    throw new Error(`Unable to find weather data for "${standardized}"`);
  };

  const getSeasonalIcon = (monthIndex, latitude) => {
    const seasonIndex = latitude > 0 ? monthIndex : (monthIndex + 6) % 12;
    if (seasonIndex >= 2 && seasonIndex <= 4) return "sun";
    if (seasonIndex >= 5 && seasonIndex <= 7) return "rain";
    if (seasonIndex >= 8 && seasonIndex <= 10) return "partlyCloud";
    return "sun";
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    return "bg-purple-500";
  };

  const getBestTimeToVisit = (monthlyData) => {
    const goodMonths = monthlyData.filter((month) => {
      const avgTemp = (month.minTemp + month.maxTemp) / 2;
      return avgTemp >= 18 && avgTemp <= 32 && month.aqi <= 100;
    });
    if (!goodMonths.length) return "Year-round";
    return goodMonths.length === 1
      ? goodMonths[0].month
      : `${goodMonths[0].month} - ${goodMonths[goodMonths.length - 1].month}`;
  };

  const formatMonthlyWeather = (currentData, coords) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const monthlyData = months.map((month, index) => {
      const tempVariation = Math.sin(((index - currentMonth) * Math.PI) / 6) * 8;
      const currentTemp = currentData.main.temp;
      const minTemp = Math.round(currentTemp + tempVariation - 4);
      const maxTemp = Math.round(currentTemp + tempVariation + 6);
      const aqi = Math.round(60 + Math.random() * 80);
      return {
        month,
        temp: `${minTemp}/${maxTemp}°C`,
        minTemp,
        maxTemp,
        icon: getSeasonalIcon(index, coords.lat),
        aqi,
        aqiLabel: `AQI ${aqi}`,
        aqiColor: getAqiColor(aqi),
        isCurrentMonth: index === currentMonth,
      };
    });
    return {
      location: `${coords.name}, ${coords.country}`,
      monthlyData,
      bestTimeToVisit: getBestTimeToVisit(monthlyData),
    };
  };

  const getMonthlyWeather = async (location) => {
    if (!API_KEY) throw new Error("Weather API key is missing");
    const coords = await getCoordinates(location);
    const response = await fetch(
      `${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const currentData = await response.json();
    return formatMonthlyWeather(currentData, coords);
  };

  const getWeatherRecommendations = (weatherData) => {
    const recommendations = [];
    const currentMonth = weatherData.monthlyData.find((item) => item.isCurrentMonth);
    if (!currentMonth) return recommendations;
    if (currentMonth.aqi > 150) {
      recommendations.push({
        type: "warning",
        message:
          "High air pollution levels. Consider wearing a mask outdoors and limiting outdoor activities.",
      });
    }
    if (currentMonth.maxTemp > 35) {
      recommendations.push({
        type: "info",
        message:
          "Very hot weather expected. Stay hydrated, wear sunscreen, and avoid direct sunlight during peak hours.",
      });
    }
    if (currentMonth.icon === "rain") {
      recommendations.push({
        type: "info",
        message: "Monsoon season. Pack rain gear and keep flexible outdoor plans.",
      });
    }
    return recommendations;
  };

  return { getMonthlyWeather, getWeatherRecommendations };
};

const WeatherIcon = ({ type, className = "w-8 h-8" }) => {
  const icons = {
    sun: <Sun className={`${className} text-yellow-500`} />,
    cloud: <Cloud className={`${className} text-gray-500 dark:text-gray-300`} />,
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

const WeatherDashboard = ({ location, className = "", showRecommendations = true }) => {
  const weatherService = useMemo(() => createWeatherService(), []);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const normalizedLocation = getStandardLocation(location);

  const loadWeatherData = async (locationString) => {
    if (!locationString) return;
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getMonthlyWeather(locationString);
      setWeatherData(data);
      setRecommendations(
        showRecommendations ? weatherService.getWeatherRecommendations(data) : []
      );
      const currentMonthIndex = data.monthlyData.findIndex((item) => item.isCurrentMonth);
      setSelectedMonth(currentMonthIndex !== -1 ? currentMonthIndex : null);
    } catch (err) {
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (normalizedLocation) {
      loadWeatherData(normalizedLocation);
    }
  }, [normalizedLocation]);

  if (!normalizedLocation) return null;

  return (
    <div className={`glass-surface p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Weather in {weatherData?.location?.split(",")[0] || normalizedLocation}
          </h2>
          {weatherData && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Best time to visit {weatherData.bestTimeToVisit}
              </div>
              <button
                onClick={() => loadWeatherData(normalizedLocation)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading weather data...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading weather data</span>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}

      {weatherData && !loading && (
        <>
          {showRecommendations && recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/60 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Weather Recommendations
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {rec.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {rec.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4 mb-6">
            {weatherData.monthlyData.map((data, index) => (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-white dark:hover:bg-slate-700 border-2 ${
                  selectedMonth === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                    : "border-transparent"
                } ${data.isCurrentMonth ? "ring-2 ring-blue-200 dark:ring-blue-700" : ""}`}
                onClick={() => setSelectedMonth(selectedMonth === index ? null : index)}
              >
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-2">
                  {data.month}
                </div>
                <div className="flex justify-center mb-3">
                  <WeatherIcon type={data.icon} />
                </div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {data.temp}
                </div>
                <div className={`text-xs text-white px-2 py-1 rounded-full ${data.aqiColor}`}>
                  {data.aqiLabel}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;
