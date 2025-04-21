
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Search, Sun, Wind, CloudLightning, Droplets, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { fetchWeatherData, searchCities, fetchFlightWeatherConditions, WeatherData } from '@/services/weatherService';
import { toast } from 'sonner';

// Icon mapping for easy reference
const iconMap = {
  'Sun': Sun,
  'Cloud': Cloud,
  'CloudRain': CloudRain,
  'CloudSnow': CloudSnow,
  'Wind': Wind,
  'CloudLightning': CloudLightning,
};

interface WeatherForecastProps {
  selectedCity?: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ selectedCity: propSelectedCity }) => {
  const [selectedCity, setSelectedCity] = useState<string>('New York');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFlightWeather, setShowFlightWeather] = useState(false);
  const [flightRouteWeather, setFlightRouteWeather] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load initial weather data for the selected city
    const loadInitialData = async () => {
      try {
        await loadWeatherData(selectedCity);
        // Load initial city list
        const cities = await searchCities('');
        setFilteredCities(cities);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Handle prop city changes
  useEffect(() => {
    if (propSelectedCity && propSelectedCity !== selectedCity) {
      loadWeatherData(propSelectedCity);
    }
  }, [propSelectedCity]);

  const loadWeatherData = async (city: string) => {
    setLoading(true);
    try {
      // Check if we already have this city's weather in our cache
      if (!weatherData[city]) {
        const data = await fetchWeatherData(city);
        if (data) {
          setWeatherData(prev => ({
            ...prev,
            [city]: data
          }));
        } else {
          toast.error(`Weather data for ${city} is not available.`);
          return;
        }
      }
      
      setSelectedCity(city);
      setSearchTerm('');
    } catch (error) {
      console.error("Error loading weather data:", error);
      toast.error("Failed to load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const cities = await searchCities('');
      setFilteredCities(cities);
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchCities(searchTerm);
      
      if (results.length === 0) {
        toast.info(`No cities found matching "${searchTerm}". Try a different search term.`);
      }
      
      setFilteredCities(results);
      
      // If there's exactly one result, automatically load that city's weather
      if (results.length === 1) {
        await loadWeatherData(results[0]);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
      toast.error("Failed to search cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectCity = (city: string) => {
    loadWeatherData(city);
  };

  const loadFlightWeatherConditions = async () => {
    setLoading(true);
    try {
      const data = await fetchFlightWeatherConditions();
      setFlightRouteWeather(data);
      setShowFlightWeather(true);
      toast.success("Flight weather conditions loaded successfully");
    } catch (error) {
      console.error("Error loading flight weather conditions:", error);
      toast.error("Failed to load flight weather conditions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherBackground = (condition: string) => {
    switch (condition) {
      case 'Sunny':
      case 'Hot':
        return 'from-yellow-500/20 to-orange-500/20';
      case 'Partly Cloudy':
        return 'from-blue-400/20 to-gray-400/20';
      case 'Cloudy':
        return 'from-gray-400/20 to-gray-600/20';
      case 'Rain':
        return 'from-blue-600/20 to-gray-700/20';
      case 'Thunderstorm':
        return 'from-purple-800/20 to-gray-900/20';
      case 'Snow':
        return 'from-blue-100/20 to-gray-200/20';
      case 'Windy':
        return 'from-teal-400/20 to-blue-300/20';
      default:
        return 'from-blue-400/20 to-blue-600/20';
    }
  };

  const formatLocalTime = (offset: number) => {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * offset));
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderWeatherSkeletons = () => (
    <div className="space-y-4">
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-10 w-16 ml-auto" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        </div>
        <div className="flex mt-8 justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="mt-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="weather" className="py-12 w-full max-w-6xl mx-auto">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-6">
          <Cloud className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">Global Weather Forecast</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <div className="glass-panel p-4 mb-4">
              <div className="relative mb-4 flex">
                <Input
                  type="text"
                  placeholder="Search cities or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full text-gray-light hover:text-white"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {initialLoading ? (
                <div className="space-y-2 py-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : loading && filteredCities.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple"></div>
                </div>
              ) : (
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        className={cn(
                          "w-full flex justify-between items-center p-2 rounded transition-colors",
                          selectedCity === city 
                            ? "bg-purple/20 text-white" 
                            : "hover:bg-white/5 text-gray-light"
                        )}
                        onClick={() => selectCity(city)}
                      >
                        <span>{city}</span>
                        {weatherData[city] && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">{weatherData[city].current.temp}°F</span>
                            {React.createElement(iconMap[weatherData[city].current.icon as keyof typeof iconMap] || Cloud, { 
                              size: 16, 
                              className: selectedCity === city ? "text-purple" : "text-gray-light" 
                            })}
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="text-center text-gray-light py-4">No cities match your search</div>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-purple hover:bg-purple-600 text-white purple-glow"
              onClick={loadFlightWeatherConditions}
              disabled={loading || initialLoading}
            >
              View Flight Weather Conditions
            </Button>
          </div>
          
          <div className="w-full lg:w-2/3">
            {initialLoading ? (
              renderWeatherSkeletons()
            ) : showFlightWeather ? (
              <div className="space-y-4">
                <h3 className="text-xl font-medium mb-2">Flight Route Weather Conditions</h3>
                {Object.entries(flightRouteWeather).map(([route, data], index) => (
                  <div 
                    key={route}
                    className={cn(
                      "glass-panel overflow-hidden rounded-xl p-4 bg-gradient-to-br transition-all duration-500",
                      getWeatherBackground((data as WeatherData).current.condition)
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{route}</h3>
                        <p className="text-gray-light">Current Weather</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-light">{(data as WeatherData).current.temp}°F</div>
                        <p className="text-purple">{(data as WeatherData).current.condition}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-sm text-gray-light">Humidity</div>
                        <div className="text-lg font-medium">{(data as WeatherData).current.humidity}%</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-sm text-gray-light">Wind Speed</div>
                        <div className="text-lg font-medium">{(data as WeatherData).current.wind} mph</div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="mt-4 border-gray-light text-gray-light hover:text-white"
                  onClick={() => setShowFlightWeather(false)}
                >
                  Back to City Weather
                </Button>
              </div>
            ) : (
              weatherData[selectedCity] && (
                <div 
                  className={cn(
                    "glass-panel overflow-hidden rounded-2xl p-6 bg-gradient-to-br transition-all duration-500",
                    getWeatherBackground(weatherData[selectedCity].current.condition)
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-medium">{selectedCity}</h3>
                      <p className="text-gray-light flex items-center gap-1">
                        <span>Current Weather</span>
                        {weatherData[selectedCity].current.localTime && (
                          <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 ml-2">
                            {weatherData[selectedCity].current.localTime}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-light">{weatherData[selectedCity].current.temp}°F</div>
                      <p className="text-purple">{weatherData[selectedCity].current.condition}</p>
                    </div>
                  </div>
                  
                  <div className="flex mt-8 justify-center">
                    {React.createElement(iconMap[weatherData[selectedCity].current.icon as keyof typeof iconMap] || Cloud, { 
                      size: 80, 
                      className: "text-white opacity-80" 
                    })}
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-gray-light text-center mb-3">
                      {weatherData[selectedCity].current.forecast || "Today's forecast shows consistent conditions throughout the day."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-light">
                        <Droplets className="h-4 w-4 text-purple" />
                        <span>Humidity</span>
                      </div>
                      <div className="text-lg font-medium">{weatherData[selectedCity].current.humidity}%</div>
                      <Progress 
                        value={weatherData[selectedCity].current.humidity} 
                        className="h-1 mt-2 bg-white/10" 
                      />
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-light">
                        <Wind className="h-4 w-4 text-purple" />
                        <span>Wind Speed</span>
                      </div>
                      <div className="text-lg font-medium">{weatherData[selectedCity].current.wind} mph</div>
                      <Progress 
                        value={(weatherData[selectedCity].current.wind / 50) * 100} 
                        className="h-1 mt-2 bg-white/10" 
                      />
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-light">
                        <Eye className="h-4 w-4 text-purple" />
                        <span>Visibility</span>
                      </div>
                      <div className="text-lg font-medium">
                        {weatherData[selectedCity].current.visibility || "10"} mi
                      </div>
                      <Progress 
                        value={((weatherData[selectedCity].current.visibility || 10) / 10) * 100} 
                        className="h-1 mt-2 bg-white/10" 
                      />
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-light">
                        <Sun className="h-4 w-4 text-purple" />
                        <span>UV Index</span>
                      </div>
                      <div className="text-lg font-medium">
                        {weatherData[selectedCity].current.uv || "5"}/10
                      </div>
                      <Progress 
                        value={((weatherData[selectedCity].current.uv || 5) / 10) * 100} 
                        className="h-1 mt-2 bg-white/10" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-medium mb-3">5-Day Forecast</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {weatherData[selectedCity].forecast.map((day, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                          <div className="text-sm font-medium">{day.day}</div>
                          <div className="my-2">
                            {React.createElement(iconMap[day.icon as keyof typeof iconMap] || Cloud, { 
                              size: 24, 
                              className: "mx-auto text-white opacity-80" 
                            })}
                          </div>
                          <div className="text-sm font-medium">{day.temp}°F</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherForecast;
