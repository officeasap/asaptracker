
import { toast } from "sonner";
import { fetchWithCache } from "./shared/apiUtils";
import { fetchAirlineByIATA } from "./airlineService";
import type { Flight } from "./shared/types";

export async function fetchLiveFlights(params: Record<string, string> = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://littleboy-dun.vercel.app/api/tracker${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching live flights from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Tracker API Response:', data);
    
    if (Array.isArray(data) && data.length > 0) {
      return await enhanceFlightData(data as Flight[]);
    }
    
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching live flights:", error);
    toast.error("Failed to fetch flight data. Please try again later.");
    return [];
  }
}

export async function fetchFlightSchedules(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("schedules", params);
    if (Array.isArray(data) && data.length > 0) {
      return await enhanceFlightData(data as Flight[]);
    }
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching flight schedules:", error);
    toast.error("Failed to fetch flight schedules. Please try again later.");
    return [];
  }
}

export async function enhanceFlightData(flights: Flight[]): Promise<Flight[]> {
  if (!flights || flights.length === 0) return flights;
  
  const airlinesToFetch = flights
    .filter(flight => !flight.airline_name && (flight.airline_iata || flight.airline?.iata))
    .map(flight => flight.airline_iata || flight.airline?.iata || "");
  
  const uniqueIatas = [...new Set(airlinesToFetch)];
  
  await Promise.all(
    uniqueIatas.map(iata => fetchAirlineByIATA(iata))
  );
  
  return flights;
}

export async function fetchFlightStatus(flightIata: string) {
  try {
    const data = await fetchWithCache("flight", { flight_iata: flightIata });
    if (data) {
      const iataCode = data.airline_iata || data.airline?.iata || "";
      if (!data.airline_name && iataCode) {
        const airlineName = await fetchAirlineByIATA(iataCode);
        return {
          ...data,
          airline_name: airlineName
        } as Flight;
      }
    }
    return data as Flight;
  } catch (error) {
    console.error("Error fetching flight status:", error);
    toast.error("Failed to fetch flight status. Please try again later.");
    return null;
  }
}

export async function fetchFlightsByReason(reason: string) {
  const reasonMap: Record<string, string> = {
    "Weather": "weather",
    "Technical": "technical",
    "Air Traffic": "air_traffic"
  };
  
  return fetchLiveFlights({
    status: "delayed",
    delay_reason: reasonMap[reason] || ""
  });
}

export async function fetchFlightsByStatus(status: string) {
  return fetchLiveFlights({
    status: status.toLowerCase()
  });
}

export async function searchFlight(query: string) {
  if (!query) return [];
  
  if (/^[A-Z0-9]{2}\d+$/i.test(query)) {
    return fetchLiveFlights({
      flight_iata: query.toUpperCase()
    });
  } else {
    return fetchLiveFlights({
      dep_iata: query.toUpperCase()
    });
  }
}
