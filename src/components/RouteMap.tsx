
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { SuggestResult } from '@/services/aviationService';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteMapProps {
  from?: SuggestResult | null;
  to?: SuggestResult | null;
  type?: 'interactive' | 'simple';
}

// This would normally come from an environment variable
// In a production app, this should be properly secured
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2t1MDF4a2E5MjlkYzJ1bjFvYWdwa2ppZSJ9.OJn9VE-VxTdNFF5ZnJaYFw';

export const RouteMap: React.FC<RouteMapProps> = ({ 
  from, 
  to, 
  type = 'interactive' 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: type === 'interactive' ? 'globe' : 'mercator',
      zoom: 1.5,
      center: [106.8451, -6.2088], // Jakarta, Indonesia as default center
      pitch: type === 'interactive' ? 45 : 0,
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();
    
    if (type === 'interactive') {
      // Add atmosphere and fog effects for globe view
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(20, 20, 20)',
          'high-color': 'rgb(40, 40, 50)',
          'horizon-blend': 0.2,
        });
      });
      
      // Rotation animation for globe
      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;
      
      // Spin globe function
      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }
      
      // Event listeners for interaction
      map.current.on('mousedown', () => {
        userInteracting = true;
      });
      
      map.current.on('dragstart', () => {
        userInteracting = true;
      });
      
      map.current.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });
      
      map.current.on('touchend', () => {
        userInteracting = false;
        spinGlobe();
      });
      
      map.current.on('moveend', () => {
        spinGlobe();
      });
      
      // Start the globe spinning
      spinGlobe();
    }
    
    return () => {
      map.current?.remove();
    };
  }, [type]);
  
  // Draw route between airports when both are selected
  useEffect(() => {
    if (!map.current || !from || !to) return;
    
    const drawRoute = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make sure the map is loaded
        if (!map.current.isStyleLoaded()) {
          await new Promise<void>((resolve) => {
            map.current?.once('style.load', () => resolve());
          });
        }
        
        // Remove any existing route layers
        if (map.current.getSource('route')) {
          map.current.removeLayer('route-line');
          map.current.removeSource('route');
        }
        
        if (map.current.getSource('airports')) {
          map.current.removeLayer('airport-points');
          map.current.removeSource('airports');
        }
        
        // Get coordinates
        const fromCoords = [
          Number(from.longitude || from.lon || 0), 
          Number(from.latitude || from.lat || 0)
        ];
        const toCoords = [
          Number(to.longitude || to.lon || 0), 
          Number(to.latitude || to.lat || 0)
        ];
        
        // If we don't have valid coordinates, try to geocode using the airport names
        if (!fromCoords[0] || !toCoords[0]) {
          setError("Couldn't get coordinates for one or both airports");
          setLoading(false);
          return;
        }
        
        // Calculate a great circle route
        // In a real app, we'd use an API for this
        // Here we'll generate some points along the great circle
        const points = generateGreatCirclePoints(
          [fromCoords[0], fromCoords[1]],
          [toCoords[0], toCoords[1]],
          100
        );
        
        // Add route source and layer
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: points
            }
          }
        });
        
        map.current.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#8B0000',
            'line-width': 3,
            'line-opacity': 0.8,
            'line-dasharray': [0, 2, 1]
          }
        });
        
        // Add airport markers
        map.current.addSource('airports', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  name: from.name,
                  code: from.iata_code,
                  city: from.city,
                  country: from.country_code,
                  type: 'departure'
                },
                geometry: {
                  type: 'Point',
                  coordinates: fromCoords
                }
              },
              {
                type: 'Feature',
                properties: {
                  name: to.name,
                  code: to.iata_code,
                  city: to.city,
                  country: to.country_code,
                  type: 'arrival'
                },
                geometry: {
                  type: 'Point',
                  coordinates: toCoords
                }
              }
            ]
          }
        });
        
        map.current.addLayer({
          id: 'airport-points',
          type: 'circle',
          source: 'airports',
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match',
              ['get', 'type'],
              'departure', '#C40000',
              'arrival', '#8B0000',
              '#000000'
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
        
        // Add popups for airports
        const popup1 = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'airport-popup',
        });
        
        const popup2 = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'airport-popup',
        });
        
        map.current.on('mouseenter', 'airport-points', (e) => {
          if (!e.features || e.features.length === 0) return;
          
          const feature = e.features[0];
          // TypeScript fix: Check that geometry is a Point before accessing coordinates
          if (feature.geometry.type !== 'Point') return;
          
          const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
          const properties = feature.properties || {};
          
          const popupContent = `
            <div class="p-2">
              <div class="font-semibold">${properties.name}</div>
              <div class="text-xs text-gray-300">${properties.city}, ${properties.country}</div>
              <div class="text-xs font-mono mt-1">${properties.code}</div>
            </div>
          `;
          
          // Use different popup instance for each point
          const popupToUse = properties.type === 'departure' ? popup1 : popup2;
          
          popupToUse
            .setLngLat(coords)
            .setHTML(popupContent)
            .addTo(map.current!);
        });
        
        map.current.on('mouseleave', 'airport-points', () => {
          popup1.remove();
          popup2.remove();
        });
        
        // Fit map to show the entire route
        const bounds = new mapboxgl.LngLatBounds();
        for (const coord of points) {
          bounds.extend(coord as [number, number]);
        }
        
        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
        
      } catch (err) {
        console.error(err);
        setError("Failed to load the route map");
      } finally {
        setLoading(false);
      }
    };
    
    drawRoute();
  }, [from, to]);
  
  // Generate points along the great circle route
  const generateGreatCirclePoints = (start: [number, number], end: [number, number], numPoints: number) => {
    // Convert to radians
    const lon1 = (start[0] * Math.PI) / 180;
    const lat1 = (start[1] * Math.PI) / 180;
    const lon2 = (end[0] * Math.PI) / 180;
    const lat2 = (end[1] * Math.PI) / 180;
    
    const points = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints;
      
      // Spherical linear interpolation
      const a = Math.sin((1 - f) * Math.PI) / Math.sin(Math.PI);
      const b = Math.sin(f * Math.PI) / Math.sin(Math.PI);
      
      const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
      const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
      const z = a * Math.sin(lat1) + b * Math.sin(lat2);
      
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
      const lon = Math.atan2(y, x);
      
      points.push([
        (lon * 180) / Math.PI,
        (lat * 180) / Math.PI
      ]);
    }
    
    return points;
  };
  
  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#8B0000] mb-2" />
            <p className="text-white">Loading route map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center max-w-sm text-center mx-4">
            <AlertTriangle className="h-8 w-8 text-[#8B0000] mb-2" />
            <p className="text-white mb-2">{error}</p>
            <p className="text-white/60 text-sm">Please make sure both airports have valid coordinates.</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 text-xs text-white/70 bg-black/40 px-2 py-1 rounded">
        Powered by Mapbox
      </div>
    </div>
  );
};
