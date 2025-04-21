
import React, { useState, useEffect } from 'react';
import { fetchMostTrackedFlights, Flight } from '@/services/aviationService';
import { Loader2, Plane, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const FlightTracker = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false);

  // Fetch flights data
  const loadFlights = async (showToast = false) => {
    try {
      setError(null);
      const data = await fetchMostTrackedFlights();
      
      if (data.length === 0) {
        setError('No active flights found. Please try again later.');
        setFlights([]);
        setFilteredFlights([]);
      } else {
        setFlights(data);
        setFilteredFlights(data);
        if (showToast) {
          toast.success(`Updated: ${data.length} flights displayed`);
        }
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('No aircraft found or service unavailable.');
      toast.error('Failed to load flight data');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up periodic refresh
  useEffect(() => {
    loadFlights();
    
    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      loadFlights();
    }, 60000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Filter flights based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFlights(flights);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = flights.filter(flight => {
      const searchFields = [
        flight.flight_icao,
        flight.reg_number,
        flight.airline_name,
        flight.dep_country
      ].map(field => (field || '').toLowerCase());
      
      return searchFields.some(field => field.includes(lowerSearchTerm));
    });
    
    setFilteredFlights(filtered);
  }, [searchTerm, flights]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    loadFlights(true);
    toast.info('Refreshing flight data...');
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setFlightDetailsOpen(true);
  };

  return (
    <Card className="bg-gray-dark/60 border-gray-light/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plane className="text-purple" />
          <span>Active Flights</span>
        </CardTitle>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search flights..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-dark/50 border-gray-dark text-white pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
          </div>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="bg-gray-dark/50 border-gray-dark text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-purple" />
              <span className="ml-2 text-gray-light">Loading flight data...</span>
            </div>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-12 w-full bg-gray-light/10" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <Alert variant="destructive" className="bg-red-900/20 border-red-700/40 text-white max-w-md mx-auto">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="mt-6"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            {filteredFlights.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-light">No flights match your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white/5">
                      <TableHead className="text-purple">Callsign</TableHead>
                      <TableHead className="text-purple">Origin</TableHead>
                      <TableHead className="text-purple">Altitude</TableHead>
                      <TableHead className="text-purple text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlights.map((flight, index) => (
                      <TableRow 
                        key={`${flight.hex || flight.flight_icao || 'unknown'}-${index}`} 
                        className="hover:bg-white/5 cursor-pointer"
                        onClick={() => handleFlightSelect(flight)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-mono">{flight.flight_icao?.trim() || 'N/A'}</span>
                            <span className="text-sm text-gray-light">ID: {flight.hex || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{flight.dep_country || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{flight.alt ? `${Math.round(flight.alt).toLocaleString()} m` : 'N/A'}</span>
                            <span className="text-sm text-gray-light">
                              {flight.speed ? `${Math.round(flight.speed)} kts` : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            flight.status === 'on-ground' 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {flight.status || 'En Route'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="text-center py-4 text-sm text-gray-light">
              Showing {filteredFlights.length} of {flights.length} tracked flights
            </div>
          </>
        )}
      </CardContent>

      {/* Flight Details Dialog */}
      <Dialog open={flightDetailsOpen} onOpenChange={setFlightDetailsOpen}>
        <DialogContent className="bg-gray-dark border-gray-light/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plane className="text-purple" />
              Flight Details
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {selectedFlight?.flight_icao || 'Flight information'}
            </DialogDescription>
          </DialogHeader>

          {selectedFlight && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-4">
                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Flight Information</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">Callsign:</span>
                    <span className="font-mono">{selectedFlight.flight_icao?.trim() || 'N/A'}</span>
                    
                    <span className="text-gray-light">Origin Country:</span>
                    <span>{selectedFlight.dep_country || 'Unknown'}</span>
                    
                    <span className="text-gray-light">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedFlight.status === 'on-ground' 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                      } inline-block`}>
                      {selectedFlight.status || 'En Route'}
                    </span>
                    
                    <span className="text-gray-light">ICAO24:</span>
                    <span>{selectedFlight.hex || 'Unknown'}</span>
                  </div>
                </div>

                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Position</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">Latitude:</span>
                    <span>{selectedFlight.lat?.toFixed(4) || 'Unknown'}</span>
                    
                    <span className="text-gray-light">Longitude:</span>
                    <span>{selectedFlight.lng?.toFixed(4) || 'Unknown'}</span>
                    
                    <span className="text-gray-light">Squawk:</span>
                    <span>{selectedFlight.squawk || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Current Position</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-gray-light">Altitude:</span>
                    <span>{selectedFlight.alt ? `${Math.round(selectedFlight.alt).toLocaleString()} m` : 'N/A'}</span>
                    
                    <span className="text-gray-light">Ground Speed:</span>
                    <span>{selectedFlight.speed ? `${Math.round(selectedFlight.speed)} kts` : 'N/A'}</span>
                    
                    <span className="text-gray-light">Heading:</span>
                    <span>{selectedFlight.dir ? `${Math.round(selectedFlight.dir)}°` : 'N/A'}</span>
                    
                    <span className="text-gray-light">Vertical Rate:</span>
                    <span>{selectedFlight.v_speed ? `${Math.round(selectedFlight.v_speed)} m/s` : 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-gray-light/5 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Open in External Tools</h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="bg-gray-dark/50 border-gray-dark text-white w-full"
                      onClick={() => window.open(`https://opensky-network.org/aircraft-profile?icao24=${selectedFlight.hex}`, '_blank')}
                    >
                      View on OpenSky Network
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-gray-dark/50 border-gray-dark text-white w-full"
                      onClick={() => window.open(`https://flightaware.com/live/flight/${selectedFlight.flight_icao?.trim()}`, '_blank')}
                    >
                      Search on FlightAware
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FlightTracker;
