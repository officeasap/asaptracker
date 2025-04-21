import React, { useState, useEffect } from 'react';
import { SuggestResult } from '@/services/aviationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Building2, MapPin, Clock, Plane, Phone, Globe, Map, Info, AlertTriangle, Utensils, Coffee, BusFront, Train, Car, ArrowUpDown, Loader2, LineChart, ShoppingCart } from 'lucide-react';

interface AirportDetailProps {
  airport: SuggestResult;
}

export const AirportDetail: React.FC<AirportDetailProps> = ({ airport }) => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const terminals = [
    { name: 'Terminal 1', international: true, domestic: true, airlines: ['Garuda Indonesia', 'Singapore Airlines', 'Emirates'] },
    { name: 'Terminal 2', international: true, domestic: true, airlines: ['Lion Air', 'Batik Air', 'Thai Airways'] },
    { name: 'Terminal 3', international: true, domestic: false, airlines: ['ANA', 'Cathay Pacific', 'Qatar Airways'] }
  ];
  
  const facilities = {
    dining: [
      { name: 'Traditional Indonesian Food', location: 'Terminal 1, 2F', rating: 4.5 },
      { name: 'Starbucks Coffee', location: 'Terminal 2, 3F', rating: 4.3 },
      { name: 'Sushi Express', location: 'Terminal 3, 1F', rating: 4.1 }
    ],
    shopping: [
      { name: 'Duty Free', location: 'Terminal 1, 3F', rating: 4.2 },
      { name: 'Batik Keris', location: 'Terminal 2, 2F', rating: 4.5 },
      { name: 'Periplus Books', location: 'Terminal 3, 1F', rating: 4.0 }
    ],
    services: [
      { name: 'Prayer Room', location: 'All Terminals', rating: 4.7 },
      { name: 'Currency Exchange', location: 'Terminal 1, 2, 3', rating: 4.0 },
      { name: 'Sleeping Pods', location: 'Terminal 3', rating: 4.8 }
    ]
  };
  
  const transportation = {
    train: { available: true, info: 'Airport Express Train to city center every 15 minutes' },
    bus: { available: true, info: 'Public buses and airport shuttles available at all terminals' },
    taxi: { available: true, info: '24/7 taxi service, fare approx. $15-25 to city center' },
    rideshare: { available: true, info: 'Grab and Gojek pickup zones at designated areas' }
  };
  
  const traffic = {
    departures: { count: 148, onTime: 132, delayed: 12, cancelled: 4 },
    arrivals: { count: 152, onTime: 140, delayed: 11, cancelled: 1 }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-[#8B0000] mb-4" />
        <h3 className="text-xl font-medium mb-2">Loading Airport Information</h3>
        <p className="text-gray-light">
          Fetching details for {airport.name} ({airport.iata_code})
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        <div className="flex-1">
          <Card className="p-6 bg-[#1A1A1A] border-[#8B0000]/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-1">{airport.name}</h3>
                <div className="flex items-center text-sm text-gray-light mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-[#8B0000]" />
                  <span>{airport.city}, {airport.country_code || 'Unknown'}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-[#8B0000]/20 px-2 py-1 rounded text-sm">
                    <Plane className="h-3.5 w-3.5 text-[#8B0000]" />
                    <span>{airport.iata_code}</span>
                  </div>
                  {airport.icao_code && (
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-sm">
                      <Info className="h-3.5 w-3.5 text-gray-light" />
                      <span>{airport.icao_code}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-sm">
                    <Clock className="h-3.5 w-3.5 text-gray-light" />
                    <span>Local time: {currentTime}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-[#8B0000]">
                  {airport.iata_code}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="bg-transparent border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                onClick={() => window.open(`/flight-schedule?airport=${airport.iata_code}`, '_blank')}
              >
                <Plane className="mr-2 h-4 w-4" />
                Flight Schedule
              </Button>
              
              <Button 
                variant="outline"
                className="bg-transparent border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                onClick={() => window.open(`/global-weather?location=${airport.city}`, '_blank')}
              >
                <Globe className="mr-2 h-4 w-4" />
                Weather
              </Button>
              
              <Button 
                variant="outline"
                className="bg-transparent border-[#8B0000] text-white hover:bg-[#8B0000]/10"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${airport.name} ${airport.city}`, '_blank')}
              >
                <Map className="mr-2 h-4 w-4" />
                Directions
              </Button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-[#8B0000]" />
                Current Traffic Status
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-light mb-1 flex items-center">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                    <span>Departures ({traffic.departures.count} flights today)</span>
                  </p>
                  <Progress value={90} className="h-2 bg-white/10" />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-green-400">{Math.round((traffic.departures.onTime / traffic.departures.count) * 100)}% On Time</span>
                    <span className="text-yellow-400">{Math.round((traffic.departures.delayed / traffic.departures.count) * 100)}% Delayed</span>
                    <span className="text-red-400">{Math.round((traffic.departures.cancelled / traffic.departures.count) * 100)}% Cancelled</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-light mb-1 flex items-center">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                    <span>Arrivals ({traffic.arrivals.count} flights today)</span>
                  </p>
                  <Progress value={92} className="h-2 bg-white/10" />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-green-400">{Math.round((traffic.arrivals.onTime / traffic.arrivals.count) * 100)}% On Time</span>
                    <span className="text-yellow-400">{Math.round((traffic.arrivals.delayed / traffic.arrivals.count) * 100)}% Delayed</span>
                    <span className="text-red-400">{Math.round((traffic.arrivals.cancelled / traffic.arrivals.count) * 100)}% Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:w-80">
          <Card className="p-6 h-full bg-[#1A1A1A] border-[#8B0000]/20">
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-[#8B0000]" />
              Terminal Information
            </h4>
            
            <div className="space-y-4">
              {terminals.map((terminal) => (
                <div key={terminal.name} className="border-b border-white/10 pb-4 last:border-0">
                  <h5 className="font-medium mb-2">{terminal.name}</h5>
                  <div className="text-sm">
                    <p className="mb-1 flex items-center">
                      <Plane className="h-3.5 w-3.5 mr-1 text-[#8B0000]" />
                      <span>
                        {terminal.international && terminal.domestic 
                          ? 'International & Domestic' 
                          : terminal.international 
                          ? 'International Only' 
                          : 'Domestic Only'}
                      </span>
                    </p>
                    <p className="text-gray-light text-xs">
                      Airlines: {terminal.airlines.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-light text-gray-light hover:bg-white/10 text-xs"
                onClick={() => setActiveTab('terminals')}
              >
                <Info className="mr-1 h-3 w-3" />
                View All Terminals
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
          >
            <Info className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="terminals"
            className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Terminals
          </TabsTrigger>
          <TabsTrigger 
            value="facilities"
            className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
          >
            <Utensils className="h-4 w-4 mr-2" />
            Facilities
          </TabsTrigger>
          <TabsTrigger 
            value="transportation"
            className="data-[state=active]:bg-[#8B0000] data-[state=active]:text-white"
          >
            <BusFront className="h-4 w-4 mr-2" />
            Transportation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card className="p-6 bg-[#1A1A1A] border-[#8B0000]/20">
            <h4 className="text-xl font-medium mb-4">About {airport.name}</h4>
            <p className="text-gray-light mb-4">
              {airport.name} ({airport.iata_code}) is a major international airport serving {airport.city}, {airport.country_code}. 
              The airport offers a range of domestic and international flights to destinations worldwide.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
              <div>
                <h5 className="font-medium mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-[#8B0000]" />
                  Travel Advisory
                </h5>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-sm">
                    Arrive at least 3 hours before international flights and 2 hours before domestic flights. 
                    Check with your airline for any specific requirements or restrictions.
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-[#8B0000]" />
                  Contact Information
                </h5>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-2 text-gray-light" />
                    <span>+62 21 550 5079</span>
                  </p>
                  <p className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-2 text-gray-light" />
                    <a href="#" className="text-[#8B0000] hover:underline">www.airport-website.com</a>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="terminals" className="mt-6">
          <Card className="p-6 bg-[#1A1A1A] border-[#8B0000]/20">
            <h4 className="text-xl font-medium mb-4">Terminal Information</h4>
            <p className="text-gray-light mb-6">
              {airport.name} has {terminals.length} passenger terminals serving both domestic and international flights.
            </p>
            
            <div className="space-y-6">
              {terminals.map((terminal, index) => (
                <div key={terminal.name} className={index < terminals.length - 1 ? "pb-6 border-b border-white/10" : ""}>
                  <h5 className="text-lg font-medium mb-3">{terminal.name}</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium mb-2 text-[#8B0000]">Flight Types</h6>
                      <div className="flex gap-2 mb-4">
                        {terminal.international && (
                          <span className="bg-[#8B0000]/20 text-white px-2 py-1 rounded-full text-xs">
                            International
                          </span>
                        )}
                        {terminal.domestic && (
                          <span className="bg-white/10 text-white px-2 py-1 rounded-full text-xs">
                            Domestic
                          </span>
                        )}
                      </div>
                      
                      <h6 className="text-sm font-medium mb-2 text-[#8B0000]">Airlines</h6>
                      <div className="flex flex-wrap gap-2">
                        {terminal.airlines.map(airline => (
                          <span key={airline} className="bg-white/10 text-white px-2 py-1 rounded text-xs">
                            {airline}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-sm font-medium mb-2 text-[#8B0000]">Facilities</h6>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <ShoppingCart className="h-3.5 w-3.5 mr-2 text-gray-light" />
                          <span>Shopping & Duty Free</span>
                        </p>
                        <p className="flex items-center">
                          <Utensils className="h-3.5 w-3.5 mr-2 text-gray-light" />
                          <span>Food & Beverage</span>
                        </p>
                        <p className="flex items-center">
                          <Coffee className="h-3.5 w-3.5 mr-2 text-gray-light" />
                          <span>Lounges</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="facilities" className="mt-6">
          <Card className="p-6 bg-[#1A1A1A] border-[#8B0000]/20">
            <h4 className="text-xl font-medium mb-4">Airport Facilities</h4>
            <p className="text-gray-light mb-6">
              {airport.name} offers a wide range of facilities and services for travelers.
            </p>
            
            <div className="space-y-8">
              <div>
                <h5 className="text-lg font-medium mb-3 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Dining Options
                </h5>
                <div className="space-y-3">
                  {facilities.dining.map(facility => (
                    <div key={facility.name} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex justify-between">
                        <h6 className="font-medium">{facility.name}</h6>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`h-2 w-2 rounded-full ml-1 ${i < Math.floor(facility.rating) ? 'rating-circle-red' : 'bg-white/20'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-light mt-1">Location: {facility.location}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-lg font-medium mb-3 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Shopping
                </h5>
                <div className="space-y-3">
                  {facilities.shopping.map(facility => (
                    <div key={facility.name} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex justify-between">
                        <h6 className="font-medium">{facility.name}</h6>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`h-2 w-2 rounded-full ml-1 ${i < Math.floor(facility.rating) ? 'rating-circle-red' : 'bg-white/20'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-light mt-1">Location: {facility.location}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-lg font-medium mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Services
                </h5>
                <div className="space-y-3">
                  {facilities.services.map(facility => (
                    <div key={facility.name} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex justify-between">
                        <h6 className="font-medium">{facility.name}</h6>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`h-2 w-2 rounded-full ml-1 ${i < Math.floor(facility.rating) ? 'rating-circle-red' : 'bg-white/20'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-light mt-1">Location: {facility.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="transportation" className="mt-6">
          <Card className="p-6 bg-[#1A1A1A] border-[#8B0000]/20">
            <h4 className="text-xl font-medium mb-4">Transportation Options</h4>
            <p className="text-gray-light mb-6">
              There are several ways to travel to and from {airport.name}.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3 flex items-center">
                  <Train className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Airport Train
                </h5>
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 h-full">
                  {transportation.train.available ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Available</span>
                      </div>
                      <p className="text-sm text-gray-light">{transportation.train.info}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Not Available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3 flex items-center">
                  <BusFront className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Bus Service
                </h5>
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 h-full">
                  {transportation.bus.available ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Available</span>
                      </div>
                      <p className="text-sm text-gray-light">{transportation.bus.info}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Not Available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Taxi & Rideshare
                </h5>
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 h-full">
                  {transportation.taxi.available ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Available</span>
                      </div>
                      <p className="text-sm text-gray-light">{transportation.taxi.info}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Not Available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-[#8B0000]" />
                  Parking
                </h5>
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 h-full">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm font-medium">Available</span>
                    </div>
                    <p className="text-sm text-gray-light">
                      Short-term and long-term parking available at all terminals. 
                      Rates start from $2/hour for short-term and $15/day for long-term parking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button 
                className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${airport.name} ${airport.city}`, '_blank')}
              >
                <Map className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
