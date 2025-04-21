import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RouteMap } from '@/components/RouteMap';
import { Button } from '@/components/ui/button';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { SuggestResult } from '@/services/aviationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Plane, ArrowDownUp, ArrowRight, Info, MapPin, Globe, Search } from 'lucide-react';

const RouteMappingPage = () => {
  const [departureAirport, setDepartureAirport] = useState<SuggestResult | null>(null);
  const [arrivalAirport, setArrivalAirport] = useState<SuggestResult | null>(null);
  const [mapType, setMapType] = useState<'interactive' | 'simple'>('interactive');

  const handleSwapAirports = () => {
    const temp = departureAirport;
    setDepartureAirport(arrivalAirport);
    setArrivalAirport(temp);
  };

  const setJakartaSingaporeRoute = () => {
    setDepartureAirport({
      name: "Jakarta Soekarno-Hatta International",
      iata_code: "CGK",
      icao_code: "WIII",
      city: "Jakarta",
      country_code: "Indonesia",
      type: "airport"
    });
    setArrivalAirport({
      name: "Singapore Changi International",
      iata_code: "SIN",
      icao_code: "WSSS",
      city: "Singapore",
      country_code: "Singapore",
      type: "airport"
    });
  };

  const setBaliTokyoRoute = () => {
    setDepartureAirport({
      name: "Ngurah Rai International",
      iata_code: "DPS",
      icao_code: "WADD",
      city: "Denpasar",
      country_code: "Indonesia",
      type: "airport"
    });
    setArrivalAirport({
      name: "Tokyo Narita International",
      iata_code: "NRT",
      icao_code: "RJAA",
      city: "Tokyo",
      country_code: "Japan",
      type: "airport"
    });
  };

  const setJakartaMelbourneRoute = () => {
    setDepartureAirport({
      name: "Jakarta Soekarno-Hatta International",
      iata_code: "CGK",
      icao_code: "WIII",
      city: "Jakarta",
      country_code: "Indonesia",
      type: "airport"
    });
    setArrivalAirport({
      name: "Melbourne Tullamarine Airport",
      iata_code: "MEL",
      icao_code: "YMML",
      city: "Melbourne",
      country_code: "Australia",
      type: "airport"
    });
  };

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Pemetaan <span className="text-[#8B0000] animate-text-glow">Rute Penerbangan</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium font-space mb-4 animate-fade-in">
              Flight Route Mapping
            </h2>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Selamat menjelajahi! Visualize and explore flight routes between any two airports worldwide.
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Search Controls */}
      <section className="py-10 px-4 bg-[#1A1A1A]/80">
        <div className="max-w-5xl mx-auto glass-panel p-6 md:p-8 backdrop-blur-md border-[#8B0000]/30">
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1">
              <p className="mb-2 text-sm text-gray-light">From (Dari)</p>
              <div className="relative">
                <AutocompleteSearch 
                  placeholder="Departure airport..." 
                  onSelect={setDepartureAirport}
                  type="airport"
                  className="w-full rounded-[14px] bg-dark border-[#8B0000]/20 text-white"
                />
                <Plane className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light rotate-45" />
              </div>
              {departureAirport && (
                <div className="mt-2 text-sm">
                  <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded">
                    {departureAirport.name} ({departureAirport.iata_code})
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/5 hover:bg-white/10"
                onClick={handleSwapAirports}
              >
                <ArrowDownUp className="h-4 w-4 rotate-90 md:rotate-0" />
              </Button>
            </div>
            
            <div className="flex-1">
              <p className="mb-2 text-sm text-gray-light">To (Ke)</p>
              <div className="relative">
                <AutocompleteSearch 
                  placeholder="Arrival airport..." 
                  onSelect={setArrivalAirport}
                  type="airport"
                  className="w-full rounded-[14px] bg-dark border-[#8B0000]/20 text-white"
                />
                <Plane className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light -rotate-45" />
              </div>
              {arrivalAirport && (
                <div className="mt-2 text-sm">
                  <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded">
                    {arrivalAirport.name} ({arrivalAirport.iata_code})
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Tabs defaultValue="interactive" onValueChange={(v) => setMapType(v as 'interactive' | 'simple')} className="w-full max-w-xs">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="interactive" 
                  className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Interactive
                </TabsTrigger>
                <TabsTrigger 
                  value="simple" 
                  className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
                >
                  <Map className="h-3 w-3 mr-1" />
                  Simple
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]"
              disabled={!departureAirport || !arrivalAirport}
            >
              <Search className="mr-2 h-4 w-4" />
              Show Route
            </Button>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-8 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1A1A1A] border border-[#8B0000]/20 rounded-lg overflow-hidden h-[60vh] relative">
            <RouteMap 
              from={departureAirport} 
              to={arrivalAirport} 
              type={mapType} 
            />
            
            {!departureAirport || !arrivalAirport ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <Map className="h-12 w-12 text-[#8B0000] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select Airports to View Route</h3>
                <p className="text-gray-light text-center max-w-md px-4">
                  Enter departure and arrival airports to visualize the flight route on the map.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      
      {/* Popular Routes Section */}
      <section className="py-12 px-4 bg-[#1A1A1A] relative">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/28f1aa86-908f-4a07-837d-7a69fa78941c.png')] bg-repeat opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold font-space mb-3">Rute Populer dari Indonesia</h3>
            <h4 className="text-xl font-medium text-[#8B0000] mb-3">Popular Routes from Indonesia</h4>
            <p className="text-gray-light max-w-2xl mx-auto">
              Explore the most frequently flown routes connecting Indonesian cities with international destinations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Jakarta to Singapore */}
            <div className="p-6 border border-[#8B0000]/20 rounded-lg bg-dark/30 backdrop-blur-sm hover:shadow-[0_0_12px_#A80000] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Jakarta</h5>
                    <p className="text-xs text-gray-light">CGK</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-light mx-2" />
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Singapore</h5>
                    <p className="text-xs text-gray-light">SIN</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex-1">
                  <p className="text-gray-light mb-1">Distance</p>
                  <p className="font-medium">884 km</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-gray-light mb-1">Flight Time</p>
                  <p className="font-medium">1h 35m</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-light mb-1">Daily Flights</p>
                  <p className="font-medium">32</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-transparent border border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                onClick={setJakartaSingaporeRoute}
              >
                <Map className="h-4 w-4 mr-2" />
                View Route
              </Button>
            </div>
            
            {/* Bali to Tokyo */}
            <div className="p-6 border border-[#8B0000]/20 rounded-lg bg-dark/30 backdrop-blur-sm hover:shadow-[0_0_12px_#A80000] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Denpasar</h5>
                    <p className="text-xs text-gray-light">DPS</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-light mx-2" />
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Tokyo</h5>
                    <p className="text-xs text-gray-light">NRT</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex-1">
                  <p className="text-gray-light mb-1">Distance</p>
                  <p className="font-medium">5,239 km</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-gray-light mb-1">Flight Time</p>
                  <p className="font-medium">7h 10m</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-light mb-1">Daily Flights</p>
                  <p className="font-medium">8</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-transparent border border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                onClick={setBaliTokyoRoute}
              >
                <Map className="h-4 w-4 mr-2" />
                View Route
              </Button>
            </div>
            
            {/* Jakarta to Melbourne */}
            <div className="p-6 border border-[#8B0000]/20 rounded-lg bg-dark/30 backdrop-blur-sm hover:shadow-[0_0_12px_#A80000] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Jakarta</h5>
                    <p className="text-xs text-gray-light">CGK</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-light mx-2" />
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8B0000]" />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Melbourne</h5>
                    <p className="text-xs text-gray-light">MEL</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex-1">
                  <p className="text-gray-light mb-1">Distance</p>
                  <p className="font-medium">5,342 km</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-gray-light mb-1">Flight Time</p>
                  <p className="font-medium">6h 45m</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-gray-light mb-1">Daily Flights</p>
                  <p className="font-medium">5</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-transparent border border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                onClick={setJakartaMelbourneRoute}
              >
                <Map className="h-4 w-4 mr-2" />
                View Route
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default RouteMappingPage;
