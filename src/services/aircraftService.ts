
import { toast } from "sonner";
import { fetchWithCache } from "./shared/apiUtils";

// Define the Aircraft type
export interface Aircraft {
  manufacturer: string;
  model: string;
  type: string;
  engine_count: number;
  engine_type: string;
  max_speed: string;
  ceiling: string;
  range: string;
  length: string;
  wingspan: string;
  height: string;
  empty_weight: string;
  max_takeoff_weight: string;
  seat_capacity: string;
  description: string;
}

const aircraftData: Record<string, Aircraft> = {
  "Airbus A380": {
    manufacturer: "Airbus",
    model: "A380",
    type: "Wide-body",
    engine_count: 4,
    engine_type: "Turbofan",
    max_speed: "945 km/h",
    ceiling: "43,000 ft",
    range: "14,800 km",
    length: "72.72 m",
    wingspan: "79.75 m",
    height: "24.09 m",
    empty_weight: "285,000 kg",
    max_takeoff_weight: "575,000 kg",
    seat_capacity: "525 (typical 3-class), 853 (maximum)",
    description: "The Airbus A380 is a double-deck, wide-body, four-engine jet airliner manufactured by Airbus. It is the world's largest passenger airliner."
  },
  "Boeing 747": {
    manufacturer: "Boeing",
    model: "747-8",
    type: "Wide-body",
    engine_count: 4,
    engine_type: "Turbofan",
    max_speed: "988 km/h",
    ceiling: "43,100 ft",
    range: "14,320 km",
    length: "76.3 m",
    wingspan: "68.4 m",
    height: "19.4 m",
    empty_weight: "220,128 kg",
    max_takeoff_weight: "447,696 kg",
    seat_capacity: "410 (typical 3-class), 605 (maximum)",
    description: "The Boeing 747 is an American wide-body commercial jet airliner and cargo aircraft. Its distinctive hump upper deck along the forward part of the aircraft has made it one of the most recognizable aircraft."
  },
  "Boeing 777": {
    manufacturer: "Boeing",
    model: "777-300ER",
    type: "Wide-body",
    engine_count: 2,
    engine_type: "Turbofan",
    max_speed: "950 km/h",
    ceiling: "43,100 ft",
    range: "13,650 km",
    length: "73.9 m",
    wingspan: "64.8 m",
    height: "18.5 m",
    empty_weight: "167,800 kg",
    max_takeoff_weight: "351,500 kg",
    seat_capacity: "386 (typical 3-class), 550 (maximum)",
    description: "The Boeing 777 is a family of long-range wide-body twin-engine jet airliners. It is the world's largest twinjet."
  },
  "Airbus A350": {
    manufacturer: "Airbus",
    model: "A350-900",
    type: "Wide-body",
    engine_count: 2,
    engine_type: "Turbofan",
    max_speed: "945 km/h",
    ceiling: "43,100 ft",
    range: "15,000 km",
    length: "66.8 m",
    wingspan: "64.75 m",
    height: "17.05 m",
    empty_weight: "145,000 kg",
    max_takeoff_weight: "280,000 kg",
    seat_capacity: "325 (typical 3-class), 440 (maximum)",
    description: "The Airbus A350 XWB is a family of long-range, twin-engine wide-body jet airliners developed by Airbus. The A350 is the first Airbus aircraft with both fuselage and wing structures made primarily of carbon fiber reinforced polymer."
  },
  "Boeing 787": {
    manufacturer: "Boeing",
    model: "787-9 Dreamliner",
    type: "Wide-body",
    engine_count: 2,
    engine_type: "Turbofan",
    max_speed: "954 km/h",
    ceiling: "43,000 ft",
    range: "14,140 km",
    length: "63 m",
    wingspan: "60 m",
    height: "17 m",
    empty_weight: "128,850 kg",
    max_takeoff_weight: "254,011 kg",
    seat_capacity: "290 (typical 3-class), 420 (maximum)",
    description: "The Boeing 787 Dreamliner is an American long-haul, mid-size wide-body, twin-engine jet airliner. Its features include electrical flight systems, raked wingtips, and noise-reducing chevrons on its engine nacelles."
  },
  "Airbus A330": {
    manufacturer: "Airbus",
    model: "A330-300",
    type: "Wide-body",
    engine_count: 2,
    engine_type: "Turbofan",
    max_speed: "871 km/h",
    ceiling: "41,450 ft",
    range: "11,750 km",
    length: "63.69 m",
    wingspan: "60.3 m",
    height: "16.79 m",
    empty_weight: "124,500 kg",
    max_takeoff_weight: "242,000 kg",
    seat_capacity: "277 (typical 3-class), 440 (maximum)",
    description: "The Airbus A330 is a medium-to-long-range wide-body twin-engine jet airliner made by Airbus. Versions of the A330 have a range of 5,600 to 13,430 kilometers and can accommodate up to 335 passengers in a two-class layout."
  }
};

