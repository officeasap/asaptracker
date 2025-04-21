
import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAirportByIATA, Airport } from '@/services/aviationService';
import { toast } from 'sonner';

const AirportAirlineSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [airportData, setAirportData] = useState<Airport | null>(null);

  const handleSearch = async () => {
    const code = searchTerm.trim().toUpperCase();
    if (code.length !== 3) {
      setError("Please enter a valid 3-letter IATA code");
      setAirportData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAirportByIATA(code);
      if (!result || Object.keys(result).length === 0) {
        setError(`No airport found with IATA code "${code}"`);
        setAirportData(null);
      } else {
        setAirportData(result);
        setError(null);
        toast.success(`Found airport: ${result.name}`);
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong while fetching airport data");
      setAirportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 max-w-6xl mx-auto">
      <div className="px-4">
        <h2 className="text-2xl font-semibold font-space mb-6">
          Airport IATA Search
        </h2>
        
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter 3-letter IATA code (e.g., CGK, NBO, JFK)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <p className="mt-1 text-xs text-purple-200">
                Enter a 3-letter IATA code for exact airport lookup
              </p>
            </div>
            
            <Button 
              className="bg-purple hover:bg-purple-600 text-white"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span>
                  Searching...
                </span>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {airportData && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4">
                {airportData.name} 
                <span className="ml-2 text-purple">({airportData.iata})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-light">
                <p>Location: {airportData.city}, {airportData.country}</p>
                <p>ICAO: {airportData.icao}</p>
                <p>Latitude: {airportData.lat}</p>
                <p>Longitude: {airportData.lon}</p>
                <p>Altitude: {airportData.alt}ft</p>
                <p>Timezone: UTC{airportData.timezone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AirportAirlineSearch;
