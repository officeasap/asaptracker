
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { fetchSuggestions, SuggestResult } from '@/services/aviationService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AutocompleteSearchProps {
  onSelect: (item: SuggestResult) => void;
  placeholder?: string;
  className?: string;
  type?: 'all' | 'airport' | 'city' | 'airline';
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  onSelect,
  placeholder = "Search airports, cities or airlines...",
  className,
  type = 'all'
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SuggestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchData = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await fetchSuggestions(query);
        
        // Filter by type if specified
        const filteredResults = type === 'all' 
          ? data 
          : data.filter(item => item.type === type);
        
        setResults(filteredResults);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        toast.error("Couldn't load suggestions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [query, type]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleItemSelect = (item: SuggestResult) => {
    onSelect(item);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-12"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading ? (
            <Loader2 className="animate-spin h-4 w-4 text-gray-light" />
          ) : query ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-1 hover:bg-transparent text-gray-light"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          ) : null}
          <Search className="text-gray-light h-4 w-4" />
        </div>
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-40 w-full mt-1 bg-gray-dark border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            {results.map((item, index) => (
              <button
                key={`${item.type}-${item.iata_code || item.name}-${index}`}
                className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
                onClick={() => handleItemSelect(item)}
              >
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full text-xs",
                  item.type === 'airport' && "bg-blue-500/20 text-blue-400",
                  item.type === 'city' && "bg-green-500/20 text-green-400",
                  item.type === 'airline' && "bg-purple/20 text-purple-400"
                )}>
                  {item.type === 'airport' ? 'A' : item.type === 'city' ? 'C' : 'L'}
                </div>
                <div>
                  <div className="font-medium">
                    {item.name}
                    {item.iata_code && <span className="ml-2 text-xs bg-white/10 px-1.5 py-0.5 rounded">{item.iata_code}</span>}
                  </div>
                  {(item.city || item.country_code) && (
                    <div className="text-xs text-gray-light">
                      {item.city && <span>{item.city}</span>}
                      {item.city && item.country_code && <span>, </span>}
                      {item.country_code && <span>{item.country_code}</span>}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;