/**
 * Fetch aircraft specifications by model name
 */
export async function fetchAircraftSpecifications(modelName: string): Promise<Aircraft | null> {
  try {
    // In a production environment, we would call AviationStack API
    // For this demo, we'll use our predefined data
    const aircraft = aircraftData[modelName];
    
    if (aircraft) {
      return aircraft;
    }
    
    toast.error(`Aircraft specifications for ${modelName} not found`);
    return null;
  } catch (error) {
    console.error("Error fetching aircraft specifications:", error);
    toast.error("Failed to load aircraft specifications");
    return null;
  }
}

/**
 * Fetch route details by origin and destination
 */
export interface RouteDetails {
  from_airport: string;
  to_airport: string;
  distance: string;
  duration: string;
  airlines: string[];
  frequency: string;
  avg_price: string;
  time_zones: string;
  direct_flights: number;
}

export async function fetchRouteDetails(fromCode: string, toCode: string): Promise<RouteDetails | null> {
  try {
    // In a production environment, we would call AviationStack API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const routeMockData: Record<string, RouteDetails> = {
      "CGKSIN": {
        from_airport: "Jakarta (CGK)",
        to_airport: "Singapore (SIN)",
        distance: "880 km",
        duration: "1h 45m",
        airlines: ["Garuda Indonesia", "Singapore Airlines", "Lion Air", "Batik Air"],
        frequency: "Multiple flights daily",
        avg_price: "$150-250 USD",
        time_zones: "1 hour difference (GMT+7 to GMT+8)",
        direct_flights: 12
      },
      "SINHKG": {
        from_airport: "Singapore (SIN)",
        to_airport: "Hong Kong (HKG)",
        distance: "2,570 km",
        duration: "3h 55m",
        airlines: ["Singapore Airlines", "Cathay Pacific", "Scoot"],
        frequency: "Multiple flights daily",
        avg_price: "$300-450 USD",
        time_zones: "No time difference (GMT+8)",
        direct_flights: 8
      },
      // Add other routes data here
    };
    
    const routeKey = `${fromCode}${toCode}`;
    const route = routeMockData[routeKey];
    
    if (route) {
      return route;
    }
    
    return {
      from_airport: fromCode,
      to_airport: toCode,
      distance: "Varies",
      duration: "Varies",
      airlines: ["Multiple airlines"],
      frequency: "Check with airlines",
      avg_price: "Varies by season and demand",
      time_zones: "Check local time zones",
      direct_flights: 0
    };
  } catch (error) {
    console.error("Error fetching route details:", error);
    toast.error("Failed to load route details");
    return null;
  }
}

/**
 * Fetch aviation tax details by code
 */
export interface AvTaxDetail {
  code: string;
  name: string;
  range: string;
  description: string;
  countries: string[];
  examples: {
    country: string;
    amount: string;
  }[];
}

export async function fetchAviationTaxDetails(taxCode: string): Promise<AvTaxDetail | null> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const taxMockData: Record<string, AvTaxDetail> = {
      "PSC": {
        code: "PSC",
        name: "Passenger Service Charge",
        range: "$15-30",
        description: "Fee charged for the use of airport facilities and services",
        countries: ["Singapore", "Indonesia", "Malaysia", "Thailand", "Philippines"],
        examples: [
          { country: "Singapore", amount: "SGD 35.40" },
          { country: "Indonesia", amount: "IDR 150,000" },
          { country: "Malaysia", amount: "MYR 35" }
        ]
      },
      "SSC": {
        code: "SSC",
        name: "Security Service Charge",
        range: "$5-15",
        description: "Fee for security screening at airports",
        countries: ["Global", "EU Countries", "ASEAN"],
        examples: [
          { country: "Singapore", amount: "SGD 8" },
          { country: "UK", amount: "GBP 10" },
          { country: "USA", amount: "USD 5.60" }
        ]
      },
      // Add other tax data
    };
    
    const taxDetail = taxMockData[taxCode];
    
    if (taxDetail) {
      return taxDetail;
    }
    
    toast.error(`Tax details for ${taxCode} not found`);
    return null;
  } catch (error) {
    console.error("Error fetching aviation tax details:", error);
    toast.error("Failed to load tax details");
    return null;
  }
}
