
import React, { useState, useEffect } from 'react';
import { fetchFlightSchedules } from '@/services/flightService';
import { Loader2, PlaneIcon, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BoardProps {
  airport?: string;
}

interface FlightInfo {
  flightNumber: string;
  airline: string;
  destination: string;
  origin: string;
  scheduledTime: string;
  actualTime?: string;
  status: string;
  gate: string;
  terminal: string;
}

const sampleArrivals: FlightInfo[] = [
  { flightNumber: 'GA422', airline: 'Garuda Indonesia', origin: 'Singapore (SIN)', destination: 'Jakarta (CGK)', scheduledTime: '09:45', actualTime: '09:52', status: 'Landed', gate: 'D7', terminal: '3' },
  { flightNumber: 'SQ956', airline: 'Singapore Airlines', origin: 'Singapore (SIN)', destination: 'Jakarta (CGK)', scheduledTime: '10:15', status: 'On Time', gate: 'D2', terminal: '3' },
  { flightNumber: 'MH711', airline: 'Malaysia Airlines', origin: 'Kuala Lumpur (KUL)', destination: 'Jakarta (CGK)', scheduledTime: '10:30', status: 'On Time', gate: 'C8', terminal: '3' },
  { flightNumber: 'CX719', airline: 'Cathay Pacific', origin: 'Hong Kong (HKG)', destination: 'Jakarta (CGK)', scheduledTime: '11:15', status: 'Delayed', actualTime: '11:45', gate: 'D5', terminal: '3' },
  { flightNumber: 'QZ7692', airline: 'Indonesia AirAsia', origin: 'Denpasar (DPS)', destination: 'Jakarta (CGK)', scheduledTime: '11:35', status: 'On Time', gate: 'B3', terminal: '2' },
  { flightNumber: 'SQ950', airline: 'Singapore Airlines', origin: 'Singapore (SIN)', destination: 'Jakarta (CGK)', scheduledTime: '12:30', status: 'On Time', gate: 'D1', terminal: '3' },
  { flightNumber: 'JT43', airline: 'Lion Air', origin: 'Surabaya (SUB)', destination: 'Jakarta (CGK)', scheduledTime: '12:45', status: 'On Time', gate: 'A7', terminal: '1' },
];

const sampleDepartures: FlightInfo[] = [
  { flightNumber: 'GA421', airline: 'Garuda Indonesia', origin: 'Jakarta (CGK)', destination: 'Singapore (SIN)', scheduledTime: '08:30', status: 'Departed', gate: 'D5', terminal: '3' },
  { flightNumber: 'JT693', airline: 'Lion Air', origin: 'Jakarta (CGK)', destination: 'Denpasar (DPS)', scheduledTime: '09:15', status: 'Boarding', gate: 'A3', terminal: '1' },
  { flightNumber: 'ID6130', airline: 'Batik Air', origin: 'Jakarta (CGK)', destination: 'Yogyakarta (YIA)', scheduledTime: '09:50', status: 'On Time', gate: 'C1', terminal: '2' },
  { flightNumber: 'SQ957', airline: 'Singapore Airlines', origin: 'Jakarta (CGK)', destination: 'Singapore (SIN)', scheduledTime: '10:25', status: 'On Time', gate: 'D3', terminal: '3' },
  { flightNumber: 'GA232', airline: 'Garuda Indonesia', origin: 'Jakarta (CGK)', destination: 'Surabaya (SUB)', scheduledTime: '11:10', status: 'Delayed', actualTime: '11:40', gate: 'D8', terminal: '3' },
  { flightNumber: 'QZ7693', airline: 'Indonesia AirAsia', origin: 'Jakarta (CGK)', destination: 'Denpasar (DPS)', scheduledTime: '12:45', status: 'On Time', gate: 'B6', terminal: '2' },
  { flightNumber: 'EK359', airline: 'Emirates', origin: 'Jakarta (CGK)', destination: 'Dubai (DXB)', scheduledTime: '12:55', status: 'Gate Change', gate: 'D6', terminal: '3' },
];

export const ArrivalBoard: React.FC<BoardProps> = ({ airport }) => {
  const [flights, setFlights] = useState<FlightInfo[]>(sampleArrivals);
  const [loading, setLoading] = useState(false);
  const [flipStates, setFlipStates] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    if (airport) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // In a real implementation, this would fetch actual flight data
        // fetchFlightSchedules({ arr_iata: airport })
        //   .then(data => {
        //     // Format the data
        //     setFlights(data.map(formatFlightData));
        //   })
        //   .catch(error => {
        //     console.error("Error fetching arrivals:", error);
        //     toast.error("Failed to load arrival data. Using sample data.");
        //   })
        //   .finally(() => setLoading(false));
        
        // For demo, just use sample data with a delay
        setFlights(sampleArrivals);
        setLoading(false);
      }, 1500);
    }
  }, [airport]);
  
  // Add flight board animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly flip some flight info
      const newFlipStates: { [key: string]: boolean } = {};
      flights.forEach((flight, index) => {
        if (Math.random() > 0.7) {
          newFlipStates[index] = !flipStates[index];
        }
      });
      setFlipStates(prev => ({ ...prev, ...newFlipStates }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [flights, flipStates]);
  
  return (
    <div className="arrivals-board">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <PlaneIcon className="h-5 w-5 mr-2 rotate-45" />
        <span className="text-white">Arrivals</span>
        {loading && <Loader2 className="ml-3 h-4 w-4 animate-spin text-gray-light" />}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#8B0000]/20 text-sm md:text-base">
          <thead>
            <tr className="text-xs text-gray-light">
              <th className="py-3 px-4 text-left">Flight</th>
              <th className="py-3 px-4 text-left">Origin</th>
              <th className="py-3 px-4 text-center">Time</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Gate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {loading ? (
              <tr className="animate-pulse">
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#8B0000]" />
                  <p className="mt-4 text-gray-light">Loading arrival information...</p>
                </td>
              </tr>
            ) : flights.length > 0 ? (
              flights.map((flight, index) => (
                <tr key={flight.flightNumber + index} className="bg-white/5 hover:bg-white/10 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{flight.flightNumber}</span>
                      <span className="text-xs text-gray-light">{flight.airline}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{flight.origin}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={cn("flight-cell", flipStates[index] && "flip")}>
                        <span className="flight-cell-content font-mono">{flight.scheduledTime}</span>
                      </span>
                      {flight.actualTime && flight.actualTime !== flight.scheduledTime && (
                        <span className="text-xs text-[#8B0000]">Actual: {flight.actualTime}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      flight.status === 'On Time' && "bg-green-900/30 text-green-400",
                      flight.status === 'Delayed' && "bg-red-900/30 text-red-400",
                      flight.status === 'Landed' && "bg-blue-900/30 text-blue-400",
                      flight.status === 'Boarding' && "bg-purple-900/30 text-purple-400",
                      flight.status === 'Departed' && "bg-gray-900/30 text-gray-400",
                      flight.status === 'Gate Change' && "bg-yellow-900/30 text-yellow-400"
                    )}>
                      {flight.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{flight.gate}</span>
                      <span className="text-xs text-gray-light">T{flight.terminal}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-light">
                  <AlertTriangle className="mx-auto h-6 w-6 text-[#8B0000] mb-2" />
                  No arrival information available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-light flex items-center justify-center gap-2">
        <Check className="h-3 w-3 text-green-400" />
        Information last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export const DepartureBoard: React.FC<BoardProps> = ({ airport }) => {
  const [flights, setFlights] = useState<FlightInfo[]>(sampleDepartures);
  const [loading, setLoading] = useState(false);
  const [flipStates, setFlipStates] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    if (airport) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // In a real implementation, this would fetch actual flight data
        // fetchFlightSchedules({ dep_iata: airport })
        //   .then(data => {
        //     // Format the data
        //     setFlights(data.map(formatFlightData));
        //   })
        //   .catch(error => {
        //     console.error("Error fetching departures:", error);
        //     toast.error("Failed to load departure data. Using sample data.");
        //   })
        //   .finally(() => setLoading(false));
        
        // For demo, just use sample data with a delay
        setFlights(sampleDepartures);
        setLoading(false);
      }, 1500);
    }
  }, [airport]);
  
  // Add flight board animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly flip some flight info
      const newFlipStates: { [key: string]: boolean } = {};
      flights.forEach((flight, index) => {
        if (Math.random() > 0.7) {
          newFlipStates[index] = !flipStates[index];
        }
      });
      setFlipStates(prev => ({ ...prev, ...newFlipStates }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [flights, flipStates]);
  
  return (
    <div className="departures-board">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <PlaneIcon className="h-5 w-5 mr-2 -rotate-45" />
        <span className="text-white">Departures</span>
        {loading && <Loader2 className="ml-3 h-4 w-4 animate-spin text-gray-light" />}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#8B0000]/20 text-sm md:text-base">
          <thead>
            <tr className="text-xs text-gray-light">
              <th className="py-3 px-4 text-left">Flight</th>
              <th className="py-3 px-4 text-left">Destination</th>
              <th className="py-3 px-4 text-center">Time</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Gate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1A1A]">
            {loading ? (
              <tr className="animate-pulse">
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#8B0000]" />
                  <p className="mt-4 text-gray-light">Loading departure information...</p>
                </td>
              </tr>
            ) : flights.length > 0 ? (
              flights.map((flight, index) => (
                <tr key={flight.flightNumber + index} className="bg-white/5 hover:bg-white/10 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{flight.flightNumber}</span>
                      <span className="text-xs text-gray-light">{flight.airline}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{flight.destination}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={cn("flight-cell", flipStates[index] && "flip")}>
                        <span className="flight-cell-content font-mono">{flight.scheduledTime}</span>
                      </span>
                      {flight.actualTime && flight.actualTime !== flight.scheduledTime && (
                        <span className="text-xs text-[#8B0000]">Actual: {flight.actualTime}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      flight.status === 'On Time' && "bg-green-900/30 text-green-400",
                      flight.status === 'Delayed' && "bg-red-900/30 text-red-400",
                      flight.status === 'Boarding' && "bg-blue-900/30 text-blue-400",
                      flight.status === 'Departed' && "bg-purple-900/30 text-purple-400",
                      flight.status === 'Gate Change' && "bg-yellow-900/30 text-yellow-400"
                    )}>
                      {flight.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{flight.gate}</span>
                      <span className="text-xs text-gray-light">T{flight.terminal}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-light">
                  <AlertTriangle className="mx-auto h-6 w-6 text-[#8B0000] mb-2" />
                  No departure information available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-light flex items-center justify-center gap-2">
        <Check className="h-3 w-3 text-green-400" />
        Information last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};
