
// OpenSky state and flight tracking logic
import type { Flight } from './shared/types';
import { getUserPosition } from './shared/apiUtils';

/**
 * Define the OpenSky API response structure
 */
export interface OpenSkyState {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  sensors: number[];
  geo_altitude: number;
  squawk: string;
  spi: boolean;
  position_source: number;
}

export interface OpenSkyResponse {
  time: number;
  states: (string | number | boolean | string[] | number[])[][];
}

/**
 * Fetch most tracked flights from OpenSky Network API
 */
export async function fetchMostTrackedFlights(): Promise<Flight[]> {
  try {
    const url = 'https://opensky-network.org/api/states/all';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const data = await response.json() as OpenSkyResponse;
    if (!data.states || data.states.length === 0) return [];
    const formattedData: Flight[] = data.states
      .filter(state => state[1] && state[2] && state[5] && state[6])
      .map(state => {
        const icao24 = state[0] as string;
        const callsign = state[1] as string;
        const originCountry = state[2] as string;
        const longitude = state[5] as number;
        const latitude = state[6] as number;
        const altitude = state[7] as number;
        const velocity = state[9] as number;
        const heading = state[10] as number;
        const verticalRate = state[11] as number;
        const onGround = state[8] as boolean;
        const squawk = state[14] as string;
        return {
          hex: icao24,
          flight_icao: callsign.trim(),
          flight_iata: callsign.trim(),
          lat: latitude,
          lng: longitude,
          alt: altitude,
          dir: heading,
          speed: velocity ? velocity * 1.94384 : undefined,
          v_speed: verticalRate,
          squawk: squawk,
          status: onGround ? 'on-ground' : 'en-route',
          airline_name: `${originCountry} operator`,
          reg_number: icao24,
          aircraft_icao: 'Unknown',
          dep_name: 'Unknown',
          dep_iata: 'N/A',
          arr_name: 'Unknown',
          arr_iata: 'N/A',
          dep_country: originCountry,
        };
      });
    return formattedData.sort((a, b) => (b.alt || 0) - (a.alt || 0)).slice(0, 100);
  } catch (error) {
    console.error("Error fetching flights from OpenSky:", error);
    throw error;
  }
}

/**
 * Fetch aircraft in a specific region using bounding box
 */
export async function fetchAircraftInRange(
  lamin: number,
  lomin: number,
  lamax: number,
  lomax: number
): Promise<Flight[]> {
  try {
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    const data = await response.json() as OpenSkyResponse;
    if (!data.states || data.states.length === 0) return [];
    const formattedData: Flight[] = data.states
      .filter(state => state[1] && state[2] && state[5] && state[6])
      .map(state => {
        const icao24 = state[0] as string;
        const callsign = state[1] as string;
        const originCountry = state[2] as string;
        const longitude = state[5] as number;
        const latitude = state[6] as number;
        const altitude = state[7] as number;
        const velocity = state[9] as number;
        const heading = state[10] as number;
        const verticalRate = state[11] as number;
        const onGround = state[8] as boolean;
        const squawk = state[14] as string;
        return {
          hex: icao24,
          flight_icao: callsign.trim(),
          flight_iata: callsign.trim(),
          lat: latitude,
          lng: longitude,
          alt: altitude,
          dir: heading,
          speed: velocity ? velocity * 1.94384 : undefined,
          v_speed: verticalRate,
          squawk: squawk,
          status: onGround ? 'on-ground' : 'en-route',
          airline_name: `${originCountry} operator`,
          reg_number: icao24,
          aircraft_icao: 'Unknown',
          dep_country: originCountry,
        };
      });
    return formattedData;
  } catch (error) {
    console.error("Error fetching aircraft in range:", error);
    throw error;
  }
}

/**
 * Fetch aircraft nearby current user
 */
export async function fetchNearbyAircraft(): Promise<Flight[]> {
  try {
    const position = await getUserPosition();
    const lat = position.lat;
    const lng = position.lng;
    const latOffset = 1.8;
    const lngOffset = 1.8 / Math.cos(lat * (Math.PI / 180));
    return fetchAircraftInRange(
      lat - latOffset, 
      lng - lngOffset, 
      lat + latOffset, 
      lng + lngOffset
    );
  } catch (error) {
    console.error("Error fetching nearby aircraft:", error);
    throw error;
  }
}
