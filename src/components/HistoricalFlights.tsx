import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fetchFlightsByStatus, Flight } from '@/services/aviationService';
import { Calendar, Filter, History, Plane, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface FlightData {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  date: string;
  scheduledTime: string;
  actualTime: string;
  status: string;
  delay: number;
}

const sampleHistoricalFlights: FlightData[] = [
  { id: 'BA282', airline: 'British Airways', origin: 'London', destination: 'Los Angeles', date: '2025-04-11', scheduledTime: '10:30', actualTime: '10:45', status: 'Landed', delay: 15 },
  { id: 'EK214', airline: 'Emirates', origin: 'Dubai', destination: 'Houston', date: '2025-04-11', scheduledTime: '08:15', actualTime: '09:30', status: 'Landed', delay: 75 },
  { id: 'LH470', airline: 'Lufthansa', origin: 'Frankfurt', destination: 'Tokyo', date: '2025-04-11', scheduledTime: '12:45', actualTime: '12:50', status: 'Landed', delay: 5 },
  { id: 'SQ321', airline: 'Singapore Airlines', origin: 'Singapore', destination: 'Paris', date: '2025-04-11', scheduledTime: '09:10', actualTime: '09:05', status: 'Landed', delay: 0 },
  { id: 'UA901', airline: 'United Airlines', origin: 'San Francisco', destination: 'London', date: '2025-04-11', scheduledTime: '19:30', actualTime: '21:45', status: 'Delayed', delay: 135 },
  { id: 'QF8', airline: 'Qantas', origin: 'Sydney', destination: 'Dallas', date: '2025-04-11', scheduledTime: '17:10', actualTime: '17:05', status: 'In Air', delay: 0 },
  { id: 'AA100', airline: 'American Airlines', origin: 'New York', destination: 'London', date: '2025-04-10', scheduledTime: '22:15', actualTime: '22:30', status: 'Landed', delay: 15 },
  { id: 'AF1680', airline: 'Air France', origin: 'Paris', destination: 'Cairo', date: '2025-04-10', scheduledTime: '16:20', actualTime: '16:20', status: 'Landed', delay: 0 },
  { id: 'AA9988', airline: 'American Airlines', origin: 'Miami', destination: 'New York', date: '2025-04-10', scheduledTime: '14:50', actualTime: 'Scheduled', status: 'Scheduled', delay: 0 },
];

const formatFlightData = (flights: Flight[]): FlightData[] => {
  return flights.map(flight => ({
    id: flight.flight_iata || flight.flight_icao || 'Unknown',
    airline: flight.airline_name || 'Unknown Airline',
    origin: flight.dep_name || flight.dep_city || flight.dep_iata || 'Unknown',
    destination: flight.arr_name || flight.arr_city || flight.arr_iata || 'Unknown',
    date: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: flight.dep_time 
      ? new Date(flight.dep_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : 'N/A',
    actualTime: flight.dep_actual
      ? new Date(flight.dep_actual).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : (flight.status === 'scheduled' ? 'Scheduled' : 'N/A'),
    status: flight.status ? flight.status.charAt(0).toUpperCase() + flight.status.slice(1) : 'Unknown',
    delay: flight.delayed || flight.dep_delayed || 0
  }));
};

const HistoricalFlights: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>(sampleHistoricalFlights);
  const [loading, setLoading] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
  }, []);

  const fetchHistoricalFlights = async (status: string = 'landed') => {
    setLoading(true);
    try {
      const flightsData = await fetchFlightsByStatus(status);
      
      if (flightsData.length === 0) {
        toast({
          title: "No flights found",
          description: `No ${status} flights found. Using sample data instead.`,
          variant: "destructive",
        });
        setFlights(sampleHistoricalFlights);
      } else {
        const formattedFlights = formatFlightData(flightsData);
        setFlights(formattedFlights);
        
        toast({
          title: "Flights updated",
          description: `Loaded ${formattedFlights.length} ${status} flights`,
        });
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      toast({
        title: "Error loading flights",
        description: "There was a problem fetching flight data. Using sample data instead.",
        variant: "destructive",
      });
      setFlights(sampleHistoricalFlights);
    } finally {
      setLoading(false);
    }
  };

  const filterFlightsByStatus = (status: string | null) => {
    setFilteredStatus(status);
  };

  const filteredFlights = filteredStatus 
    ? flights.filter(flight => flight.status.toLowerCase() === filteredStatus.toLowerCase())
    : flights;

  return (
    <section id="historical" className="py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2">
          <History className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">Historical Flights</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={filteredStatus === null ? "default" : "outline"}
            size="sm"
            onClick={() => filterFlightsByStatus(null)}
          >
            All
          </Button>
          <Button
            variant={filteredStatus === "landed" ? "default" : "outline"}
            size="sm"
            onClick={() => filterFlightsByStatus("landed")}
          >
            Landed
          </Button>
          <Button
            variant={filteredStatus === "delayed" ? "default" : "outline"}
            size="sm"
            onClick={() => filterFlightsByStatus("delayed")}
          >
            Delayed
          </Button>
          <Button
            variant={filteredStatus === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => filterFlightsByStatus("cancelled")}
          >
            Cancelled
          </Button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-purple" />
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-dark/50 text-xs md:text-sm font-medium text-gray-light border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Flight</th>
                  <th className="px-4 py-3">Airline</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Actual</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight, index) => (
                    <tr 
                      key={`${flight.id}-${index}`}
                      className={cn(
                        "border-b border-white/5",
                        index % 2 === 0 ? "bg-white/[0.02]" : ""
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{flight.id}</td>
                      <td className="px-4 py-3 text-gray-light">{flight.airline}</td>
                      <td className="px-4 py-3">{flight.origin} <span className="text-gray-light">→</span> {flight.destination}</td>
                      <td className="px-4 py-3">{flight.date}</td>
                      <td className="px-4 py-3">{flight.scheduledTime}</td>
                      <td className="px-4 py-3">{flight.actualTime}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          flight.status === "Landed" && "bg-green-900/30 text-green-400",
                          flight.status === "Delayed" && "bg-yellow-900/30 text-yellow-400",
                          flight.status === "Cancelled" && "bg-red-900/30 text-red-400",
                          flight.status === "In Air" && "bg-blue-900/30 text-blue-400",
                          flight.status === "Scheduled" && "bg-purple/20 text-purple-200"
                        )}>
                          {flight.status}
                          {flight.delay > 0 && ` (${flight.delay}m)`}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-light">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 mb-2 text-gray-light" />
                        <p>No flights found matching the selected criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 px-4">
        <div className="text-sm text-gray-light flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Showing flights from the last 24 hours</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => fetchHistoricalFlights("landed")}
            disabled={loading}
          >
            <Filter className="h-4 w-4 mr-2" />
            Landed Flights
          </Button>
          <Button 
            variant="default" 
            onClick={() => fetchHistoricalFlights("delayed")}
            disabled={loading}
          >
            <Filter className="h-4 w-4 mr-2" />
            Delayed Flights
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HistoricalFlights;
