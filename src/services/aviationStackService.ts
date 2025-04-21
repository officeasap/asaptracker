
import { toast } from "sonner";

// AviationStack API key and base URL
const AVIATION_STACK_API_KEY = "c1e20070cd11b45c048c0f3ac887377e";
const AVIATION_STACK_BASE_URL = "https://api.aviationstack.com/v1";

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Generic function to fetch data from AviationStack API
 */
export async function fetchFromAviationStack(
  endpoint: string,
  params: Record<string, string> = {}
) {
  try {
    // Build cache key based on endpoint and params
    const cacheKey = `aviationstack_${endpoint}_${JSON.stringify(params)}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    // Use cache if available and not expired
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        
        if (cacheAge < CACHE_DURATION) {
          console.log(`Using cached data for ${endpoint}`, params);
          return data;
        }
      } catch (e) {
        console.error("Cache parsing error:", e);
        // Continue to fetch fresh data if cache is corrupted
      }
    }
    
    // Build query string with API key and additional params
    const queryParams = new URLSearchParams({
      access_key: AVIATION_STACK_API_KEY,
      ...params
    });
    
    const url = `${AVIATION_STACK_BASE_URL}/${endpoint}?${queryParams.toString()}`;
    console.log(`Fetching from AviationStack API: ${endpoint}`, params);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`AviationStack API request failed with status ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // Cache the fresh data
    localStorage.setItem(cacheKey, JSON.stringify({
      data: responseData,
      timestamp: Date.now()
    }));
    
    return responseData;
  } catch (error) {
    console.error(`Error fetching from AviationStack API (${endpoint}):`, error);
    toast.error(`Failed to fetch ${endpoint} data. Please try again later.`);
    throw error;
  }
}

/**
 * Types for AviationStack API responses
 */
export interface AviationStackPagination {
  limit: number;
  offset: number;
  count: number;
  total: number;
}

export interface AviationStackResponse<T> {
  pagination: AviationStackPagination;
  data: T[];
}

export interface AviationStackFlight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: {
      airline_name: string;
      airline_iata: string;
      airline_icao: string;
      flight_number: string;
      flight_iata: string;
      flight_icao: string;
    } | null;
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  } | null;
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  } | null;
}

export interface AviationStackAirport {
  airport_name: string;
  iata_code: string;
  icao_code: string;
  latitude: number;
  longitude: number;
  geoname_id: string;
  timezone: string;
  gmt: string;
  phone_number: string | null;
  country_name: string;
  country_iso2: string;
  city_iata_code: string;
}

export interface AviationStackAirline {
  airline_name: string;
  airline_iata: string;
  airline_icao: string | null;
  airline_country: string | null;
  fleet_size: number | null;
  fleet_average_age: number | null;
  date_founded: number | null;
  iata_prefix_accounting: number | null;
  airline_callsign: string | null;
  airline_type: string | null;
  status: string;
}

export interface AviationStackCity {
  city_name: string;
  iata_code: string;
  country_iso2: string;
  latitude: number;
  longitude: number;
  timezone: string;
  gmt: string;
  geoname_id: number;
}

export interface AviationStackCountry {
  country_name: string;
  country_iso2: string;
  country_iso3: string;
  country_iso_numeric: number;
  population: number;
  capital: string;
  continent: string;
  currency_name: string;
  currency_code: string;
  fips_code: string;
  phone_prefix: string;
}

/**
 * Fetch real-time flights
 */
export async function fetchRealTimeFlights(params: Record<string, string> = {}) {
  try {
    const response = await fetchFromAviationStack('flights', params);
    return response as AviationStackResponse<AviationStackFlight>;
  } catch (error) {
    console.error('Error fetching real-time flights:', error);
    return { pagination: { limit: 0, offset: 0, count: 0, total: 0 }, data: [] };
  }
}

/**
 * Fetch flights by flight number
 */
export async function fetchFlightByNumber(flightIata: string) {
  if (!flightIata) {
    toast.error('Please enter a valid flight number');
    return null;
  }
  
  try {
    const response = await fetchFromAviationStack('flights', { 
      flight_iata: flightIata 
    });
    
    return response as AviationStackResponse<AviationStackFlight>;
  } catch (error) {
    console.error('Error fetching flight by number:', error);
    return null;
  }
}

/**
 * Fetch flights by route (departure and arrival airports)
 */
export async function fetchFlightsByRoute(depIata?: string, arrIata?: string) {
  const params: Record<string, string> = {};
  
  if (depIata) params.dep_iata = depIata;
  if (arrIata) params.arr_iata = arrIata;
  
  try {
    const response = await fetchFromAviationStack('flights', params);
    return response as AviationStackResponse<AviationStackFlight>;
  } catch (error) {
    console.error('Error fetching flights by route:', error);
    return { pagination: { limit: 0, offset: 0, count: 0, total: 0 }, data: [] };
  }
}

/**
 * Fetch airports
 */
export async function fetchAirports(params: Record<string, string> = {}) {
  try {
    const response = await fetchFromAviationStack('airports', params);
    return response as AviationStackResponse<AviationStackAirport>;
  } catch (error) {
    console.error('Error fetching airports:', error);
    return { pagination: { limit: 0, offset: 0, count: 0, total: 0 }, data: [] };
  }
}

/**
 * Fetch airport by IATA code
 */
