
import React, { useState, useEffect } from 'react';
import { Plane, Search, ArrowDownUp, Filter, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { 
  fetchFlightSchedules, 
  fetchLiveFlights,
  fetchSuggestions,
  SuggestResult,
  Flight
} from '@/services/aviationService';
import AutocompleteSearch from './AutocompleteSearch';

// Sample flight data for initial display
const sampleFlights = [
  { id: 'BA2490', airline: 'British Airways', destination: 'London', time: '08:45', status: 'On Time', gate: 'A22' },
  { id: 'EK203', airline: 'Emirates', destination: 'Dubai', time: '09:15', status: 'Boarding', gate: 'C10' },
  { id: 'LH723', airline: 'Lufthansa', destination: 'Frankfurt', time: '09:30', status: 'Delayed', gate: 'B15' },
  { id: 'AF1680', airline: 'Air France', destination: 'Paris', time: '10:00', status: 'On Time', gate: 'D05' },
  { id: 'SQ321', airline: 'Singapore Airlines', destination: 'Singapore', time: '10:15', status: 'On Time', gate: 'C18' },
  { id: 'UA901', airline: 'United Airlines', destination: 'New York', time: '10:45', status: 'Delayed', gate: 'B08' },
  { id: 'QR160', airline: 'Qatar Airways', destination: 'Doha', time: '11:30', status: 'On Time', gate: 'A33' },
  { id: 'JL044', airline: 'Japan Airlines', destination: 'Tokyo', time: '12:00', status: 'Boarding', gate: 'D12' },
];

interface FlightData {
  id: string;
  airline: string;
  destination: string;
  time: string;
  status: string;
  gate: string;
}

type SortField = 'airline' | 'delay' | 'origin' | 'destination' | 'time';
type SortOrder = 'asc' | 'desc';
type SearchMode = 'flight' | 'route';

const FlightSchedule: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>(sampleFlights);
  const [filteredFlights, setFilteredFlights] = useState<FlightData[]>(sampleFlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [flipStates, setFlipStates] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchMode, setSearchMode] = useState<SearchMode>('flight');
  const [departureAirport, setDepartureAirport] = useState<SuggestResult | null>(null);
  const [arrivalAirport, setArrivalAirport] = useState<SuggestResult | null>(null);
  const { toast } = useToast();

  // Handle search by flight number
  const handleFlightSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a flight number",
        description: "Enter a flight number to search (e.g. BA123)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const flightsData = await fetchLiveFlights({ flight_iata: searchTerm.toUpperCase() });
      
      if (flightsData.length === 0) {
        toast({
          title: "No flights found",
          description: `No flights found with flight number ${searchTerm.toUpperCase()}`,
          variant: "destructive",
        });
        return;
      }
      
      const formattedFlights = flightsData.map(formatFlightData);
      setFlights(formattedFlights);
      setFilteredFlights(formattedFlights);
      
      toast({
        title: "Flights found",
        description: `Found ${formattedFlights.length} flights matching ${searchTerm.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Error searching for flights:", error);
      toast({
        title: "Error searching for flights",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search by route
  const handleRouteSearch = async () => {
    if (!departureAirport || !arrivalAirport) {
      toast({
        title: "Please select airports",
        description: "Both departure and arrival airports are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (departureAirport.iata_code) {
        params.dep_iata = departureAirport.iata_code;
      }
      
      if (arrivalAirport.iata_code) {
        params.arr_iata = arrivalAirport.iata_code;
      }
      
      const flightsData = await fetchFlightSchedules(params);
      
      if (flightsData.length === 0) {
        toast({
          title: "No flights found",
          description: `No flights found between ${departureAirport.name} and ${arrivalAirport.name}`,
          variant: "destructive",
        });
        return;
      }
      
      const formattedFlights = flightsData.map(formatFlightData);
      setFlights(formattedFlights);
      setFilteredFlights(formattedFlights);
      
      toast({
        title: "Flights found",
        description: `Found ${formattedFlights.length} flights between ${departureAirport.name} and ${arrivalAirport.name}`,
      });
    } catch (error) {
      console.error("Error searching for flights by route:", error);
      toast({
        title: "Error searching for flights",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format API flight data to display format
  const formatFlightData = (flight: Flight): FlightData => {
    // Format time from UTC timestamp or use default
    const formatTime = (timeString?: string) => {
      if (!timeString) return 'N/A';
      
      try {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return 'N/A';
      }
    };
    
    // Determine flight status
    let status = 'Unknown';
    if (flight.status) {
      status = flight.status.charAt(0).toUpperCase() + flight.status.slice(1);
    } else if (flight.delayed && flight.delayed > 15) {
      status = 'Delayed';
    } else {
      status = 'On Time';
    }
    
    return {
      id: flight.flight_iata || flight.flight_number || 'Unknown',
      airline: flight.airline_name || 'Unknown Airline',
      destination: flight.arr_name || flight.arr_city || flight.arr_iata || 'Unknown',
      time: formatTime(flight.dep_time || flight.dep_time_utc),
      status: status,
      gate: flight.dep_gate || flight.dep_terminal || 'TBA'
    };
  };

  // Handle text search within loaded flights
  const handleTextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredFlights(flights);
      return;
    }
    
    const filtered = flights.filter(flight => 
      flight.destination.toLowerCase().includes(term) || 
      flight.airline.toLowerCase().includes(term) || 
      flight.id.toLowerCase().includes(term)
    );
    
    setFilteredFlights(filtered);
  };

  // Fetch flights from API
  const fetchFlightData = async () => {
    setIsLoading(true);
    try {
      // Fetch popular flights or latest flights
      const flightsData = await fetchLiveFlights({ limit: "25" });
      
      if (flightsData.length === 0) {
        toast({
          title: "No flights found",
          description: "Using sample data instead",
        });
        return;
      }
      
      const formattedFlights = flightsData.map(formatFlightData);
      setFlights(formattedFlights);
      setFilteredFlights(formattedFlights);
      
      toast({
        title: "Flight data updated",
        description: "Latest flight schedule has been loaded",
      });
    } catch (error) {
      console.error("Error fetching flight data:", error);
      toast({
        title: "Failed to load flight data",
        description: "Using sample data instead. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Apply sorting to filtered flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'airline':
        comparison = a.airline.localeCompare(b.airline);
        break;
      case 'origin':
        // This assumes origin is in the data structure
        comparison = a.destination.localeCompare(b.destination);
        break;
      case 'destination':
        comparison = a.destination.localeCompare(b.destination);
        break;
      case 'time':
        comparison = a.time.localeCompare(b.time);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Swap departure and arrival airports
  const handleSwapAirports = () => {
    const temp = departureAirport;
    setDepartureAirport(arrivalAirport);
    setArrivalAirport(temp);
  };

  return (
    <section id="schedule" className="py-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2">
          <Plane className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">Flight Schedule</h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={searchMode === 'flight' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              searchMode === 'flight' 
                ? "bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]" 
                : "bg-transparent border-gray-light text-gray-light hover:text-white"
            )}
            onClick={() => setSearchMode('flight')}
          >
            Flight Number
          </Button>
          <Button
            variant={searchMode === 'route' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              searchMode === 'route' 
                ? "bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]" 
                : "bg-transparent border-gray-light text-gray-light hover:text-white"
            )}
            onClick={() => setSearchMode('route')}
          >
            Route
          </Button>
        </div>
      </div>

      <div className="mb-6 px-4">
        {searchMode === 'flight' ? (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter flight number (e.g. BA123)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
              onKeyDown={(e) => e.key === 'Enter' && handleFlightSearch()}
            />
            <Button 
              className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]" 
              onClick={handleFlightSearch}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="mb-2 text-sm text-gray-light">From</p>
              <AutocompleteSearch 
                placeholder="Departure airport" 
                onSelect={setDepartureAirport}
                type="airport"
              />
              {departureAirport && (
                <div className="mt-2 text-sm">
                  <span className="bg-purple/20 text-purple-200 px-2 py-1 rounded">
                    {departureAirport.name} ({departureAirport.iata_code})
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center my-2 md:my-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/5 hover:bg-white/10"
                onClick={handleSwapAirports}
              >
                <ArrowDownUp className="h-4 w-4 rotate-90 md:rotate-0" />
              </Button>
            </div>
            
            <div className="flex-1">
              <p className="mb-2 text-sm text-gray-light">To</p>
              <AutocompleteSearch 
                placeholder="Arrival airport" 
                onSelect={setArrivalAirport}
                type="airport"
              />
              {arrivalAirport && (
                <div className="mt-2 text-sm">
                  <span className="bg-purple/20 text-purple-200 px-2 py-1 rounded">
                    {arrivalAirport.name} ({arrivalAirport.iata_code})
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-end">
              <Button 
                className="bg-purple hover:bg-purple-600 text-white w-full md:w-auto" 
                onClick={handleRouteSearch}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Filter results..."
            onChange={handleTextSearch}
            className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light h-4 w-4" />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="relative overflow-x-auto">
          <div className="bg-gray-dark/50 p-2 flex justify-between border-b border-white/10 text-xs md:text-sm font-medium text-gray-light sticky top-0">
            <div className="w-[15%] pl-4">Flight</div>
            <div 
              className="w-[25%] cursor-pointer flex items-center gap-1" 
              onClick={() => handleSort('airline')}
            >
              Airline
              {sortField === 'airline' && (
                <ArrowDownUp size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
              )}
            </div>
            <div 
              className="w-[25%] cursor-pointer flex items-center gap-1" 
              onClick={() => handleSort('destination')}
            >
              Destination
              {sortField === 'destination' && (
                <ArrowDownUp size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
              )}
            </div>
            <div 
              className="w-[15%] text-center cursor-pointer flex items-center justify-center gap-1" 
              onClick={() => handleSort('time')}
            >
              Time
              {sortField === 'time' && (
                <ArrowDownUp size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
              )}
            </div>
            <div className="w-[10%] text-center">Gate</div>
            <div className="w-[10%] text-center">Status</div>
          </div>
          
          <div className="text-sm md:text-base font-mono">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="animate-spin h-8 w-8 text-purple" />
              </div>
            ) : sortedFlights.length > 0 ? (
              sortedFlights.map((flight, index) => (
                <div 
                  key={flight.id + index} 
                  className={cn(
                    "flex justify-between items-center p-3 border-b border-white/5 transition-colors hover:bg-white/5",
                    index % 2 === 0 ? 'bg-white/[0.02]' : ''
                  )}
                >
                  <div className="w-[15%] pl-4 font-medium">{flight.id}</div>
                  <div className="w-[25%] text-gray-light">{flight.airline}</div>
                  <div className="w-[25%]">{flight.destination}</div>
                  <div className="w-[15%] text-center font-medium">
                    <span className={cn("flight-cell", flipStates[index] && "flip")}>
                      <span className="flight-cell-content">{flight.time}</span>
                    </span>
                  </div>
                  <div className="w-[10%] text-center">{flight.gate}</div>
                  <div className="w-[10%] text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      flight.status === 'On Time' && "bg-green-900/30 text-green-400",
                      flight.status === 'Delayed' && "bg-red-900/30 text-red-400",
                      flight.status === 'Boarding' && "bg-blue-900/30 text-blue-400",
                      flight.status === 'In Air' && "bg-purple-900/30 text-purple-400",
                      flight.status === 'Landed' && "bg-gray-900/30 text-gray-400",
                      flight.status === 'Cancelled' && "bg-red-900/50 text-red-500",
                      flight.status === 'Gate Change' && "bg-yellow-900/30 text-yellow-400",
                      flight.status === 'Diverted' && "bg-orange-900/30 text-orange-400"
                    )}>
                      {flight.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-light">
                No flights found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 px-4">
        <Button 
          className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]" 
          onClick={fetchFlightData}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "View Live Flights"}
        </Button>
      </div>
    </section>
  );
};

export default FlightSchedule;
