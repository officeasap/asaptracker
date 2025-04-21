
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { LocateFixed, RefreshCw, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SearchFormProps {
  loading: boolean;
  customLat: string;
  customLng: string;
  distance: number;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onDistanceChange: (value: number) => void;
  onDetectLocation: () => void;
  onSearch: () => void;
  onRefresh: () => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  loading,
  customLat,
  customLng,
  distance,
  onLatChange,
  onLngChange,
  onDistanceChange,
  onDetectLocation,
  onSearch,
  onRefresh,
}) => {
  return (
    <div>
      <h3 className="text-xl mb-4 font-medium">Find Airports Near You</h3>
      <p className="text-gray-light mb-4">
        Discover airports in your vicinity. We can automatically detect your location or you can enter coordinates manually.
      </p>
      
      <div className="flex gap-2 mb-4">
        <Button 
          className="bg-purple hover:bg-purple-600 text-white" 
          onClick={onDetectLocation}
          disabled={loading}
        >
          <LocateFixed className="mr-2 h-4 w-4" />
          Detect My Location
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-transparent border-gray-light text-gray-light hover:bg-white/10"
          onClick={onRefresh}
          disabled={loading || !customLat || !customLng}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Results
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-light mb-1">Latitude</label>
            <Input 
              value={customLat}
              onChange={(e) => onLatChange(e.target.value)}
              placeholder="e.g. 40.730610"
              className="bg-gray-dark/50 border-gray-dark text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-light mb-1">Longitude</label>
            <Input 
              value={customLng}
              onChange={(e) => onLngChange(e.target.value)}
              placeholder="e.g. -73.935242"
              className="bg-gray-dark/50 border-gray-dark text-white"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-light">Search Distance</label>
            <span className="text-sm text-purple-300">{distance} km</span>
          </div>
          <Slider 
            value={[distance]} 
            onValueChange={(values) => onDistanceChange(values[0])}
            min={10}
            max={300}
            step={10}
            className="py-4"
          />
        </div>
        
        <Button 
          className="w-full bg-purple hover:bg-purple-600 text-white purple-glow" 
          onClick={onSearch}
          disabled={loading || !customLat || !customLng}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search This Location
        </Button>
      </div>
    </div>
  );
};
