
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { timezoneData } from '@/data/timezones';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CountryCityDropdownProps {
  onSelectCity: (city: string) => void;
  selectedCity?: string;
}

const CountryCityDropdown: React.FC<CountryCityDropdownProps> = ({ 
  onSelectCity,
  selectedCity 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  
  // Group cities by country
  const countriesWithCities = useMemo(() => {
    const countries: Record<string, string[]> = {};
    
    timezoneData.forEach(item => {
      if (!countries[item.country]) {
        countries[item.country] = [];
      }
      
      if (!countries[item.country].includes(item.city)) {
        countries[item.country].push(item.city);
      }
    });
    
    // Sort countries alphabetically
    return Object.entries(countries).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);
  
  // Calculate total number of cities
  const totalCities = useMemo(() => {
    return countriesWithCities.reduce((sum, [_, cities]) => sum + cities.length, 0);
  }, [countriesWithCities]);

  // Initialize with African countries expanded by default
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    const africanCountries = [
      'Kenya', 'Uganda', 'Nigeria', 'Burkina Faso', 'Mali', 
      'Niger', 'Morocco', 'Tanzania', 'Rwanda', 'Cameroon',
      'Ghana', 'South Africa', 'Egypt', 'Ethiopia', 'Senegal'
    ];
    
    africanCountries.forEach(country => {
      initialExpanded[country] = true;
    });
    
    setExpandedCountries(initialExpanded);
  }, []);

  // Filter countries and cities based on search term
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) {
      return countriesWithCities;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    return countriesWithCities.map(([country, cities]) => {
      const filteredCities = cities.filter(city => 
        city.toLowerCase().includes(searchLower)
      );
      
      if (country.toLowerCase().includes(searchLower) || filteredCities.length > 0) {
        return [country, filteredCities.length > 0 ? filteredCities : cities];
      }
      
      return null;
    }).filter(Boolean) as [string, string[]][];
  }, [countriesWithCities, searchTerm]);

  const toggleCountry = (country: string) => {
    setExpandedCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  const handleCitySelection = (city: string) => {
    onSelectCity(city);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between bg-gray-dark/50 border-gray-dark text-white hover:bg-gray-dark/70 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin className="h-4 w-4 text-purple flex-shrink-0" />
          <span className="truncate">
            {selectedCity || `Select from ${totalCities} cities worldwide`}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border border-gray-dark bg-gray-dark/90 backdrop-blur-md shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-light" />
              <Input
                placeholder="Search countries or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[300px] overflow-y-auto">
            <div className="p-2">
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-gray-light">
                  No countries or cities found
                </div>
              ) : (
                filteredCountries.map(([country, cities]) => (
                  <div key={country} className="mb-1">
                    <button
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded transition-colors",
                        expandedCountries[country] ? "bg-white/10" : "hover:bg-white/5"
                      )}
                      onClick={() => toggleCountry(country)}
                    >
                      <span className="font-medium">{country}</span>
                      {expandedCountries[country] ? (
                        <ChevronUp className="h-4 w-4 text-gray-light" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-light" />
                      )}
                    </button>
                    
                    {expandedCountries[country] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {cities.map((city) => (
                          <button
                            key={`${country}-${city}`}
                            className={cn(
                              "w-full text-left p-1.5 rounded-sm text-sm transition-colors",
                              selectedCity === city
                                ? "bg-purple/20 text-purple-100"
                                : "text-gray-light hover:bg-white/5 hover:text-white"
                            )}
                            onClick={() => handleCitySelection(city)}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="p-2 border-t border-gray-dark/50 flex justify-between items-center">
            <span className="text-xs text-gray-light">
              {filteredCountries.reduce((sum, [_, cities]) => sum + cities.length, 0)} cities displayed
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-light hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCityDropdown;
