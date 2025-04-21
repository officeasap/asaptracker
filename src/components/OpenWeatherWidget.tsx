import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Eye, Clock, Search, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { fetchWeatherByCity, fetchWeatherByCoords, OpenWeatherData } from '@/services/openWeatherService';
import { toast } from 'sonner';

const weatherIconMap: Record<string, React.ReactNode> = {
  '01d': <Sun className="text-yellow-400" />,
  '01n': <Sun className="text-gray-300" />,
  '02d': <Cloud className="text-gray-300" />,
  '02n': <Cloud className="text-gray-400" />,
  '03d': <Cloud className="text-gray-300" />,
  '03n': <Cloud className="text-gray-400" />,
  '04d': <Cloud className="text-gray-300" />,
  '04n': <Cloud className="text-gray-400" />,
  '09d': <CloudRain className="text-blue-300" />,
  '09n': <CloudRain className="text-blue-400" />,
  '10d': <CloudRain className="text-blue-300" />,
  '10n': <CloudRain className="text-blue-400" />,
  '11d': <CloudRain className="text-blue-300" />,
  '11n': <CloudRain className="text-blue-400" />,
  '13d': <CloudSnow className="text-blue-100" />,
  '13n': <CloudSnow className="text-blue-200" />,
  '50d': <Wind className="text-gray-300" />,
  '50n': <Wind className="text-gray-400" />,
};

const weatherBackgroundMap: Record<string, string> = {
  'Clear': 'from-yellow-500/20 to-orange-500/20',
  'Clouds': 'from-blue-400/20 to-gray-400/20',
  'Rain': 'from-blue-600/20 to-gray-700/20',
  'Drizzle': 'from-blue-500/20 to-gray-600/20',
  'Thunderstorm': 'from-purple-800/20 to-gray-900/20',
  'Snow': 'from-blue-100/20 to-gray-200/20',
  'Mist': 'from-gray-400/20 to-gray-600/20',
  'Smoke': 'from-gray-500/20 to-gray-700/20',
  'Haze': 'from-yellow-200/20 to-gray-500/20',
  'Dust': 'from-yellow-300/20 to-brown-500/20',
  'Fog': 'from-gray-300/20 to-gray-500/20',
  'Sand': 'from-yellow-400/20 to-yellow-600/20',
  'Ash': 'from-gray-600/20 to-gray-800/20',
  'Squall': 'from-blue-700/20 to-gray-800/20',
  'Tornado': 'from-gray-700/20 to-gray-900/20',
  'Unknown': 'from-blue-400/20 to-gray-600/20',
};

interface OpenWeatherWidgetProps {
  selectedCity?: string;
}

