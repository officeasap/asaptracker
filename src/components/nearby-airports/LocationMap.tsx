
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  userLocation: { lat: number; lng: number } | null;
}

export const LocationMap: React.FC<LocationMapProps> = ({ userLocation }) => {
  if (!userLocation) {
    return (
      <div className="h-60 bg-gray-dark/30 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-10 w-10 text-gray-light mx-auto mb-2" />
          <p className="text-gray-light">No location selected</p>
          <p className="text-sm text-gray-light mt-2">Use the detect button or enter coordinates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-60 bg-gray-dark rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=${userLocation.lat},${userLocation.lng}&zoom=9&size=600x400&maptype=roadmap&markers=color:red%7C${userLocation.lat},${userLocation.lng}')] bg-cover bg-center opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center">
          <MapPin className="h-10 w-10 text-purple mx-auto mb-2" />
          <p className="font-medium">Current Location</p>
          <p className="text-sm text-gray-light">Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}</p>
        </div>
      </div>
    </div>
  );
};
