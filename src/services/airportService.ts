import { toast } from "sonner";
import { fetchWithCache, AIRPORT_CACHE_DURATION } from "./shared/apiUtils";
import type { Airport } from "./shared/types";

interface AirportCache {
  data: Airport[];
  timestamp: number;
  isComprehensive: boolean;
}

const airportCache: AirportCache = {
  data: [],
  timestamp: 0,
  isComprehensive: false
};

export async function fetchAirports(params: Record<string, string> = {}) {
  try {
    // Always request comprehensive data unless specifically filtered
    const queryParams = {
      ...params,
      comprehensive: "true",
      limit: params.limit || "1000" // Increased limit for global coverage
    };

    const data = await fetchWithCache("airports", queryParams);
    if (!data || !Array.isArray(data)) {
      console.error("Invalid response format for airports", data);
      return [];
    }
    console.log(`Fetched ${data.length} airports with params:`, queryParams);
    return data as Airport[];
  } catch (error) {
    console.error("Error fetching airports:", error);
    toast.error("Failed to fetch airport data. Please try again later.");
    return [];
  }
}

export async function fetchAirportByIATA(iata: string): Promise<Airport | null> {
  if (!iata) return null;
  
  const formattedCode = iata.trim().toUpperCase();
  if (formattedCode.length !== 3) {
    console.warn("Invalid IATA code format:", iata);
    return null;
  }
  
  try {
    const res = await fetch(`https://littleboy-dun.vercel.app/api/airports?iata=${formattedCode}`);
    if (!res.ok) throw new Error("Failed to fetch airport data");
    const data = await res.json();
    
    if (data) {
      return {
        ...data,
        iata_code: data.iata,
        icao_code: data.icao,
        country_code: data.country_code || data.country.substring(0, 2),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching airport by IATA ${formattedCode}:`, error);
    throw error;
  }
}

export async function searchAirportByIATA(iataCode: string): Promise<Airport[]> {
  try {
    console.log('Searching airport by IATA:', iataCode);
    const url = `https://littleboy-dun.vercel.app/api/airports?iata=${iataCode}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Airport search failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Airport search response:', data);
    
    if (Array.isArray(data)) {
      return data.map(airport => ({
        ...airport,
        iata_code: airport.iata_code || airport.iata,
        icao_code: airport.icao_code || airport.icao,
        country_code: airport.country_code || (airport.country ? airport.country.substring(0, 2) : '')
      }));
    }
    
    if (data && typeof data === 'object') {
      return [{
        ...data,
        iata_code: data.iata_code || data.iata,
        icao_code: data.icao_code || data.icao,
        country_code: data.country_code || (data.country ? data.country.substring(0, 2) : '')
      }];
    }
    
    return [];
  } catch (error) {
    console.error('Error searching airport by IATA:', error);
    throw error;
  }
}

export async function fetchNearbyAirports(lat: number, lng: number, distance: number = 100) {
  try {
    const data = await fetchWithCache("nearby", {
      lat: lat.toString(),
      lng: lng.toString(),
      distance: distance.toString()
    });
    
    if (Array.isArray(data)) {
      return data.map(airport => ({
        ...airport,
        iata_code: airport.iata_code || airport.iata,
        icao_code: airport.icao_code || airport.icao,
        country_code: airport.country_code || (airport.country ? airport.country.substring(0, 2) : '')
      })) as Airport[];
    }
    
    return data as Airport[];
  } catch (error) {
    console.error("Error fetching nearby airports:", error);
    toast.error("Failed to fetch nearby airports. Please try again later.");
    return [];
  }
}

export async function fetchComprehensiveAirports(): Promise<Airport[]> {
  try {
    if (airportCache.isComprehensive && 
        Date.now() - airportCache.timestamp < AIRPORT_CACHE_DURATION) {
      console.log(`Using cached comprehensive airports (${airportCache.data.length} items)`);
      return airportCache.data;
    }
    
    console.log('Fetching comprehensive global airport data...');
    const params = {
      comprehensive: "true",
      limit: "2000" // Increased limit for truly global coverage
    };
    
    const data = await fetchWithCache("airports", params);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`Successfully fetched ${data.length} airports globally`);
      airportCache.data = data;
      airportCache.timestamp = Date.now();
      airportCache.isComprehensive = true;
      
      return data;
    }
    
    console.error('Comprehensive airport data is not an array or is empty:', data);
    return [];
  } catch (error) {
    console.error("Error fetching comprehensive airports:", error);
    toast.error("Failed to fetch global airport data. Please try again later.");
    return [];
  }
}

export async function searchAirportsByRegion(
  region: string, 
  limit: number = 50
): Promise<Airport[]> {
  try {
    let airports: Airport[] = [];
    
    if (airportCache.isComprehensive && 
        Date.now() - airportCache.timestamp < AIRPORT_CACHE_DURATION) {
      airports = airportCache.data;
    } else {
      airports = await fetchComprehensiveAirports();
    }
    
    const filteredAirports = airports.filter(airport => {
      const countryCode = airport.country_code?.toLowerCase() || '';
      const city = airport.city?.toLowerCase() || '';
      const name = airport.name.toLowerCase();
      const searchTermLower = region.toLowerCase();
      
      return countryCode.includes(searchTermLower) || 
             city.includes(searchTermLower) || 
             name.includes(searchTermLower);
    });
    
    return filteredAirports.slice(0, limit);
  } catch (error) {
    console.error("Error searching airports by region:", error);
    toast.error("Failed to search airports by region. Please try again later.");
    return [];
  }
}
