
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Search, 
  Loader2, 
  PlaneTakeoff, 
  Calendar, 
  RefreshCw, 
  ArrowRight, 
  ArrowDown, 
  Check, 
  Filter, 
  Clock,
  CloudOff,
  AlertTriangle,
  X,
  ChevronDown,
  PlaneLanding
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { 
  fetchRealTimeFlights, 
  fetchFlightByNumber,
  fetchFlightsByRoute,
  searchAirportsAndAirlines,
  AviationStackFlight
} from '@/services/aviationStackService';

interface AirportSearchResult {
  name: string;
  iata_code: string;
  country_code: string;
  type: string;
}

const FlightSchedulePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'flight' | 'route'>('flight');
  const [flights, setFlights] = useState<AviationStackFlight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<AviationStackFlight[]>([]);
  
  // Selected flight details
  const [selectedFlight, setSelectedFlight] = useState<AviationStackFlight | null>(null);
  const [isFlightDetailsOpen, setIsFlightDetailsOpen] = useState(false);
  
  // Route search
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [departureResults, setDepartureResults] = useState<AirportSearchResult[]>([]);
  const [arrivalResults, setArrivalResults] = useState<AirportSearchResult[]>([]);
  const [selectedDeparture, setSelectedDeparture] = useState<AirportSearchResult | null>(null);
  const [selectedArrival, setSelectedArrival] = useState<AirportSearchResult | null>(null);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isArrivalOpen, setIsArrivalOpen] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'flight_date', 
    direction: 'desc' 
  });
  
  // Search airports
  useEffect(() => {
    const searchAirports = async () => {
      if (departureSearch.length >= 2) {
        try {
          const results = await searchAirportsAndAirlines(departureSearch);
          const airports = results.filter(result => result.type === 'airport');
          setDepartureResults(airports);
        } catch (error) {
          console.error('Error searching airports:', error);
        }
      } else {
        setDepartureResults([]);
      }
    };
    
    const timeoutId = setTimeout(searchAirports, 300);
    return () => clearTimeout(timeoutId);
  }, [departureSearch]);
  
  useEffect(() => {
    const searchAirports = async () => {
      if (arrivalSearch.length >= 2) {
        try {
          const results = await searchAirportsAndAirlines(arrivalSearch);
          const airports = results.filter(result => result.type === 'airport');
          setArrivalResults(airports);
        } catch (error) {
          console.error('Error searching airports:', error);
        }
      } else {
        setArrivalResults([]);
      }
    };
    
    const timeoutId = setTimeout(searchAirports, 300);
    return () => clearTimeout(timeoutId);
  }, [arrivalSearch]);
  
  // Load initial flight data
  useEffect(() => {
    loadLatestFlights();
  }, []);
  
  // Apply filtering
  useEffect(() => {
    if (flights.length === 0) return;
    
    let filtered = [...flights];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(flight => flight.flight_status === statusFilter);
    }
    
    // Apply text search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(flight => 
        flight.flight.iata?.toLowerCase().includes(term) ||
        flight.flight.icao?.toLowerCase().includes(term) ||
        flight.airline.name.toLowerCase().includes(term) ||
        flight.departure.airport.toLowerCase().includes(term) ||
        flight.arrival.airport.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: any, bValue: any;
      
      // Special case for nested properties
      if (key === 'flight_number') {
        aValue = a.flight.number;
        bValue = b.flight.number;
      } else if (key === 'airline') {
        aValue = a.airline.name;
        bValue = b.airline.name;
      } else if (key === 'departure') {
        aValue = a.departure.scheduled;
        bValue = b.departure.scheduled;
      } else if (key === 'arrival') {
        aValue = a.arrival.scheduled;
        bValue = b.arrival.scheduled;
      } else if (key === 'departure_airport') {
        aValue = a.departure.airport;
        bValue = b.departure.airport;
      } else if (key === 'arrival_airport') {
        aValue = a.arrival.airport;
        bValue = b.arrival.airport;
      } else {
        // @ts-ignore - Handle other properties
        aValue = a[key];
        // @ts-ignore
        bValue = b[key];
      }
      
      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      // Compare values based on direction
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredFlights(filtered);
  }, [flights, statusFilter, searchTerm, sortConfig]);
  
  // Load latest flights
  const loadLatestFlights = async () => {
    setIsLoading(true);
    try {
      const response = await fetchRealTimeFlights({ limit: '100' });
      
      if (response.data && response.data.length > 0) {
        setFlights(response.data);
        setFilteredFlights(response.data);
        toast.success(`Loaded ${response.data.length} flights`);
      } else {
        toast.info('No flights found');
        setFlights([]);
        setFilteredFlights([]);
      }
    } catch (error) {
      console.error('Error loading flights:', error);
      toast.error('Failed to load flight data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search by flight number
  const handleFlightSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a flight number');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetchFlightByNumber(searchTerm);
      
      if (response && response.data && response.data.length > 0) {
        setFlights(response.data);
        setFilteredFlights(response.data);
        toast.success(`Found ${response.data.length} flights matching ${searchTerm}`);
      } else {
        toast.error(`No flights found with number ${searchTerm}`);
      }
    } catch (error) {
      console.error('Error searching flight:', error);
      toast.error('Failed to search flight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search by route
  const handleRouteSearch = async () => {
    if (!selectedDeparture || !selectedArrival) {
      toast.error('Please select both departure and arrival airports');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetchFlightsByRoute(
        selectedDeparture.iata_code,
        selectedArrival.iata_code
      );
      
      if (response.data && response.data.length > 0) {
        setFlights(response.data);
        setFilteredFlights(response.data);
        toast.success(`Found ${response.data.length} flights between ${selectedDeparture.iata_code} and ${selectedArrival.iata_code}`);
      } else {
        toast.error(`No flights found between ${selectedDeparture.iata_code} and ${selectedArrival.iata_code}`);
      }
    } catch (error) {
      console.error('Error searching route:', error);
      toast.error('Failed to search route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle airport selection
  const handleSelectDeparture = (airport: AirportSearchResult) => {
    setSelectedDeparture(airport);
    setDepartureSearch('');
    setIsDepartureOpen(false);
  };
  
  const handleSelectArrival = (airport: AirportSearchResult) => {
    setSelectedArrival(airport);
    setArrivalSearch('');
    setIsArrivalOpen(false);
  };
  
  // Swap departure and arrival
  const handleSwapAirports = () => {
    const temp = selectedDeparture;
    setSelectedDeparture(selectedArrival);
    setSelectedArrival(temp);
  };
  
  // Sort flights
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Format date and time
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'HH:mm, dd MMM');
    } catch (error) {
      return 'N/A';
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'active':
        return (
          <Badge className="bg-green-500/20 hover:bg-green-500/30 text-green-400">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'landed':
        return (
          <Badge className="bg-purple/20 hover:bg-purple/30 text-purple-400">
            <PlaneLanding className="h-3 w-3 mr-1" />
            Landed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 hover:bg-red-500/30 text-red-400">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'incident':
        return (
          <Badge className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Incident
          </Badge>
        );
      case 'diverted':
        return (
          <Badge className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Diverted
          </Badge>
        );
      case 'delayed':
        return (
          <Badge className="bg-red-500/20 hover:bg-red-500/30 text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            Delayed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-400">
            Unknown
          </Badge>
        );
    }
  };
  
  // Handle flight details
  const handleOpenFlightDetails = (flight: AviationStackFlight) => {
    setSelectedFlight(flight);
    setIsFlightDetailsOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Flight <span className="text-[#8B0000] animate-text-glow">Schedule</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track real-time flight statuses, arrivals, and departures worldwide
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-gray-dark/80 border-[#8B0000]/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-space">Search Flights</CardTitle>
            <CardDescription>
              Find flights by flight number or route
            </CardDescription>
            
            <Tabs defaultValue="flight" value={searchMode} onValueChange={(value) => setSearchMode(value as 'flight' | 'route')} className="mt-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="flight" className="flex items-center gap-2">
                  <PlaneTakeoff className="h-4 w-4" />
                  <span>Flight Number</span>
                </TabsTrigger>
                <TabsTrigger value="route" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  <span>Route</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="flight" className="mt-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter flight number (e.g., BA123)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                    className="bg-gray-dark/50 border-gray-dark text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleFlightSearch()}
                  />
                  <Button 
                    className="bg-[#8B0000] hover:bg-[#A80000] text-white" 
                    onClick={handleFlightSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="route" className="mt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-gray-light">From</label>
                    <div className="relative">
                      <DropdownMenu open={isDepartureOpen} onOpenChange={setIsDepartureOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between bg-gray-dark/50 border-gray-dark text-white"
                          >
                            {selectedDeparture ? (
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2 font-mono">
                                  {selectedDeparture.iata_code}
                                </Badge>
                                <span className="truncate">{selectedDeparture.name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-light">Select departure airport</span>
                            )}
                            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-gray-dark/90 backdrop-blur-md border-gray-light/20">
                          <div className="p-2">
                            <Input
                              placeholder="Search airports..."
                              value={departureSearch}
                              onChange={(e) => setDepartureSearch(e.target.value)}
                              className="bg-gray-dark border-gray-dark text-white"
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                            {departureResults.length === 0 ? (
                              <div className="text-center py-4 text-gray-light text-sm">
                                {departureSearch.length < 2 ? 'Type at least 2 characters' : 'No airports found'}
                              </div>
                            ) : (
                              departureResults.map((airport, index) => (
                                <DropdownMenuItem 
                                  key={`dep-${airport.iata_code}-${index}`}
                                  onClick={() => handleSelectDeparture(airport)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2 font-mono">
                                      {airport.iata_code}
                                    </Badge>
                                    <div className="flex flex-col">
                                      <span>{airport.name}</span>
                                      <span className="text-xs text-gray-light">
                                        {airport.country_code}
                                      </span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              ))
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSwapAirports}
                      className="hidden md:flex h-10 w-10 rounded-full"
                      disabled={!selectedDeparture || !selectedArrival}
                    >
                      <ArrowRight className="md:rotate-0 rotate-90" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSwapAirports}
                      className="md:hidden flex h-10 w-10 rounded-full"
                      disabled={!selectedDeparture || !selectedArrival}
                    >
                      <ArrowDown />
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-gray-light">To</label>
                    <div className="relative">
                      <DropdownMenu open={isArrivalOpen} onOpenChange={setIsArrivalOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between bg-gray-dark/50 border-gray-dark text-white"
                          >
                            {selectedArrival ? (
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2 font-mono">
                                  {selectedArrival.iata_code}
                                </Badge>
                                <span className="truncate">{selectedArrival.name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-light">Select arrival airport</span>
                            )}
                            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-gray-dark/90 backdrop-blur-md border-gray-light/20">
                          <div className="p-2">
                            <Input
                              placeholder="Search airports..."
                              value={arrivalSearch}
                              onChange={(e) => setArrivalSearch(e.target.value)}
                              className="bg-gray-dark border-gray-dark text-white"
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                            {arrivalResults.length === 0 ? (
                              <div className="text-center py-4 text-gray-light text-sm">
                                {arrivalSearch.length < 2 ? 'Type at least 2 characters' : 'No airports found'}
                              </div>
                            ) : (
                              arrivalResults.map((airport, index) => (
                                <DropdownMenuItem 
                                  key={`arr-${airport.iata_code}-${index}`}
                                  onClick={() => handleSelectArrival(airport)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2 font-mono">
                                      {airport.iata_code}
                                    </Badge>
                                    <div className="flex flex-col">
                                      <span>{airport.name}</span>
                                      <span className="text-xs text-gray-light">
                                        {airport.country_code}
                                      </span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              ))
                            )}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      className="bg-[#8B0000] hover:bg-[#A80000] text-white w-full md:w-auto" 
                      onClick={handleRouteSearch}
                      disabled={isLoading || !selectedDeparture || !selectedArrival}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Search
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-light">Filter by status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] bg-gray-dark/50 border-gray-dark text-white">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-dark border-gray-dark text-white">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="landed">Landed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="diverted">Diverted</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Filter results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-dark/50 border-gray-dark text-white pl-9 w-full md:w-auto"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
                </div>
                
                <Button
                  variant="outline"
                  onClick={loadLatestFlights}
                  className="bg-gray-dark/50 border-gray-dark text-white"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="animate-spin h-8 w-8 text-[#8B0000]" />
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="text-center py-12">
                <CloudOff className="h-12 w-12 text-gray-light mx-auto mb-4" />
                <p className="text-gray-light">No flights found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={loadLatestFlights}
                  className="mt-4"
                >
                  Load Latest Flights
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white/5">
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('flight_number')}
                      >
                        <div className="flex items-center">
                          Flight
                          {sortConfig.key === 'flight_number' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('airline')}
                      >
                        <div className="flex items-center">
                          Airline
                          {sortConfig.key === 'airline' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('departure_airport')}
                      >
                        <div className="flex items-center">
                          From
                          {sortConfig.key === 'departure_airport' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('departure')}
                      >
                        <div className="flex items-center">
                          Departure
                          {sortConfig.key === 'departure' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('arrival_airport')}
                      >
                        <div className="flex items-center">
                          To
                          {sortConfig.key === 'arrival_airport' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('arrival')}
                      >
                        <div className="flex items-center">
                          Arrival
                          {sortConfig.key === 'arrival' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('flight_status')}
                      >
                        <div className="flex items-center">
                          Status
                          {sortConfig.key === 'flight_status' && (
                            <ArrowDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlights.map((flight, index) => (
                      <TableRow 
                        key={`${flight.flight.iata}-${flight.flight.number}-${index}`}
                        className="hover:bg-white/5 cursor-pointer"
                        onClick={() => handleOpenFlightDetails(flight)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="font-mono">
                              {flight.flight.iata || flight.flight.icao || 'N/A'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{flight.airline.name}</span>
                            <span className="text-xs text-gray-light">
                              {flight.airline.iata}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{flight.departure.airport}</span>
                            <span className="text-xs text-gray-light">
                              {flight.departure.iata}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDateTime(flight.departure.scheduled)}</span>
                            {flight.departure.delay && (
                              <span className="text-xs text-red-400">
                                Delayed by {flight.departure.delay} min
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{flight.arrival.airport}</span>
                            <span className="text-xs text-gray-light">
                              {flight.arrival.iata}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatDateTime(flight.arrival.scheduled)}</span>
                            {flight.arrival.delay && (
                              <span className="text-xs text-red-400">
                                Delayed by {flight.arrival.delay} min
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(flight.flight_status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-light">
              Showing {filteredFlights.length} of {flights.length} flights
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Flight Details Dialog */}
      {selectedFlight && (
        <Dialog open={isFlightDetailsOpen} onOpenChange={setIsFlightDetailsOpen}>
          <DialogContent className="bg-gray-dark border-gray-light/20 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <PlaneTakeoff className="text-[#8B0000]" />
                Flight {selectedFlight.flight.iata || selectedFlight.flight.icao}
              </DialogTitle>
              <DialogDescription className="text-gray-light">
                {selectedFlight.airline.name} • {selectedFlight.flight_date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              <Card className="bg-black/20 border-gray-light/10">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{selectedFlight.departure.iata}</h3>
                      <p className="text-sm text-gray-light">{selectedFlight.departure.airport}</p>
                    </div>
                    
                    <div className="py-4 flex flex-col items-center">
                      <div className="w-32 md:w-40 h-px bg-gradient-to-r from-transparent via-[#8B0000] to-transparent"></div>
                      <PlaneTakeoff className="text-[#8B0000] my-2" />
                      <p className="text-xs text-gray-light">
                        Flight {selectedFlight.flight.iata || selectedFlight.flight.icao}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{selectedFlight.arrival.iata}</h3>
                      <p className="text-sm text-gray-light">{selectedFlight.arrival.airport}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm uppercase text-gray-light font-semibold mb-2">Departure</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-light">Scheduled:</span>
                          <span>{formatDateTime(selectedFlight.departure.scheduled)}</span>
                        </div>
                        {selectedFlight.departure.estimated && (
                          <div className="flex justify-between">
                            <span className="text-gray-light">Estimated:</span>
                            <span>{formatDateTime(selectedFlight.departure.estimated)}</span>
                          </div>
                        )}
                        {selectedFlight.departure.actual && (
                          <div className="flex justify-between">
                            <span className="text-gray-light">Actual:</span>
                            <span>{formatDateTime(selectedFlight.departure.actual)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-light">Terminal:</span>
                          <span>{selectedFlight.departure.terminal || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-light">Gate:</span>
                          <span>{selectedFlight.departure.gate || 'N/A'}</span>
                        </div>
                        {selectedFlight.departure.delay && (
                          <div className="flex justify-between">
                            <span className="text-gray-light">Delay:</span>
                            <span className="text-red-400">{selectedFlight.departure.delay} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm uppercase text-gray-light font-semibold mb-2">Arrival</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-light">Scheduled:</span>
                          <span>{formatDateTime(selectedFlight.arrival.scheduled)}</span>
                        </div>
                        {selectedFlight.arrival.estimated && (
                          <div className="flex justify-between">
                            <span className="text-gray-light">Estimated:</span>
                            <span>{formatDateTime(selectedFlight.arrival.estimated)}</span>
                          </div>
                        )}
                        {selectedFlight.arrival.actual && (
                          <div className="flex justify-between">
                            <span className="text-gray-light">Actual:</span>
                            <span>{formatDateTime(selectedFlight.arrival.actual)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-light">Terminal:</span>
                          <span>{selectedFlight.arrival.terminal || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-light">Gate:</span>
                          <span>{selectedFlight.arrival.gate || 'N/A'}</span>
                        </div>
                        {selectedFlight.arrival.delay && (
                          <div className="flex justify-between">
                            <span className="text-gray-light">Delay:</span>
                            <span className="text-red-400">{selectedFlight.arrival.delay} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm uppercase text-gray-light font-semibold mb-2">Airline Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-light">Airline:</span>
                      <span>{selectedFlight.airline.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">IATA Code:</span>
                      <span>{selectedFlight.airline.iata}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">ICAO Code:</span>
                      <span>{selectedFlight.airline.icao || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase text-gray-light font-semibold mb-2">Flight Status</h4>
                  <div className="p-4 bg-black/20 rounded-lg flex flex-col items-center justify-center">
                    <div className="mb-2">
                      {getStatusBadge(selectedFlight.flight_status)}
                    </div>
                    <p className="text-sm text-center text-gray-light">
                      {selectedFlight.flight_status === 'active' && "This flight is currently in the air."}
                      {selectedFlight.flight_status === 'scheduled' && "This flight is scheduled to depart as planned."}
                      {selectedFlight.flight_status === 'landed' && "This flight has landed at its destination."}
                      {selectedFlight.flight_status === 'cancelled' && "This flight has been cancelled."}
                      {selectedFlight.flight_status === 'incident' && "This flight has encountered an incident."}
                      {selectedFlight.flight_status === 'diverted' && "This flight has been diverted to a different airport."}
                      {selectedFlight.flight_status === 'delayed' && "This flight is currently delayed."}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedFlight.live && (
                <div className="mt-4">
                  <h4 className="text-sm uppercase text-gray-light font-semibold mb-2">Live Tracking Data</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-black/20 rounded-lg text-center">
                      <p className="text-xs text-gray-light">Altitude</p>
                      <p className="text-lg font-semibold">{selectedFlight.live.altitude.toLocaleString()} ft</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg text-center">
                      <p className="text-xs text-gray-light">Speed</p>
                      <p className="text-lg font-semibold">{selectedFlight.live.speed_horizontal} km/h</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg text-center">
                      <p className="text-xs text-gray-light">Direction</p>
                      <p className="text-lg font-semibold">{selectedFlight.live.direction}°</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg text-center">
                      <p className="text-xs text-gray-light">Last Updated</p>
                      <p className="text-lg font-semibold">{formatDateTime(selectedFlight.live.updated)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

export default FlightSchedulePage;
