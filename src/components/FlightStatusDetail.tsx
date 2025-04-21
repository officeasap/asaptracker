import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFlightStatus, Flight } from '@/services/aviationService';
import { toast } from 'sonner';
import { Plane, Clock, Calendar, MapPin, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FlightStatusDetail: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlightDetails = async () => {
    if (!flightId) {
      setError("No flight ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const flightData = await fetchFlightStatus(flightId);
      
      if (!flightData) {
        setError(`No flight found with ID: ${flightId}`);
        toast.error(`No flight found with ID: ${flightId}`);
      } else {
        setFlight(flightData);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching flight details:", err);
      setError("Failed to load flight details. Please try again.");
      toast.error("Failed to load flight details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlightDetails();
  }, [flightId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusWithDelay = (scheduledTime?: string, actualTime?: string, delayed?: number) => {
    if (delayed && delayed > 0) {
      let statusClass = "bg-yellow-900/30 text-yellow-400";
      if (delayed > 120) {
        statusClass = "bg-red-900/30 text-red-400";
      } else if (delayed > 60) {
        statusClass = "bg-orange-900/30 text-orange-400";
      }
      
      return {
        text: `Delayed (${delayed} min)`,
        className: statusClass
      };
    }
    
    return {
      text: "On Time",
      className: "bg-green-900/30 text-green-400"
    };
  };

  const calculateProgress = () => {
    if (!flight?.dep_time_utc || !flight?.arr_time_utc) return 0;
    
    const now = new Date();
    const departure = new Date(flight.dep_time_utc);
    const arrival = new Date(flight.arr_time_utc);
    
    const totalDuration = arrival.getTime() - departure.getTime();
    const elapsed = now.getTime() - departure.getTime();
    
    if (elapsed < 0) return 0;
    if (elapsed > totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  const getFlightStatus = () => {
    if (flight?.status) {
      const status = flight.status.toLowerCase();
      
      if (status === 'landed' || status === 'arrived') {
        return {
          text: "Landed",
          className: "bg-green-900/30 text-green-400"
        };
      } else if (status === 'cancelled') {
        return {
          text: "Cancelled",
          className: "bg-red-900/50 text-red-500"
        };
      } else if (status === 'diverted') {
        return {
          text: "Diverted",
          className: "bg-orange-900/30 text-orange-400"
        };
      } else if (status === 'active' || status === 'in_air') {
        return {
          text: "In Flight",
          className: "bg-blue-900/30 text-blue-400"
        };
      } else if (status === 'delayed') {
        return getStatusWithDelay(flight.dep_time_utc, flight.dep_actual, flight.dep_delayed);
      }
    }
    
    if (flight?.dep_delayed && flight.dep_delayed > 0) {
      return getStatusWithDelay(flight.dep_time_utc, flight.dep_actual, flight.dep_delayed);
    }
    
    if (flight?.dep_actual && new Date(flight.dep_actual) < new Date()) {
      return {
        text: "In Flight",
        className: "bg-blue-900/30 text-blue-400"
      };
    }
    
    return {
      text: "Scheduled",
      className: "bg-purple/20 text-purple-200"
    };
  };

  return (
    <section className="py-12 max-w-4xl mx-auto">
      <div className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple mb-4" />
            <p className="text-gray-light">Loading flight details...</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center">
            <div className="mb-4 text-red-400">
              <span className="inline-block p-3 bg-red-900/20 rounded-full mb-4">
                <Plane className="h-8 w-8" />
              </span>
              <h2 className="text-xl font-medium">Flight Not Found</h2>
            </div>
            <p className="text-gray-light mb-6">{error}</p>
            <Button 
              className="bg-purple hover:bg-purple-600 text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        ) : flight ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Plane className="text-purple h-6 w-6" />
                <h2 className="text-2xl font-semibold font-space">
                  Flight {flight.flight_iata || flight.flight_number}
                </h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getFlightStatus().className
                )}>
                  {getFlightStatus().text}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                onClick={loadFlightDetails}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="glass-panel mb-8">
              <div className="p-6 flex flex-col md:flex-row items-center justify-between border-b border-white/10">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="p-3 bg-white/5 rounded-full mr-4">
                    <Plane className="h-6 w-6 text-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {flight.airline_name || (flight.airline_iata ? `${flight.airline_iata} Airlines` : "Airline information unavailable")}
                    </h3>
                    <p className="text-sm text-gray-light">
                      {flight.aircraft_icao || "Aircraft information unavailable"}
                    </p>
                  </div>
                </div>
                
                <div className="flight-progress-bar">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-light">Flight Progress</span>
                    <span className="text-xs font-medium">{calculateProgress()}%</span>
                  </div>
                  <div className="h-1.5 w-64 bg-gray-dark/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-700 to-purple rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                <div>
                  <h4 className="text-lg font-medium mb-4">Departure</h4>
                  
                  <div className="space-y-6">
                    <div className="flight-detail-row flex items-start">
                      <div className="p-2 bg-white/5 rounded-md mr-3">
                        <MapPin className="h-5 w-5 text-purple" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-light mb-1">Airport</div>
                        <div className="font-medium text-lg">{flight.dep_name || flight.dep_iata}</div>
                        <div className="text-sm">
                          {flight.dep_city && `${flight.dep_city}, `}{flight.dep_country || ''}
                        </div>
                        {(flight.dep_terminal || flight.dep_gate) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {flight.dep_terminal && (
                              <span className="bg-white/10 text-white px-2 py-1 rounded text-xs">
                                Terminal {flight.dep_terminal}
                              </span>
                            )}
                            {flight.dep_gate && (
                              <span className="bg-purple/20 text-purple-200 px-2 py-1 rounded text-xs">
                                Gate {flight.dep_gate}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flight-detail-row flex items-start">
                      <div className="p-2 bg-white/5 rounded-md mr-3">
                        <Calendar className="h-5 w-5 text-purple" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-light mb-1">Scheduled</div>
                        <div className="font-medium">
                          {formatDate(flight.dep_time_utc || flight.dep_time)}
                        </div>
                      </div>
                    </div>
                    
                    {flight.dep_delayed && flight.dep_delayed > 0 && (
                      <div className="flight-detail-row flex items-start">
                        <div className="p-2 bg-white/5 rounded-md mr-3">
                          <Clock className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-light mb-1">Actual/Estimated</div>
                          <div className="font-medium text-orange-400">
                            {formatDate(flight.dep_actual || flight.dep_estimated)}
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="bg-red-900/20 text-red-400 px-2 py-1 rounded-full">
                              {flight.dep_delayed} min delay
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4">Arrival</h4>
                  
                  <div className="space-y-6">
                    <div className="flight-detail-row flex items-start">
                      <div className="p-2 bg-white/5 rounded-md mr-3">
                        <MapPin className="h-5 w-5 text-purple" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-light mb-1">Airport</div>
                        <div className="font-medium text-lg">{flight.arr_name || flight.arr_iata}</div>
                        <div className="text-sm">
                          {flight.arr_city && `${flight.arr_city}, `}{flight.arr_country || ''}
                        </div>
                        {(flight.arr_terminal || flight.arr_gate) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {flight.arr_terminal && (
                              <span className="bg-white/10 text-white px-2 py-1 rounded text-xs">
                                Terminal {flight.arr_terminal}
                              </span>
                            )}
                            {flight.arr_gate && (
                              <span className="bg-purple/20 text-purple-200 px-2 py-1 rounded text-xs">
                                Gate {flight.arr_gate}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flight-detail-row flex items-start">
                      <div className="p-2 bg-white/5 rounded-md mr-3">
                        <Calendar className="h-5 w-5 text-purple" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-light mb-1">Scheduled</div>
                        <div className="font-medium">
                          {formatDate(flight.arr_time_utc || flight.arr_time)}
                        </div>
                      </div>
                    </div>
                    
                    {flight.arr_delayed && flight.arr_delayed > 0 && (
                      <div className="flight-detail-row flex items-start">
                        <div className="p-2 bg-white/5 rounded-md mr-3">
                          <Clock className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-light mb-1">Actual/Estimated</div>
                          <div className="font-medium text-orange-400">
                            {formatDate(flight.arr_actual || flight.arr_estimated)}
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="bg-red-900/20 text-red-400 px-2 py-1 rounded-full">
                              {flight.arr_delayed} min delay
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 p-6">
                <h4 className="text-lg font-medium mb-4">Flight Information</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-light">Flight Number</div>
                    <div className="font-medium">
                      {flight.flight_iata || flight.flight_icao || flight.flight_number || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-light">Duration</div>
                    <div className="font-medium">
                      {flight.duration ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-light">Status</div>
                    <div className="font-medium">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        getFlightStatus().className
                      )}>
                        {getFlightStatus().text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-light">Aircraft</div>
                    <div className="font-medium">
                      {flight.aircraft_icao || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                className="bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                onClick={() => window.history.back()}
              >
                Back to Search
              </Button>
              <Button 
                className="bg-purple hover:bg-purple-600 text-white"
                onClick={loadFlightDetails}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default FlightStatusDetail;
