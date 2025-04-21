import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { 
  fetchArrivalsDepartures,
  Airport,
} from '@/services/aviationService';
import { 
  Plane, 
  Search, 
  ArrowDownUp, 
  Filter, 
  Clock, 
  Loader2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlightData {
  id: string;
  airline: string;
  destination: string;
  time: string;
  status: string;
  gate: string;
}

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const characters = text.split('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % characters.length);
    }, 100);

    return () => clearInterval(intervalId);
  }, [characters.length]);

  return (
    <div className="flex overflow-hidden">
      {characters.map((char, index) => (
        <span
          key={index}
          className={cn(
            "transition-transform duration-200",
            index === currentIndex ? "translate-y-0" : "-translate-y-full"
          )}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

interface AnimatedCharProps {
  char: string;
  isActive: boolean;
  hasFakeCaret?: boolean;
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ char, isActive, hasFakeCaret = false }) => {
  return (
    <span className={cn(
      "relative",
      isActive ? "text-white" : "text-gray-light",
    )}>
      {char}
      {hasFakeCaret && <span className="absolute -right-0.5 top-0 h-full w-px bg-white animate-pulse" />}
    </span>
  );
};

const ArrivalDepartureBoardsPage: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [airport, setAirport] = useState<Airport | null>(null);
  const [type, setType] = useState<'arrivals' | 'departures'>('arrivals');
  const [boardText, setBoardText] = useState('Arrivals');
  const [animatedText, setAnimatedText] = useState('Arrivals');
  const [animatedChars, setAnimatedChars] = useState<string[]>([]);
  const [currentAnimatedIndex, setCurrentAnimatedIndex] = useState(0);
  const [isAnimatedCharActive, setIsAnimatedCharActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setAnimatedChars(boardText.split(''));
  }, [boardText]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAnimatedIndex((prevIndex) => (prevIndex + 1) % animatedChars.length);
      setIsAnimatedCharActive(true);
      setTimeout(() => setIsAnimatedCharActive(false), 500);
    }, 500);

    return () => clearInterval(intervalId);
  }, [animatedChars.length]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (airport?.iata_code) {
        params.iata = airport.iata_code;
      }
      
      const flightsData = await fetchArrivalsDepartures(type, params);
      
      if (flightsData.length === 0) {
        toast({
          title: "No flights found",
          description: `No flights found for ${airport?.name}`,
          variant: "destructive",
        });
        return;
      }
      
      // setFlights(flightsData);
      setFilteredFlights(flightsData as any);
      
      toast({
        title: "Flights found",
        description: `Found ${flightsData.length} flights for ${airport?.name}`,
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

  const handleSwapType = () => {
    setType(type === 'arrivals' ? 'departures' : 'arrivals');
    setBoardText(type === 'arrivals' ? 'Departures' : 'Arrivals');
    setAnimatedText(type === 'arrivals' ? 'Departures' : 'Arrivals');
  };

  return (
    <section id="arrival-departure-boards" className="py-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2">
          <Plane className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">
            <AnimatedText text={animatedText} />
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/5 hover:bg-white/10"
            onClick={handleSwapType}
          >
            <ArrowDownUp className="h-4 w-4 rotate-90 md:rotate-0" />
          </Button>
        </div>
      </div>

      <div className="mb-6 px-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter airport IATA code (e.g. CGK)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </div>
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
            <div className="w-[25%]">Airline</div>
            <div className="w-[25%]">Destination</div>
            <div className="w-[15%] text-center">Time</div>
            <div className="w-[10%] text-center">Gate</div>
            <div className="w-[10%] text-center">Status</div>
          </div>
          
          <div className="text-sm md:text-base font-mono">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="animate-spin h-8 w-8 text-purple" />
              </div>
            ) : filteredFlights.length > 0 ? (
              filteredFlights.map((flight: any, index) => (
                <div 
                  key={flight.id + index} 
                  className={cn(
                    "flex justify-between items-center p-3 border-b border-white/5 transition-colors hover:bg-white/5",
                    index % 2 === 0 ? 'bg-white/[0.02]' : ''
                  )}
                >
                  <div className="w-[15%] pl-4 font-medium">{flight.flight_number}</div>
                  <div className="w-[25%] text-gray-light">{flight.airline.name}</div>
                  <div className="w-[25%]">{flight.arrival.airport}</div>
                  <div className="w-[15%] text-center font-medium">
                    <span className="flight-cell">
                      <span className="flight-cell-content">{flight.arrival.scheduled}</span>
                    </span>
                  </div>
                  <div className="w-[10%] text-center">{flight.arrival.gate}</div>
                  <div className="w-[10%] text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      flight.status === 'on-time' && "bg-green-900/30 text-green-400",
                      flight.status === 'delayed' && "bg-red-900/30 text-red-400",
                      flight.status === 'boarding' && "bg-blue-900/30 text-blue-400",
                      flight.status === 'in-air' && "bg-purple-900/30 text-purple-400",
                      flight.status === 'landed' && "bg-gray-900/30 text-gray-400",
                      flight.status === 'cancelled' && "bg-red-900/50 text-red-500",
                      flight.status === 'gate-change' && "bg-yellow-900/30 text-yellow-400",
                      flight.status === 'diverted' && "bg-orange-900/30 text-orange-400"
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
    </section>
  );
};

export default ArrivalDepartureBoardsPage;
