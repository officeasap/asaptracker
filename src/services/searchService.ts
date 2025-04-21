
import { fetchAirports } from './airportService';
import { fetchAirlines } from './airlineService';

/**
 * Suggest result type for autocomplete or unified search
 */
export interface SuggestResult {
  name: string;
  iata_code: string;
  icao_code: string;
  city?: string;
  country?: string;
  country_code?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  type: 'airport' | 'airline';
}

export async function fetchSuggestions(query: string): Promise<SuggestResult[]> {
  if (!query || query.length < 2) {
    return [];
  }
  // Fetch airport and airline suggestions
  const [airports, airlines] = await Promise.all([
    fetchAirports({ search: query }),
    fetchAirlines({ search: query }),
  ]);
  const airportResults = airports.map(a => ({
    name: a.name,
    iata_code: a.iata_code || a.iata,
    icao_code: a.icao_code || a.icao,
    city: a.city,
    country: a.country,
    country_code: a.country_code,
    lat: a.lat,
    lon: a.lon,
    timezone: a.timezone,
    type: 'airport' as const
  }));
  const airlineResults = airlines.map(al => ({
    name: al.name,
    iata_code: al.iata_code,
    icao_code: al.icao_code,
    country_code: al.country_code,
    type: 'airline' as const,
  }));
  return [...airportResults, ...airlineResults];
}