export async function fetchAirportByIATA(iataCode: string) {
  if (!iataCode) {
    toast.error('Please enter a valid IATA code');
    return null;
  }
  
  try {
    const response = await fetchFromAviationStack('airports', { 
      iata_code: iataCode 
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0] as AviationStackAirport;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching airport by IATA:', error);
    return null;
  }
}

/**
 * Fetch airlines
 */
export async function fetchAirlines(params: Record<string, string> = {}) {
  try {
    const response = await fetchFromAviationStack('airlines', params);
    return response as AviationStackResponse<AviationStackAirline>;
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return { pagination: { limit: 0, offset: 0, count: 0, total: 0 }, data: [] };
  }
}

/**
 * Fetch airline by IATA code
 */
export async function fetchAirlineByIATA(iataCode: string) {
  if (!iataCode) {
    return null;
  }
  
  try {
    const response = await fetchFromAviationStack('airlines', { 
      airline_iata: iataCode 
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0] as AviationStackAirline;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching airline by IATA:', error);
    return null;
  }
}

/**
 * Fetch cities
 */
export async function fetchCities(params: Record<string, string> = {}) {
  try {
    const response = await fetchFromAviationStack('cities', params);
    return response as AviationStackResponse<AviationStackCity>;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return { pagination: { limit: 0, offset: 0, count: 0, total: 0 }, data: [] };
  }
}

/**
 * Fetch countries
 */
export async function fetchCountries(params: Record<string, string> = {}) {
  try {
    const response = await fetchFromAviationStack('countries', params);
    return response as AviationStackResponse<AviationStackCountry>;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return { pagination: { limit: 0, offset: 0, count: 0, total: 0 }, data: [] };
  }
}

/**
 * Convert AviationStack data format to the app's internal format for compatibility
 */
export function convertAviationStackFlightToInternalFormat(flight: AviationStackFlight) {
  return {
    flight_number: flight.flight.number,
    flight_iata: flight.flight.iata,
    flight_icao: flight.flight.icao,
    airline_name: flight.airline.name,
    airline_iata: flight.airline.iata,
    airline_icao: flight.airline.icao,
    dep_iata: flight.departure.iata,
    dep_icao: flight.departure.icao,
    dep_name: flight.departure.airport,
    dep_time: flight.departure.scheduled,
    dep_terminal: flight.departure.terminal,
    dep_gate: flight.departure.gate,
    dep_delayed: flight.departure.delay,
    arr_iata: flight.arrival.iata,
    arr_icao: flight.arrival.icao,
    arr_name: flight.arrival.airport,
    arr_time: flight.arrival.scheduled,
    arr_terminal: flight.arrival.terminal,
    arr_gate: flight.arrival.gate,
    arr_delayed: flight.arrival.delay,
    status: flight.flight_status,
    flight_date: flight.flight_date,
    // Live flight data if available
    ...(flight.live ? {
      lat: flight.live.latitude,
      lng: flight.live.longitude,
      alt: flight.live.altitude,
      dir: flight.live.direction,
      speed: flight.live.speed_horizontal,
      v_speed: flight.live.speed_vertical,
      updated: new Date(flight.live.updated).getTime() / 1000
    } : {})
  };
}

/**
 * Utility function to convert AviationStack Airport to SuggestResult
 */
export function convertAirportToSuggestResult(airport: AviationStackAirport) {
  return {
    name: airport.airport_name,
    city: airport.city_iata_code,
    iata_code: airport.iata_code,
    icao_code: airport.icao_code,
    country_code: airport.country_iso2,
    type: "airport" as const,
    lat: airport.latitude,
    lon: airport.longitude
  };
}

/**
 * Utility function to convert AviationStack Airline to SuggestResult
 */
export function convertAirlineToSuggestResult(airline: AviationStackAirline) {
  return {
    name: airline.airline_name,
    iata_code: airline.airline_iata,
    icao_code: airline.airline_icao || '',
    country_code: airline.airline_country || '',
    type: "airline" as const
  };
}

/**
 * Search airports and airlines (for autocomplete)
 */
export async function searchAirportsAndAirlines(query: string) {
  if (!query || query.length < 2) {
    return [];
  }
  
  try {
    // Search for airports by name or code
    const airportsPromise = fetchAirports({ 
      search: query 
    });
    
    // Search for airlines by name or code
    const airlinesPromise = fetchAirlines({ 
      search: query 
    });
    
    const [airportsResponse, airlinesResponse] = await Promise.all([
      airportsPromise,
      airlinesPromise
    ]);
    
    // Convert to SuggestResult format for compatibility
    const airportResults = airportsResponse.data.map(convertAirportToSuggestResult);
    const airlineResults = airlinesResponse.data.map(convertAirlineToSuggestResult);
    
    // Combine and return results
    return [...airportResults, ...airlineResults];
  } catch (error) {
    console.error('Error searching airports and airlines:', error);
    return [];
  }
}

/**
 * Get arrivals/departures for an airport
 */
export async function fetchArrivalsDepartures(type: 'arrivals' | 'departures', airportIata: string) {
  if (!airportIata) {
    toast.error('Please specify an airport IATA code');
    return [];
  }
  
  const params: Record<string, string> = {};
  
  if (type === 'arrivals') {
    params.arr_iata = airportIata;
  } else {
    params.dep_iata = airportIata;
  }
  
  try {
    const response = await fetchFromAviationStack('flights', params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} for airport ${airportIata}:`, error);
    return [];
  }
}
