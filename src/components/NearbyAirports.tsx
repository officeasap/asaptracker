
import React, { useState, useEffect } from 'react';
import { fetchNearbyAirports, getUserPosition } from '@/services/aviationService';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { SearchForm } from './nearby-airports/SearchForm';
import { LocationMap } from './nearby-airports/LocationMap';
import { AirportList } from './nearby-airports/AirportList';
import type { Airport } from '@/services/shared/types';

const NearbyAirports: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [customLat, setCustomLat] = useState<string>('');
  const [customLng, setCustomLng] = useState<string>('');
  const [distance, setDistance] = useState<number>(100);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    setLoading(true);
    try {
      const position = await getUserPosition();
      if (position) {
        setUserLocation(position);
        setCustomLat(position.lat.toString());
        setCustomLng(position.lng.toString());
        await searchNearbyAirports(position.lat, position.lng, distance);
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      toast.error("Could not detect your location. Please enter coordinates manually.");
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyAirports = async (lat: number, lng: number, searchDistance: number) => {
    setLoading(true);
    try {
      const data = await fetchNearbyAirports(lat, lng, searchDistance);
      if (data.length === 0) {
        toast.warning(`No airports found within ${searchDistance} km of this location`);
        setAirports([]);
      } else {
        setAirports(data);
        toast.success(`Found ${data.length} airports near this location`);
      }
    } catch (error) {
      console.error("Error fetching nearby airports:", error);
      toast.error("Failed to fetch nearby airports");
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSearch = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid latitude and longitude values");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Latitude must be between -90 and 90, and longitude between -180 and 180");
      return;
    }
    
    searchNearbyAirports(lat, lng, distance);
  };

  return (
    <section className="py-8 max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-purple h-6 w-6" />
        <h2 className="text-2xl font-semibold font-space">Nearby Airports</h2>
      </div>
      
      <div className="glass-panel p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchForm 
            loading={loading}
            customLat={customLat}
            customLng={customLng}
            distance={distance}
            onLatChange={setCustomLat}
            onLngChange={setCustomLng}
            onDistanceChange={(value) => setDistance(value)}
            onDetectLocation={detectUserLocation}
            onSearch={handleCustomSearch}
            onRefresh={() => searchNearbyAirports(
              parseFloat(customLat), 
              parseFloat(customLng), 
              distance
            )}
          />
          <LocationMap userLocation={userLocation} />
        </div>
      </div>
      
      <AirportList 
        loading={loading}
        airports={airports}
        distance={distance}
      />
    </section>
  );
};

export default NearbyAirports;
