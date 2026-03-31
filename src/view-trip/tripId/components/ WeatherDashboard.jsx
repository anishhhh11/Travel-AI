// components/WeatherDashboard.js
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, MapPin, Calendar, Loader2, RefreshCw, AlertCircle, Info, AlertTriangle, CloudSun } from 'lucide-react';

// Weather API Service
class WeatherService {
  constructor() {
    // For testing, you can temporarily hard-code your API key here
    this.API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'PUT_YOUR_API_KEY_HERE';
    this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
  }

  async getCoordinates(location) {
    try {
      // Clean and format the location string
      let cleanLocation = location;
      
      // If location is an object, try to extract meaningful parts
      if (typeof location === 'object') {
        cleanLocation = location.name || location.label || location.city || JSON.stringify(location);
      }
      
      // Clean the location string
      cleanLocation = cleanLocation
        .replace(/[{}[\]"]/g, '') // Remove JSON characters
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      console.log('Searching for location:', cleanLocation);
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cleanLocation)}&limit=5&appid=${this.API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch coordinates');
      
      const data = await response.json();
      console.log('Geocoding results:', data);
      
      if (data.length === 0) {
        // Try with just the first part of the location (city name)
        const cityOnly = cleanLocation.split(',')[0].trim();
        console.log('Trying with city only:', cityOnly);
        
        const retryResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityOnly)}&limit=5&appid=${this.API_KEY}`
        );
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          if (retryData.length > 0) {
            return {
              lat: retryData[0].lat,
              lon: retryData[0].lon,
              name: retryData[0].name,
              country: retryData[0].country
            };
          }
        }
        
        throw new Error(`Location "${cleanLocation}" not found. Please check the location name.`);
      }
      
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        country: data[0].country
      };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  }

  async getMonthlyWeather(location) {
    try {
      const coords = await this.getCoordinates(location);
      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const currentData = await response.json();
      return this.formatMonthlyWeather(currentData, coords);
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  formatMonthlyWeather(currentData, coords) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyData = [];

    months.forEach((month, index) => {
      const tempVariation = Math.sin((index - currentMonth) * Math.PI / 6) * 8;
      const currentTemp = currentData.main.temp;
      
      const minTemp = Math.round(currentTemp + tempVariation - 4);
      const maxTemp = Math.round(currentTemp + tempVariation + 6);
      
      // Simulate AQI variation based on season
      let baseAqi = 60 + Math.random() * 80;
      if (index >= 5 && index <= 8) baseAqi = baseAqi * 0.6; // Better in monsoon
      if (index >= 11 || index <= 1) baseAqi = baseAqi * 1.3; // Worse in winter
      
      monthlyData.push({
        month,
        temp: `${minTemp}/${maxTemp}°C`,
        minTemp,
        maxTemp,
        icon: this.getSeasonalIcon(index, coords.lat),
        aqi: Math.round(baseAqi),
        aqiLabel: `AQI ${Math.round(baseAqi)}`,
        aqiColor: this.getAqiColor(Math.round(baseAqi)),
        isCurrentMonth: index === currentMonth
      });
    });

    return {
      location: `${coords.name}, ${coords.country}`,
      monthlyData,
      bestTimeToVisit: this.getBestTimeToVisit(monthlyData)
    };
  }

  getSeasonalIcon(monthIndex, latitude) {
    const isNorthernHemisphere = latitude > 0;
    let seasonIndex = monthIndex;
    if (!isNorthernHemisphere) seasonIndex = (monthIndex + 6) % 12;

    if (seasonIndex >= 2 && seasonIndex <= 4) return 'sun';
    if (seasonIndex >= 5 && seasonIndex <= 7) return 'rain';
    if (seasonIndex >= 8 && seasonIndex <= 10) return 'partlyCloud';
    return 'sun';
  }

  getAqiColor(aqi) {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    return 'bg-purple-500';
  }

  getBestTimeToVisit(monthlyData) {
    const goodMonths = monthlyData.filter(month => {
      const avgTemp = (month.minTemp + month.maxTemp) / 2;
      return avgTemp >= 18 && avgTemp <= 32 && month.aqi <= 100;
    });

    if (goodMonths.length === 0) return "Year-round";
    return goodMonths.length === 1 ? goodMonths[0].month : `${goodMonths[0].month} - ${goodMonths[goodMonths.length - 1].month}`;
  }

  getWeatherRecommendations(weatherData) {
    const recommendations = [];
    const currentMonth = weatherData.monthlyData.find(m => m.isCurrentMonth);
    
    if (currentMonth) {
      if (currentMonth.aqi > 150) {
        recommendations.push({
          type: 'warning',
          message: 'High air pollution levels. Consider wearing a mask outdoors and limiting outdoor activities.'
        });
      }
      
      if (currentMonth.maxTemp > 35) {
        recommendations.push({
          type: 'info',
          message: 'Very hot weather expected. Stay hydrated, wear sunscreen, and avoid direct sunlight during peak hours.'
        });
      }
      
      if (currentMonth.icon === 'rain') {
        recommendations.push({
          type: 'info',
          message: 'Monsoon season. Pack rain gear, waterproof bags, and check weather before outdoor activities.'
        });
      }

      if (currentMonth.minTemp < 10) {
        recommendations.push({
          type: 'info',
          message: 'Cool temperatures expected. Pack warm clothing and layers for comfort.'
        });
      }
    }
    
    return recommendations;
  }
}

// Weather Icons Component
const WeatherIcon = ({ type, className = "w-8 h-8" }) => {
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

// Monthly Weather Card Component
const MonthlyWeatherCard = ({ data, isSelected, onClick }) => {
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

// Weather Recommendations Component
const WeatherRecommendations = ({ recommendations }) => {
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

// Main Weather Dashboard Component
const WeatherDashboard = ({ 
  location, 
  className = "", 
  showRecommendations = true 
}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const weatherService = new WeatherService();

  const loadWeatherData = async (locationString) => {
    if (!locationString) {
      console.log('No location provided to weather component');
      return;
    }
    
    console.log('Loading weather for location:', locationString);
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getMonthlyWeather(locationString);
      setWeatherData(data);
      
      if (showRecommendations) {
        const recs = weatherService.getWeatherRecommendations(data);
        setRecommendations(recs);
      }
      
      // Auto-select current month
      const currentMonthIndex = data.monthlyData.findIndex(m => m.isCurrentMonth);
      if (currentMonthIndex !== -1) {
        setSelectedMonth(currentMonthIndex);
      }
      
      console.log('Weather data loaded successfully:', data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load weather data';
      setError(errorMessage);
      console.error('Weather loading error:', err);
      
      // Show user-friendly error messages
      if (errorMessage.includes('not found')) {
        setError(`Unable to find weather data for "${locationString}". Please check if the location name is correct.`);
      } else if (errorMessage.includes('API key')) {
        setError('Weather service configuration error. Please check API key.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      loadWeatherData(location);
    }
  }, [location]);

  const handleRefresh = () => {
    if (location) {
      loadWeatherData(location);
    }
  };

  const handleMonthSelect = (index) => {
    setSelectedMonth(selectedMonth === index ? null : index);
  };

  if (!location) {
    return null; // Don't render if no location
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Weather in {weatherData?.location?.split(',')[0] || location}
          </h2>
          {weatherData && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Best time to visit {weatherData.bestTimeToVisit}
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading weather data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading weather data</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Weather Data */}
      {weatherData && !loading && (
        <>
          {/* Recommendations */}
          {showRecommendations && (
            <WeatherRecommendations recommendations={recommendations} />
          )}

          {/* Monthly Weather Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4 mb-6">
            {weatherData.monthlyData.map((data, index) => (
              <MonthlyWeatherCard
                key={index}
                data={data}
                isSelected={selectedMonth === index}
                onClick={() => handleMonthSelect(index)}
              />
            ))}
          </div>

          {/* Selected Month Details */}
          {selectedMonth !== null && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {weatherData.monthlyData[selectedMonth].month} Weather Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {weatherData.monthlyData[selectedMonth].temp}
                  </div>
                  <div className="text-sm text-gray-600">Temperature Range</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {weatherData.monthlyData[selectedMonth].aqi}
                  </div>
                  <div className="text-sm text-gray-600">Air Quality Index</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {weatherData.monthlyData[selectedMonth].icon.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-gray-600">Weather Condition</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;