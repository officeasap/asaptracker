
import { toast } from "sonner";

export interface OpenWeatherData {
  current: {
    temp: number;
    feels_like?: number;
    condition: string;
    humidity: number;
    wind: number;
    visibility?: number;
    pressure?: number;
    icon: string;
    description?: string;
    sunrise?: number;
    sunset?: number;
    timezone?: number;
  };
  location: {
    name: string;
    country: string;
    lat?: number;
    lon?: number;
  };
  forecast: Array<{
    day: string;
    temp: {
      min: number;
      max: number;
    };
    condition: string;
    icon: string;
    description?: string;
    humidity?: number;
    wind?: number;
    date: number;
  }>;
}

const API_KEY = '29b3dbc621f5043b1410072eac8431da';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// Helper to parse OpenWeather API response into our standardized format
function parseWeatherData(currentData: any, forecastData?: any): OpenWeatherData {
  // Parse current weather
  const current = {
    temp: Math.round(currentData.main.temp),
    feels_like: Math.round(currentData.main.feels_like),
    condition: currentData.weather[0].main,
    description: currentData.weather[0].description,
    humidity: currentData.main.humidity,
    wind: Math.round(currentData.wind.speed * 10) / 10,
    visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : undefined,
    pressure: currentData.main.pressure,
    icon: currentData.weather[0].icon,
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
    timezone: currentData.timezone,
  };

  // Parse location info
  const location = {
    name: currentData.name,
    country: currentData.sys.country,
    lat: currentData.coord.lat,
    lon: currentData.coord.lon,
  };

  // Parse forecast if provided
  const forecast = [];
  
  if (forecastData && forecastData.list) {
    // Group by day (we want one forecast per day)
    const dailyForecasts = new Map();
    
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0]; // Get YYYY-MM-DD
      
      if (!dailyForecasts.has(day)) {
        dailyForecasts.set(day, {
          temps: [],
          conditions: {},
          humidity: [],
          wind: [],
          date: item.dt,
        });
      }
      
      const dayData = dailyForecasts.get(day);
      dayData.temps.push(item.main.temp);
      
      // Track conditions with occurrence count
      const condition = item.weather[0].main;
      if (!dayData.conditions[condition]) {
        dayData.conditions[condition] = 0;
      }
      dayData.conditions[condition]++;
      
      // If this is noon or closest to noon, use this icon
      const hour = date.getHours();
      if (!dayData.icon || (typeof dayData.iconHour === 'number' && Math.abs(hour - 12) < Math.abs(dayData.iconHour - 12))) {
        dayData.icon = item.weather[0].icon;
        dayData.iconHour = hour;
        dayData.description = item.weather[0].description;
      }
      
      dayData.humidity.push(item.main.humidity);
      dayData.wind.push(item.wind.speed);
    }
    
    // Convert daily aggregates to forecast format
    for (const [day, data] of dailyForecasts.entries()) {
      if (forecast.length >= 5) break; // Limit to 5 days
      
      // Find most common condition
      let mostCommonCondition = '';
      let maxCount = 0;
      for (const [condition, count] of Object.entries(data.conditions)) {
        if (count as number > maxCount) {
          mostCommonCondition = condition;
          maxCount = count as number;
        }
      }
      
      forecast.push({
        day,
        temp: {
          min: Math.round(Math.min(...data.temps)),
          max: Math.round(Math.max(...data.temps)),
        },
        condition: mostCommonCondition,
        icon: data.icon || '',
        description: data.description,
        humidity: Math.round(data.humidity.reduce((a: number, b: number) => a + b, 0) / data.humidity.length),
        wind: Math.round(data.wind.reduce((a: number, b: number) => a + b, 0) / data.wind.length * 10) / 10,
        date: data.date,
      });
    }
  }

  return {
    current,
    location,
    forecast,
  };
}

export async function fetchWeatherByCity(city: string): Promise<OpenWeatherData | null> {
  if (!city || city.trim() === '') {
    toast.error('Please enter a valid city name');
    return null;
  }
  
  try {
    console.log(`Fetching weather data for city: ${city}`);
    
    // 1. Fetch current weather
    const currentResponse = await fetch(
      `${WEATHER_API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch weather data'}`);
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    const currentData = await currentResponse.json();
    
    // 2. Fetch forecast
    const forecastResponse = await fetch(
      `${WEATHER_API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      console.error("Forecast error:", errorData);
      // Continue with just current data if forecast fails
      return parseWeatherData(currentData);
    }
    
    const forecastData = await forecastResponse.json();
    
    // 3. Parse and return combined data
    return parseWeatherData(currentData, forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<OpenWeatherData | null> {
  if (isNaN(lat) || isNaN(lon)) {
    toast.error('Invalid coordinates provided');
    return null;
  }
  
  try {
    console.log(`Fetching weather data for coordinates: ${lat},${lon}`);
    
    // 1. Fetch current weather
    const currentResponse = await fetch(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch weather data'}`);
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    const currentData = await currentResponse.json();
    
    // 2. Fetch forecast
    const forecastResponse = await fetch(
      `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      console.error("Forecast error:", errorData);
      // Continue with just current data if forecast fails
      return parseWeatherData(currentData);
    }
    
    const forecastData = await forecastResponse.json();
    
    // 3. Parse and return combined data
    return parseWeatherData(currentData, forecastData);
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    return null;
  }
}