const OpenWeatherWidget: React.FC<OpenWeatherWidgetProps> = ({ selectedCity: propSelectedCity }) => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [geoPermissionStatus, setGeoPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const checkGeoPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const permission = await (navigator as any).permissions.query({ name: 'geolocation' });
          setGeoPermissionStatus(permission.state);
          
          if (permission.state === 'granted') {
            getLocationWeather();
          } else {
            fetchCityWeather('London');
          }
        } else {
          getLocationWeather();
        }
      } catch (e) {
        console.error('Error checking geolocation permission:', e);
        fetchCityWeather('London');
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkGeoPermission();
    
    return () => {
      if (initialLoading) {
        setInitialLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    if (propSelectedCity && propSelectedCity !== selectedCity) {
      setSelectedCity(propSelectedCity);
      fetchCityWeather(propSelectedCity);
    }
  }, [propSelectedCity]);

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await fetchWeatherByCoords(latitude, longitude);
            if (data) {
              setWeatherData(data);
              setSelectedCity(data.location.name);
              setError(null);
            } else {
              throw new Error('Could not fetch weather for your location');
            }
          } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            setError('Failed to fetch weather for your location');
            toast.error('Could not get weather for your location');
            fetchCityWeather('London');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Geolocation permission denied');
          fetchCityWeather('London');
          setLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      fetchCityWeather('London');
    }
  };

  const fetchCityWeather = async (city: string) => {
    if (!city || city.trim() === '') {
      setError('Please enter a valid city name');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCity(city);
      if (data) {
        setWeatherData(data);
        setSelectedCity(data.location.name);
      } else {
        setError(`Could not find weather data for ${city}`);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError(`Failed to fetch weather data for ${city}`);
      if (city !== 'London' && !isRetrying) {
        setIsRetrying(true);
        toast.error(`Could not load weather for ${city}, trying London instead`);
        fetchCityWeather('London');
      } else {
        toast.error('Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast.error('Please enter a city name');
      return;
    }
    fetchCityWeather(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatTime = (timestamp: number, timezone: number = 0) => {
    try {
      const date = new Date((timestamp + timezone) * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };

  const formatDay = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch (error) {
      console.error('Error formatting day:', error);
      return 'N/A';
    }
  };

  const getWeatherBackground = (condition: string) => {
    return weatherBackgroundMap[condition] || 'from-blue-400/20 to-gray-600/20';
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
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
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-light h-4 w-4" />
            <Input
              type="text"
              placeholder="Search city (e.g., London, New York, Tokyo...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-9 bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light"
            />
          </div>
          <Button 
            className="bg-[#8B0000] hover:bg-[#A80000] text-white red-glow"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Search
          </Button>
          <Button
            variant="outline"
            className="border-gray-dark text-gray-light hover:text-white"
            onClick={getLocationWeather}
            disabled={loading || geoPermissionStatus === 'denied'}
          >
            <MapPin className="h-4 w-4 mr-2" />
            My Location
          </Button>
        </div>
      </div>

      {error ? (
        <div className="glass-panel p-6 rounded-2xl bg-red-900/20 border border-red-800/30">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-300 mb-2">Error Loading Weather</h3>
            <p className="text-red-200">{error}</p>
            <div className="flex gap-2 justify-center mt-4">
              <Button 
                className="bg-purple hover:bg-purple-600 text-white purple-glow"
                onClick={() => fetchCityWeather('London')}
              >
                Try London Instead
              </Button>
              <Button 
                variant="outline"
                className="border-gray-400 text-gray-300"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="glass-panel p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple mx-auto"></div>
          <p className="mt-4 text-gray-light">Loading weather data...</p>
        </div>
      ) : weatherData ? (
        <div 
          className={cn(
            "glass-panel overflow-hidden rounded-2xl p-6 bg-gradient-to-br transition-all duration-500",
            getWeatherBackground(weatherData.current.condition || 'Unknown')
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-medium">{weatherData.location.name || 'Unknown'}, {weatherData.location.country || ''}</h3>
              <p className="text-gray-light flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {weatherData.current.timezone && typeof weatherData.current.timezone === 'number' ? 
                    formatTime(Math.floor(Date.now() / 1000), weatherData.current.timezone) : 
                    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light">{weatherData.current.temp || 0}°C</div>
              <div className="text-purple">
                {weatherData.current.feels_like !== undefined && (
                  <span>Feels like {weatherData.current.feels_like}°C</span>
                )}
              </div>
              <p className="text-white">{weatherData.current.condition || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="flex mt-8 justify-center">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 flex items-center justify-center">
                {weatherData.current.icon && weatherIconMap[weatherData.current.icon] || <Cloud className="text-white h-16 w-16 opacity-80" />}
              </div>
              <p className="text-gray-light mt-2">{weatherData.current.description || weatherData.current.condition}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-light">
                <Droplets className="h-4 w-4 text-purple" />
                <span>Humidity</span>
              </div>
              <div className="text-lg font-medium">{weatherData.current.humidity || 0}%</div>
              <Progress 
                value={weatherData.current.humidity || 0} 
                className="h-1 mt-2 bg-white/10" 
              />
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-light">
                <Wind className="h-4 w-4 text-purple" />
                <span>Wind Speed</span>
              </div>
              <div className="text-lg font-medium">{weatherData.current.wind || 0} m/s</div>
              <Progress 
                value={((weatherData.current.wind || 0) / 20) * 100} 
                className="h-1 mt-2 bg-white/10" 
              />
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-light">
                <Eye className="h-4 w-4 text-purple" />
                <span>Visibility</span>
              </div>
              <div className="text-lg font-medium">
                {weatherData.current.visibility !== undefined ? `${weatherData.current.visibility} km` : "N/A"}
              </div>
              <Progress 
                value={weatherData.current.visibility !== undefined ? (weatherData.current.visibility / 10) * 100 : 0} 
                className="h-1 mt-2 bg-white/10" 
              />
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-light">
                <Cloud className="h-4 w-4 text-purple" />
                <span>Pressure</span>
              </div>
              <div className="text-lg font-medium">
                {weatherData.current.pressure !== undefined ? `${weatherData.current.pressure} hPa` : "N/A"}
              </div>
              <Progress 
                value={weatherData.current.pressure ? ((weatherData.current.pressure - 980) / 40) * 100 : 0} 
                className="h-1 mt-2 bg-white/10" 
              />
            </div>
          </div>
          
          {weatherData.forecast && weatherData.forecast.length > 0 ? (
            <div className="mt-8">
              <h4 className="font-medium mb-3">5-Day Forecast</h4>
              <div className="grid grid-cols-5 gap-2">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium">{formatDay(day.date)}</div>
                    <div className="my-2">
                      {day.icon && weatherIconMap[day.icon] || <Cloud className="mx-auto text-white h-6 w-6 opacity-80" />}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{day.temp.max}°</span>
                      <span className="text-gray-light text-xs"> / {day.temp.min}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-light p-4 bg-white/5 rounded-lg">
              <p>Forecast data not available</p>
            </div>
          )}

          {weatherData.location.lat !== undefined && weatherData.location.lon !== undefined && (
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-light">
              <p>Location: {weatherData.location.lat.toFixed(2)}°N, {weatherData.location.lon.toFixed(2)}°E</p>
            </div>
          )}
          
          {weatherData.current.sunrise && weatherData.current.sunset && (
            <div className="mt-4 flex justify-center gap-8 p-3 bg-white/5 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-light mb-1">Sunrise</div>
                <div className="font-medium">
                  {formatTime(weatherData.current.sunrise, weatherData.current.timezone)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-light mb-1">Sunset</div>
                <div className="font-medium">
                  {formatTime(weatherData.current.sunset, weatherData.current.timezone)}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl text-center bg-purple/5">
          <Cloud className="h-16 w-16 text-gray-400 mx-auto mb-3 opacity-50" />
          <p className="text-gray-light">No weather data to display. Please search for a city.</p>
          <Button 
            className="mt-4 bg-purple hover:bg-purple-600 text-white purple-glow"
            onClick={() => fetchCityWeather('London')}
          >
            Show London Weather
          </Button>
        </div>
      )}
    </div>
  );
};

export default OpenWeatherWidget;
