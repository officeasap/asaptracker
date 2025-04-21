
import React from 'react';
import { Loader2, Plane, MapPin } from 'lucide-react';
import type { Airport } from '@/services/shared/types';

interface AirportListProps {
  loading: boolean;
  airports: Airport[];
  distance: number;
}

export const AirportList: React.FC<AirportListProps> = ({ loading, airports, distance }) => {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {loading ? 'Searching for airports...' : `${airports.length} Airports Found`}
        </h3>
        {airports.length > 0 && (
          <span className="text-sm text-gray-light">
            Showing results within {distance} km
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="animate-spin h-8 w-8 text-purple" />
        </div>
      ) : airports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {airports.map((airport) => (
            <div key={airport.iata_code} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-full">
                  <Plane className="h-5 w-5 text-purple" />
                </div>
                <div>
                  <h4 className="font-medium">{airport.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-white/10 text-xs px-2 py-1 rounded">
                      {airport.iata_code}
                    </span>
                    <span className="text-gray-light text-xs">
                      {airport.country_code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-light mt-2">
                    {airport.city || 'Unknown city'}
                  </p>
                  <div className="mt-2 text-xs text-gray-light flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{airport.distance ? `${airport.distance.toFixed(1)} km away` : 'Distance unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Plane className="h-12 w-12 text-gray-light mx-auto mb-3" />
          <p className="text-gray-light">No airports found within the specified range.</p>
          <p className="text-sm text-gray-light mt-2">Try increasing the search distance or changing the location.</p>
        </div>
      )}
    </div>
  );
};
