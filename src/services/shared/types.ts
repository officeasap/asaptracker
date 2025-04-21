
export interface Flight {
  hex?: string;
  reg_number?: string;
  flag?: string;
  lat?: number;
  lng?: number;
  alt?: number;
  dir?: number;
  speed?: number;
  v_speed?: number;
  squawk?: string;
  flight_number?: string;
  flight_icao?: string;
  flight_iata?: string;
  dep_icao?: string;
  dep_iata?: string;
  arr_icao?: string;
  arr_iata?: string;
  airline_icao?: string;
  airline_iata?: string;
  aircraft_icao?: string;
  updated?: number;
  status?: string;
  
  dep_time?: string;
  arr_time?: string;
  duration?: number;
  delayed?: number;
  dep_delayed?: number;
  arr_delayed?: number;
  aircraft_icao24?: string;
  day_of_week?: number;
  
  dep_name?: string;
  dep_city?: string;
  dep_country?: string;
  arr_name?: string;
  arr_city?: string;
  arr_country?: string;
  airline_name?: string;
  dep_terminal?: string;
  dep_gate?: string;
  arr_terminal?: string;
  arr_gate?: string;
  dep_time_utc?: string;
  arr_time_utc?: string;
  dep_actual?: string;
  arr_actual?: string;
  dep_estimated?: string;
  arr_estimated?: string;
  
  flight?: {
    iata?: string;
    icao?: string;
    number?: string;
  };
  airline?: {
    name?: string;
    iata?: string;
    icao?: string;
  };
  departure?: {
    airport?: string;
    timezone?: string;
    iata?: string;
    icao?: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    scheduled?: string;
    estimated?: string;
    actual?: string;
  };
  arrival?: {
    airport?: string;
    timezone?: string;
    iata?: string;
    icao?: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    scheduled?: string;
    estimated?: string;
    actual?: string;
  };
  flight_date?: string;
  flight_status?: string;
}

export interface Airport {
  id: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  lat: number;
  lon: number;
  alt: number;
  timezone: string;
  
  iata_code?: string;
  icao_code?: string;
  country_code?: string;
  distance?: number;
}

export interface Airline {
  name: string;
  iata_code: string;
  icao_code: string;
  fleet_size?: number;
  fleet_average_age?: number;
  country_code?: string;
  country_name?: string;
  callsign?: string;
  logo?: string;
}

export interface City {
  name: string;
  city_code: string;
  lat: number;
  lng: number;
  country_code: string;
  timezone?: string;
  gmt?: string;
  phone_prefix?: string;
  population?: number;
}

export interface Country {
  code: string;
  code3: string;
  name: string;
  continent: string;
  capital: string;
  phone_prefix: string;
  currency_code: string;
  currency_name: string;
}

export interface Timezone {
  name: string;
  city_code: string;
  gmt: string;
  offset: number;
}

export interface Tax {
  name: string;
  country_code: string;
  description: string;
  tax_id: string;
}

export interface Fleet {
  hex: string;
  reg_number: string;
  flag: string;
  lat?: number;
  lng?: number;
  alt?: number;
  heading?: number;
  aircraft_icao: string;
  airline_icao?: string;
  airline_iata?: string;
  airline_name?: string;
  status?: string;
}

export interface Route {
  airline_icao: string;
  airline_iata: string;
  flight_number: string;
  flight_iata: string;
  flight_icao: string;
  dep_iata: string;
  dep_icao: string;
  arr_iata: string;
  arr_icao: string;
  cs_airline_iata?: string;
  cs_flight_number?: string;
  cs_flight_iata?: string;
}

export interface SuggestResult {
  name: string;
  city?: string;
  iata_code?: string;
  icao_code?: string;
  country_code?: string;
  type: "airport" | "city" | "airline";
  lat?: number;
  lon?: number;
  // These properties are for backwards compatibility
  latitude?: number;
  longitude?: number;
  country?: string;
}

