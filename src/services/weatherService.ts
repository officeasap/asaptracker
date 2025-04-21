import { toast } from "sonner";

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    visibility?: number;
    uv?: number;
    icon: any;
    localTime?: string;
    forecast?: string;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: any;
  }>;
}

// Function to generate a local time string based on a UTC offset
const generateLocalTime = (offset: number) => {
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localTime = new Date(utc + (3600000 * offset));
  return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Sample weather data for different cities - would be replaced with API calls
const weatherData = {
  // Existing cities
  'New York': {
    current: { 
      temp: 72, 
      condition: 'Partly Cloudy', 
      humidity: 65, 
      wind: 8, 
      visibility: 8.2,
      uv: 6,
      icon: 'Cloud',
      localTime: generateLocalTime(-4),
      forecast: 'Partly cloudy conditions with a slight chance of showers in the afternoon.'
    },
    forecast: [
      { day: 'Mon', temp: 74, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 76, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 71, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 68, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 70, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'London': {
    current: { 
      temp: 62, 
      condition: 'Rain', 
      humidity: 80, 
      wind: 12, 
      visibility: 4.5,
      uv: 2,
      icon: 'CloudRain',
      localTime: generateLocalTime(1),
      forecast: 'Periods of rain throughout the day with occasional breaks. Bring an umbrella!'
    },
    forecast: [
      { day: 'Mon', temp: 60, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 59, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 63, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 65, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 61, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  // Asian cities
  'Tokyo': {
    current: { 
      temp: 81, 
      condition: 'Sunny', 
      humidity: 70, 
      wind: 5, 
      visibility: 9.8,
      uv: 8,
      icon: 'Sun',
      localTime: generateLocalTime(9),
      forecast: 'Sunny and warm conditions throughout the day with a gentle breeze.'
    },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 85, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 86, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 84, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 80, condition: 'Thunderstorm', icon: 'CloudLightning' },
    ]
  },
  'Jakarta': {
    current: { 
      temp: 88, 
      condition: 'Partly Cloudy', 
      humidity: 75, 
      wind: 7, 
      visibility: 7.2,
      uv: 7,
      icon: 'Cloud',
      localTime: generateLocalTime(7),
      forecast: 'Partly cloudy with a chance of afternoon thunderstorms. Typical tropical weather.'
    },
    forecast: [
      { day: 'Mon', temp: 89, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 90, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 86, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 88, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Singapore': {
    current: { 
      temp: 87, 
      condition: 'Thunderstorm', 
      humidity: 85, 
      wind: 6, 
      visibility: 5.0,
      uv: 4,
      icon: 'CloudLightning',
      localTime: generateLocalTime(8),
      forecast: 'Thunderstorms with heavy rain at times. Flash flooding possible in some areas.'
    },
    forecast: [
      { day: 'Mon', temp: 86, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Tue', temp: 88, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 89, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 88, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Bangkok': {
    current: { 
      temp: 91, 
      condition: 'Hot', 
      humidity: 70, 
      wind: 5, 
      visibility: 6.5,
      uv: 9,
      icon: 'Sun',
      localTime: generateLocalTime(7),
      forecast: 'Hot and humid with a chance of isolated thunderstorms in the late afternoon.'
    },
    forecast: [
      { day: 'Mon', temp: 92, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 93, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 90, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Thu', temp: 88, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 89, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  // Added more Asian cities
  'Shanghai': {
    current: { 
      temp: 75, 
      condition: 'Cloudy', 
      humidity: 68, 
      wind: 8, 
      visibility: 6.8,
      uv: 4,
      icon: 'Cloud',
      localTime: generateLocalTime(8),
      forecast: 'Mostly cloudy with occasional breaks of sunshine. Mild temperatures.'
    },
    forecast: [
      { day: 'Mon', temp: 77, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 79, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 80, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 76, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 74, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  'Seoul': {
    current: { 
      temp: 68, 
      condition: 'Partly Cloudy', 
      humidity: 62, 
      wind: 9, 
      visibility: 8.5,
      uv: 5,
      icon: 'Cloud',
      localTime: generateLocalTime(9),
      forecast: 'Partly cloudy with comfortable temperatures. Good conditions for outdoor activities.'
    },
    forecast: [
      { day: 'Mon', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 69, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 67, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 65, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  'Kuala Lumpur': {
    current: { 
      temp: 86, 
      condition: 'Thunderstorm', 
      humidity: 80, 
      wind: 6, 
      visibility: 4.5,
      uv: 3,
      icon: 'CloudLightning',
      localTime: generateLocalTime(8),
      forecast: 'Thunderstorms with heavy downpours. Typical afternoon monsoon pattern.'
    },
    forecast: [
      { day: 'Mon', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 88, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 86, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 85, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 87, condition: 'Thunderstorm', icon: 'CloudLightning' },
    ]
  },
  'Hong Kong': {
    current: { 
      temp: 82, 
      condition: 'Partly Cloudy', 
      humidity: 75, 
      wind: 10, 
      visibility: 7.0,
      uv: 6,
      icon: 'Cloud',
      localTime: generateLocalTime(8),
      forecast: 'Partly cloudy with a chance of isolated showers. Warm and humid.'
    },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 81, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 79, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 80, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 82, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Manila': {
    current: { 
      temp: 85, 
      condition: 'Rain', 
      humidity: 82, 
      wind: 12, 
      visibility: 4.0,
      uv: 3,
      icon: 'CloudRain',
      localTime: generateLocalTime(8),
      forecast: 'Periods of heavy rain with occasional thunderstorms. Flooding possible in low-lying areas.'
    },
    forecast: [
      { day: 'Mon', temp: 86, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Tue', temp: 85, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 84, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 86, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 87, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Ho Chi Minh City': {
    current: { 
      temp: 89, 
      condition: 'Hot', 
      humidity: 78, 
      wind: 7, 
      visibility: 6.0,
      uv: 8,
      icon: 'Sun',
      localTime: generateLocalTime(7),
      forecast: 'Hot and humid with a chance of afternoon thunderstorms. Stay hydrated.'
    },
    forecast: [
      { day: 'Mon', temp: 90, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 91, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 88, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 87, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 89, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Taipei': {
    current: { 
      temp: 79, 
      condition: 'Partly Cloudy', 
      humidity: 70, 
      wind: 8, 
      visibility: 7.5,
      uv: 6,
      icon: 'Cloud',
      localTime: generateLocalTime(8),
      forecast: 'Partly cloudy with a chance of isolated showers. Pleasant temperatures.'
    },
    forecast: [
      { day: 'Mon', temp: 80, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 82, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 83, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 79, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 77, condition: 'Rain', icon: 'CloudRain' },
    ]
  },
  // More global cities
  'Sydney': {
    current: { 
      temp: 68, 
      condition: 'Windy', 
      humidity: 55, 
      wind: 15, 
      visibility: 9.0,
      uv: 5,
      icon: 'Wind',
      localTime: generateLocalTime(10),
      forecast: 'Windy conditions with partly cloudy skies. Cooler temperatures due to the wind.'
    },
    forecast: [
      { day: 'Mon', temp: 65, condition: 'Windy', icon: 'Wind' },
      { day: 'Tue', temp: 63, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 67, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 74, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Moscow': {
    current: { 
      temp: 40, 
      condition: 'Snow', 
      humidity: 85, 
      wind: 10, 
      visibility: 3.0,
      uv: 1,
      icon: 'CloudSnow',
      localTime: generateLocalTime(3),
      forecast: 'Light snow throughout the day. Cold temperatures with limited visibility.'
    },
    forecast: [
      { day: 'Mon', temp: 38, condition: 'Snow', icon: 'CloudSnow' },
      { day: 'Tue', temp: 36, condition: 'Snow', icon: 'CloudSnow' },
      { day: 'Wed', temp: 42, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 45, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 41, condition: 'Snow', icon: 'CloudSnow' },
    ]
  },
  'Dubai': {
    current: { 
      temp: 95, 
      condition: 'Sunny', 
      humidity: 40, 
      wind: 7, 
      visibility: 10.0,
      uv: 10,
      icon: 'Sun',
      localTime: generateLocalTime(4),
      forecast: 'Hot and sunny with clear skies. Very high UV index - sun protection essential.'
    },
    forecast: [
      { day: 'Mon', temp: 97, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 98, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 96, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 95, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 93, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  // Additional global capitals and major cities
  'Paris': {
    current: { 
      temp: 68, 
      condition: 'Partly Cloudy', 
      humidity: 62, 
      wind: 7, 
      visibility: 8.5,
      uv: 5,
      icon: 'Cloud',
      localTime: generateLocalTime(2),
      forecast: 'Partly cloudy with occasional sunshine. Pleasant temperatures throughout the day.'
    },
    forecast: [
      { day: 'Mon', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 69, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 67, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 71, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Berlin': {
    current: { 
      temp: 64, 
      condition: 'Cloudy', 
      humidity: 70, 
      wind: 9, 
      visibility: 7.2,
      uv: 3,
      icon: 'Cloud',
      localTime: generateLocalTime(2),
      forecast: 'Overcast conditions with occasional light drizzle possible in the evening.'
    },
    forecast: [
      { day: 'Mon', temp: 63, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 65, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 68, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 69, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 64, condition: 'Rain', icon: 'CloudRain' },
    ]
  },
  'Rome': {
    current: { 
      temp: 75, 
      condition: 'Sunny', 
      humidity: 55, 
      wind: 6, 
      visibility: 10,
      uv: 7,
      icon: 'Sun',
      localTime: generateLocalTime(2),
      forecast: 'Clear skies and warm temperatures. Perfect conditions for sightseeing.'
    },
    forecast: [
      { day: 'Mon', temp: 77, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 78, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 76, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 75, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 73, condition: 'Rain', icon: 'CloudRain' },
    ]
  },
  'Cairo': {
    current: { 
      temp: 91, 
      condition: 'Hot', 
      humidity: 35, 
      wind: 8, 
      visibility: 7.5,
      uv: 9,
      icon: 'Sun',
      localTime: generateLocalTime(2),
      forecast: 'Very hot and dry conditions. Stay hydrated and avoid peak sunlight hours.'
    },
    forecast: [
      { day: 'Mon', temp: 93, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 94, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 92, condition: 'Hot', icon: 'Sun' },
      { day: 'Thu', temp: 90, condition: 'Hot', icon: 'Sun' },
      { day: 'Fri', temp: 89, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Mexico City': {
    current: { 
      temp: 70, 
      condition: 'Partly Cloudy', 
      humidity: 60, 
      wind: 5, 
      visibility: 8.0,
      uv: 5,
      icon: 'Cloud',
      localTime: generateLocalTime(-5),
      forecast: 'Pleasant temperatures with some cloud cover. Chance of afternoon showers.'
    },
    forecast: [
      { day: 'Mon', temp: 72, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 73, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 71, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 70, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 74, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Rio de Janeiro': {
    current: { 
      temp: 82, 
      condition: 'Sunny', 
      humidity: 72, 
      wind: 6, 
      visibility: 9.5,
      uv: 8,
      icon: 'Sun',
      localTime: generateLocalTime(-3),
      forecast: 'Sunny and humid with beautiful blue skies. Great beach weather!'
    },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 84, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 81, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Thu', temp: 80, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 82, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Buenos Aires': {
    current: { 
      temp: 65, 
      condition: 'Cloudy', 
      humidity: 68, 
      wind: 11, 
      visibility: 7.8,
      uv: 3,
      icon: 'Cloud',
      localTime: generateLocalTime(-3),
      forecast: 'Mostly cloudy with occasional drizzle. Bring a light jacket or umbrella.'
    },
    forecast: [
      { day: 'Mon', temp: 64, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 63, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 67, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 68, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Johannesburg': {
    current: { 
      temp: 73, 
      condition: 'Sunny', 
      humidity: 45, 
      wind: 7, 
      visibility: 9.7,
      uv: 7,
      icon: 'Sun',
      localTime: generateLocalTime(2),
      forecast: 'Clear skies and warm temperatures. Cooling down in the evening.'
    },
    forecast: [
      { day: 'Mon', temp: 75, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 76, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 72, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 68, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 70, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Mumbai': {
    current: { 
      temp: 88, 
      condition: 'Rain', 
      humidity: 83, 
      wind: 9, 
      visibility: 4.0,
      uv: 3,
      icon: 'CloudRain',
      localTime: generateLocalTime(5.5),
      forecast: 'Monsoon rains continuing throughout the day with occasional heavy downpours.'
    },
    forecast: [
      { day: 'Mon', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 86, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 85, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 86, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 87, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  'Delhi': {
    current: { 
      temp: 95, 
      condition: 'Hot', 
      humidity: 50, 
      wind: 8, 
      visibility: 5.5,
      uv: 9,
      icon: 'Sun',
      localTime: generateLocalTime(5.5),
      forecast: 'Extremely hot and dry. Air quality is poor. Limit outdoor activities.'
    },
    forecast: [
      { day: 'Mon', temp: 97, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 98, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 96, condition: 'Hot', icon: 'Sun' },
      { day: 'Thu', temp: 94, condition: 'Hot', icon: 'Sun' },
      { day: 'Fri', temp: 93, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Toronto': {
    current: { 
      temp: 68, 
      condition: 'Partly Cloudy', 
      humidity: 62, 
      wind: 9, 
      visibility: 9.0,
      uv: 5,
      icon: 'Cloud',
      localTime: generateLocalTime(-4),
      forecast: 'Partly cloudy with comfortable temperatures. Perfect day for outdoor activities.'
    },
    forecast: [
      { day: 'Mon', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 69, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 65, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 67, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Melbourne': {
    current: { 
      temp: 60, 
      condition: 'Windy', 
      humidity: 58, 
      wind: 18, 
      visibility: 8.5,
      uv: 4,
      icon: 'Wind',
      localTime: generateLocalTime(10),
      forecast: 'Windy conditions with variable clouds. Temperatures feel cooler due to the wind.'
    },
    forecast: [
      { day: 'Mon', temp: 62, condition: 'Windy', icon: 'Wind' },
      { day: 'Tue', temp: 65, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 68, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 66, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 61, condition: 'Rain', icon: 'CloudRain' },
    ]
  },
  'Stockholm': {
    current: { 
      temp: 55, 
      condition: 'Cloudy', 
      humidity: 75, 
      wind: 10, 
      visibility: 6.5,
      uv: 2,
      icon: 'Cloud',
      localTime: generateLocalTime(2),
      forecast: 'Cloudy and cool with a chance of light rain. Bring a jacket when going out.'
    },
    forecast: [
      { day: 'Mon', temp: 54, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 53, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 56, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 58, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 57, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  'Cape Town': {
    current: { 
      temp: 66, 
      condition: 'Sunny', 
      humidity: 55, 
      wind: 12, 
      visibility: 9.8,
      uv: 6,
      icon: 'Sun',
      localTime: generateLocalTime(2),
      forecast: 'Clear skies with a gentle breeze. Beautiful day for exploring Table Mountain.'
    },
    forecast: [
      { day: 'Mon', temp: 68, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 67, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 65, condition: 'Windy', icon: 'Wind' },
      { day: 'Fri', temp: 66, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Athens': {
    current: { 
      temp: 82, 
      condition: 'Sunny', 
      humidity: 48, 
      wind: 7, 
      visibility: 10.0,
      uv: 8,
      icon: 'Sun',
      localTime: generateLocalTime(3),
      forecast: 'Hot and sunny with clear blue skies. Perfect Mediterranean weather.'
    },
    forecast: [
      { day: 'Mon', temp: 84, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 85, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 83, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 81, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 80, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Wellington': {
    current: { 
      temp: 57, 
      condition: 'Windy', 
      humidity: 72, 
      wind: 22, 
      visibility: 7.5,
      uv: 3,
      icon: 'Wind',
      localTime: generateLocalTime(12),
      forecast: 'Strong winds with occasional showers. The "Windy City" living up to its name.'
    },
    forecast: [
      { day: 'Mon', temp: 56, condition: 'Windy', icon: 'Wind' },
      { day: 'Tue', temp: 55, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 58, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 60, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 59, condition: 'Windy', icon: 'Wind' },
    ]
  },
  'Helsinki': {
    current: { 
      temp: 50, 
      condition: 'Cloudy', 
      humidity: 80, 
      wind: 12, 
      visibility: 5.5,
      uv: 2,
      icon: 'Cloud',
      localTime: generateLocalTime(3),
      forecast: 'Cool and cloudy with a chance of light rain. Typical Nordic spring weather.'
    },
    forecast: [
      { day: 'Mon', temp: 48, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 49, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 52, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 54, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 53, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  // Adding the requested African cities
  'Nairobi': {
    current: { 
      temp: 70, 
      condition: 'Partly Cloudy', 
      humidity: 65, 
      wind: 6, 
      visibility: 8.5,
      uv: 7,
      icon: 'Cloud',
      localTime: generateLocalTime(3),
      forecast: 'Partly cloudy with a chance of afternoon showers. Pleasant temperatures.'
    },
    forecast: [
      { day: 'Mon', temp: 72, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 74, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 71, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 69, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 72, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Kampala': {
    current: { 
      temp: 75, 
      condition: 'Partly Cloudy', 
      humidity: 70, 
      wind: 5, 
      visibility: 7.5,
      uv: 6,
      icon: 'Cloud',
      localTime: generateLocalTime(3),
      forecast: 'Partly cloudy with high humidity. Chance of isolated thunderstorms in the afternoon.'
    },
    forecast: [
      { day: 'Mon', temp: 76, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 77, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 74, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 73, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 75, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Lagos': {
    current: { 
      temp: 84, 
      condition: 'Hot', 
      humidity: 75, 
      wind: 8, 
      visibility: 6.0,
      uv: 8,
      icon: 'Sun',
      localTime: generateLocalTime(1),
      forecast: 'Hot and humid with a chance of afternoon showers. Typical tropical weather.'
    },
    forecast: [
      { day: 'Mon', temp: 85, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 86, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 84, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 83, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 85, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Casablanca': {
    current: { 
      temp: 72, 
      condition: 'Sunny', 
      humidity: 65, 
      wind: 10, 
      visibility: 9.0,
      uv: 7,
      icon: 'Sun',
      localTime: generateLocalTime(1),
      forecast: 'Sunny with a pleasant breeze from the Atlantic. Perfect weather for exploring the city.'
    },
    forecast: [
      { day: 'Mon', temp: 73, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 74, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 72, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 70, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 71, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Dar es Salaam': {
    current: { 
      temp: 82, 
      condition: 'Partly Cloudy', 
      humidity: 78, 
      wind: 7, 
      visibility: 7.0,
      uv: 8,
      icon: 'Cloud',
      localTime: generateLocalTime(3),
      forecast: 'Warm and humid with partly cloudy skies. Typical coastal tropical weather.'
    },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 84, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 81, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 80, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 82, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Kigali': {
    current: { 
      temp: 73, 
      condition: 'Sunny', 
      humidity: 60, 
      wind: 5, 
      visibility: 9.5,
      uv: 7,
      icon: 'Sun',
      localTime: generateLocalTime(2),
      forecast: 'Sunny with comfortable temperatures. The Land of a Thousand Hills enjoying beautiful weather.'
    },
    forecast: [
      { day: 'Mon', temp: 74, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 75, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 73, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 72, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 74, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Addis Ababa': {
    current: { 
      temp: 68, 
      condition: 'Partly Cloudy', 
      humidity: 55, 
      wind: 8, 
      visibility: 10.0,
      uv: 6,
      icon: 'Cloud',
      localTime: generateLocalTime(3),
      forecast: 'Mild temperatures with partly cloudy skies. Pleasant high-altitude climate.'
    },
    forecast: [
      { day: 'Mon', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 71, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 69, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 67, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 68, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Ouagadougou': {
    current: { 
      temp: 89, 
      condition: 'Hot', 
      humidity: 40, 
      wind: 7, 
      visibility: 8.5,
      uv: 9,
      icon: 'Sun',
      localTime: generateLocalTime(0),
      forecast: 'Hot and dry conditions with clear skies. Typical Sahel climate.'
    },
    forecast: [
      { day: 'Mon', temp: 90, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 91, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 89, condition: 'Hot', icon: 'Sun' },
      { day: 'Thu', temp: 88, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 90, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Bamako': {
    current: { 
      temp: 88, 
      condition: 'Hot', 
      humidity: 45, 
      wind: 6, 
      visibility: 7.0,
      uv: 8,
      icon: 'Sun',
      localTime: generateLocalTime(0),
      forecast: 'Hot and dry with occasional dust. Niger River provides some cooling effect.'
    },
    forecast: [
      { day: 'Mon', temp: 89, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 90, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 88, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 87, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 88, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Niamey': {
    current: { 
      temp: 91, 
      condition: 'Hot', 
      humidity: 35, 
      wind: 8, 
      visibility: 6.5,
      uv: 9,
      icon: 'Sun',
      localTime: generateLocalTime(1),
      forecast: 'Very hot and dry conditions with clear skies. Typical desert climate.'
    },
    forecast: [
      { day: 'Mon', temp: 92, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 93, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 91, condition: 'Hot', icon: 'Sun' },
      { day: 'Thu', temp: 90, condition: 'Hot', icon: 'Sun' },
      { day: 'Fri', temp: 92, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Lusaka': {
    current: { 
      temp: 76, 
      condition: 'Sunny', 
      humidity: 50, 
      wind: 6, 
      visibility: 9.0,
      uv: 7,
      icon: 'Sun',
      localTime: generateLocalTime(2),
      forecast: 'Sunny and pleasant with low humidity. Typical high plateau climate.'
    },
    forecast: [
      { day: 'Mon', temp: 77, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 78, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 75, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 74, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 76, condition: 'Sunny', icon: 'Sun' },
    ]
  },
};

export async function fetchWeatherData(city: string): Promise<WeatherData | null> {
  try {
    // In a real app, this would be an API call to a weather service
    // For now, we'll use the sample data
    if (weatherData[city as keyof typeof weatherData]) {
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      return weatherData[city as keyof typeof weatherData];
    }
    
    // If the city isn't in our sample data, return null
    // In a real app, this would be a call to the weather API
    toast.error(`Weather data for ${city} not available.`);
    return null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
}

export async function searchCities(query: string) {
  try {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would be an API call to search for cities
    // For now, we'll filter our sample data
    if (!query) return Object.keys(weatherData);
    
    return Object.keys(weatherData).filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching cities:", error);
    toast.error("Failed to search cities. Please try again later.");
    return [];
  }
}

export async function fetchFlightWeatherConditions() {
  try {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would fetch weather data specific to flight routes
    // For now, we'll return a subset of our sample data
    const flightRouteWeather = {
      'New York to London': weatherData['London'],
      'London to Dubai': weatherData['Dubai'],
      'Tokyo to Singapore': weatherData['Singapore'],
      'Sydney to Jakarta': weatherData['Jakarta'],
      'Bangkok to Dubai': weatherData['Dubai'],
      // Adding more flight routes for global cities
      'Singapore to Kuala Lumpur': weatherData['Kuala Lumpur'],
      'Jakarta to Bangkok': weatherData['Bangkok'],
      'Hong Kong to Shanghai': weatherData['Shanghai'],
      'Seoul to Tokyo': weatherData['Tokyo'],
      'Paris to Rome': weatherData['Rome'],
      'Cairo to Dubai': weatherData['Dubai'],
      'Toronto to Mexico City': weatherData['Mexico City'],
      'Rio de Janeiro to Buenos Aires': weatherData['Buenos Aires'],
      'Cape Town to Johannesburg': weatherData['Johannesburg'],
      'Delhi to Mumbai': weatherData['Mumbai'],
      'London to Paris': weatherData['Paris'],
      'Berlin to Stockholm': weatherData['Stockholm'],
      'Sydney to Wellington': weatherData['Wellington'],
      'Athens to Rome': weatherData['Rome'],
      'Helsinki to Stockholm': weatherData['Stockholm'],
    };
    
    return flightRouteWeather;
  } catch (error) {
    console.error("Error fetching flight weather conditions:", error);
    toast.error("Failed to fetch flight weather conditions. Please try again later.");
    return {};
  }
}
