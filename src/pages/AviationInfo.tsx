
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Globe, AlertTriangle, Landmark, BookIcon, Route } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AircraftDialog from '@/components/aviation-info/AircraftDialog';
import { Airport } from '@/services/shared/types';
import { Airline } from '@/services/shared/types';
import AirportDialog from '@/components/airports-airlines/AirportDialog';
import AirlineDialog from '@/components/airports-airlines/AirlineDialog';
import RouteDialog from '@/components/aviation-info/RouteDialog';
import TaxDialog from '@/components/aviation-info/TaxDialog';
import { fetchAircraftSpecifications, fetchRouteDetails, fetchAviationTaxDetails, type Aircraft, type RouteDetails, type AvTaxDetail } from '@/services/aircraftService';
import { toast } from 'sonner';

const AviationInfo = () => {
  // State for aircraft dialog
  const [aircraftDialogOpen, setAircraftDialogOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [loadingAircraft, setLoadingAircraft] = useState(false);

  // State for airport dialog
  const [airportDialogOpen, setAirportDialogOpen] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  // State for airline dialog
  const [airlineDialogOpen, setAirlineDialogOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);

  // State for route dialog
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // State for tax dialog
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<AvTaxDetail | null>(null);
  const [loadingTax, setLoadingTax] = useState(false);

  const handleAircraftSelect = async (aircraftName: string) => {
    setLoadingAircraft(true);
    setAircraftDialogOpen(true);
    try {
      const aircraftData = await fetchAircraftSpecifications(aircraftName);
      if (aircraftData) {
        setSelectedAircraft(aircraftData);
      } else {
        toast.error(`Could not find specifications for ${aircraftName}`);
      }
    } catch (error) {
      console.error("Error fetching aircraft data:", error);
      toast.error("Failed to load aircraft specifications");
    } finally {
      setLoadingAircraft(false);
    }
  };

  const handleAirportSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    setAirportDialogOpen(true);
  };

  const handleAirlineSelect = (airline: Airline) => {
    setSelectedAirline(airline);
    setAirlineDialogOpen(true);
  };

  const handleRouteSelect = async (fromCode: string, toCode: string) => {
    setLoadingRoute(true);
    setRouteDialogOpen(true);
    try {
      const routeData = await fetchRouteDetails(fromCode, toCode);
      setSelectedRoute(routeData);
    } catch (error) {
      console.error("Error fetching route data:", error);
      toast.error("Failed to load route details");
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleTaxSelect = async (taxCode: string) => {
    setLoadingTax(true);
    setTaxDialogOpen(true);
    try {
      const taxData = await fetchAviationTaxDetails(taxCode);
      setSelectedTax(taxData);
    } catch (error) {
      console.error("Error fetching tax data:", error);
      toast.error("Failed to load tax details");
    } finally {
      setLoadingTax(false);
    }
  };

  // Define mock data
  const mockAirports: Airport[] = [
    { 
      name: "Soekarno-Hatta International Airport", 
      iata_code: "CGK", 
      icao_code: "WIII", 
      city: "Jakarta", 
      country: "Indonesia", 
      country_code: "ID", 
      lat: -6.1254, 
      lon: 106.6558, 
      timezone: "Asia/Jakarta"
    },
    { 
      name: "Singapore Changi Airport", 
      iata_code: "SIN", 
      icao_code: "WSSS", 
      city: "Singapore", 
      country: "Singapore", 
      country_code: "SG", 
      lat: 1.3644, 
      lon: 103.9915, 
      timezone: "Asia/Singapore"
    },
    { 
      name: "Dubai International Airport", 
      iata_code: "DXB", 
      icao_code: "OMDB", 
      city: "Dubai", 
      country: "United Arab Emirates", 
      country_code: "AE", 
      lat: 25.2528, 
      lon: 55.3644, 
      timezone: "Asia/Dubai"
    },
    { 
      name: "Incheon International Airport", 
      iata_code: "ICN", 
      icao_code: "RKSI", 
      city: "Seoul", 
      country: "South Korea", 
      country_code: "KR", 
      lat: 37.4692, 
      lon: 126.4505, 
      timezone: "Asia/Seoul"
    },
    { 
      name: "Hamad International Airport", 
      iata_code: "DOH", 
      icao_code: "OTHH", 
      city: "Doha", 
      country: "Qatar", 
      country_code: "QA", 
      lat: 25.2608, 
      lon: 51.6138, 
      timezone: "Asia/Qatar"
    },
    { 
      name: "Tokyo Haneda Airport", 
      iata_code: "HND", 
      icao_code: "RJTT", 
      city: "Tokyo", 
      country: "Japan", 
      country_code: "JP", 
      lat: 35.5493, 
      lon: 139.7798, 
      timezone: "Asia/Tokyo"
    }
  ];

  const mockAirlines: Airline[] = [
    { 
      name: "Emirates", 
      iata_code: "EK", 
      icao_code: "UAE", 
      country_name: "United Arab Emirates", 
      country_code: "AE", 
      callsign: "EMIRATES" 
    },
    { 
      name: "Singapore Airlines", 
      iata_code: "SQ", 
      icao_code: "SIA", 
      country_name: "Singapore", 
      country_code: "SG", 
      callsign: "SINGAPORE" 
    },
    { 
      name: "Qatar Airways", 
      iata_code: "QR", 
      icao_code: "QTR", 
      country_name: "Qatar", 
      country_code: "QA", 
      callsign: "QATARI" 
    },
    { 
      name: "Garuda Indonesia", 
      iata_code: "GA", 
      icao_code: "GIA", 
      country_name: "Indonesia", 
      country_code: "ID", 
      callsign: "INDONESIA" 
    },
    { 
      name: "Cathay Pacific", 
      iata_code: "CX", 
      icao_code: "CPA", 
      country_name: "Hong Kong", 
      country_code: "HK", 
      callsign: "CATHAY" 
    },
    { 
      name: "ANA", 
      iata_code: "NH", 
      icao_code: "ANA", 
      country_name: "Japan", 
      country_code: "JP", 
      callsign: "ALL NIPPON" 
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              <span className="text-[#8B0000] animate-text-glow">Aviation</span> Information
            </h1>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Your comprehensive guide to aviation data, codes, and essential information
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="aircraft" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8 bg-transparent">
              <TabsTrigger value="aircraft" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Plane className="h-4 w-4 mr-2" />
                Aircraft
              </TabsTrigger>
              <TabsTrigger value="airlines" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Globe className="h-4 w-4 mr-2" />
                Airlines
              </TabsTrigger>
              <TabsTrigger value="airports" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Landmark className="h-4 w-4 mr-2" />
                Airports
              </TabsTrigger>
              <TabsTrigger value="codes" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <BookIcon className="h-4 w-4 mr-2" />
                IATA/ICAO
              </TabsTrigger>
              <TabsTrigger value="routes" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <Route className="h-4 w-4 mr-2" />
                Routes
              </TabsTrigger>
              <TabsTrigger value="taxes" className="bg-[#8B0000]/70 hover:bg-[#A80000] text-white data-[state=active]:bg-[#A80000] data-[state=active]:shadow-[0_0_8px_#A80000]">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Taxes
              </TabsTrigger>
            </TabsList>
            
            <div className="glass-panel p-6 rounded-lg border border-white/10">
              <TabsContent value="aircraft" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Aircraft Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Airbus A380', 'Boeing 747', 'Boeing 777', 'Airbus A350', 'Boeing 787', 'Airbus A330'].map((aircraft, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-[#8B0000]" />
                          {aircraft}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          Commercial Wide-body Aircraft
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Manufacturer</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {aircraft.includes('Airbus') ? 'Airbus' : 'Boeing'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Category</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              Wide-body
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAircraftSelect(aircraft)}
                        >
                          View Specifications
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="airlines" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Airline Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockAirlines.map((airline, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-[#8B0000]" />
                          {airline.name}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          IATA: {airline.iata_code}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Country</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airline.country_name}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Alliance</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airline.name === 'Emirates' ? 'Independent' : 
                               airline.name === 'Singapore Airlines' || airline.name === 'ANA' ? 'Star Alliance' : 
                               airline.name === 'Qatar Airways' || airline.name === 'Cathay Pacific' ? 'oneworld' : 
                               airline.name === 'Garuda Indonesia' ? 'SkyTeam' : 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAirlineSelect(airline)}
                        >
                          View Airline Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="airports" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Airport Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockAirports.map((airport, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Landmark className="h-5 w-5 text-[#8B0000]" />
                          {airport.iata_code}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          {airport.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Location</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airport.city}, {airport.country}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">IATA Code</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {airport.iata_code}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAirportSelect(airport)}
                        >
                          View Airport Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="codes" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">ICAO & IATA Codes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#8B0000]/20 border-b border-white/10">
                        <th className="p-3 text-left">Entity</th>
                        <th className="p-3 text-left">IATA Code</th>
                        <th className="p-3 text-left">ICAO Code</th>
                        <th className="p-3 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { entity: "Singapore Airlines", iata: "SQ", icao: "SIA", description: "The flag carrier of Singapore" },
                        { entity: "Garuda Indonesia", iata: "GA", icao: "GIA", description: "The national airline of Indonesia" },
                        { entity: "Changi Airport", iata: "SIN", icao: "WSSS", description: "Primary civilian airport for Singapore" },
                        { entity: "Soekarno-Hatta Airport", iata: "CGK", icao: "WIII", description: "Main airport serving Jakarta, Indonesia" },
                        { entity: "Boeing 777-300ER", iata: "77W", icao: "B77W", description: "Long-range wide-body aircraft" },
                        { entity: "Airbus A350-900", iata: "359", icao: "A359", description: "Long-range wide-body airliner" }
                      ].map((code, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3">{code.entity}</td>
                          <td className="p-3">{code.iata}</td>
                          <td className="p-3">{code.icao}</td>
                          <td className="p-3">{code.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="routes" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Popular Flight Routes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { from: "Jakarta (CGK)", to: "Singapore (SIN)", fromCode: "CGK", toCode: "SIN", distance: "880 km", duration: "1h 45m" },
                    { from: "Singapore (SIN)", to: "Hong Kong (HKG)", fromCode: "SIN", toCode: "HKG", distance: "2,570 km", duration: "3h 55m" },
                    { from: "Jakarta (CGK)", to: "Tokyo (NRT)", fromCode: "CGK", toCode: "NRT", distance: "5,778 km", duration: "7h 10m" },
                    { from: "Singapore (SIN)", to: "London (LHR)", fromCode: "SIN", toCode: "LHR", distance: "10,841 km", duration: "13h 30m" },
                    { from: "Jakarta (CGK)", to: "Dubai (DXB)", fromCode: "CGK", toCode: "DXB", distance: "6,590 km", duration: "8h 10m" },
                    { from: "Singapore (SIN)", to: "Sydney (SYD)", fromCode: "SIN", toCode: "SYD", distance: "6,291 km", duration: "7h 45m" }
                  ].map((route, index) => (
                    <Card key={index} className="bg-gray-dark/50 border-white/5 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Route className="h-5 w-5 text-[#8B0000]" />
                          {route.from} → {route.to}
                        </CardTitle>
                        <CardDescription className="text-gray-light">
                          Popular international route
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Distance</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {route.distance}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-light">Flight Duration</span>
                            <Badge variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                              {route.duration}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleRouteSelect(route.fromCode, route.toCode)}
                        >
                          View Route Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="taxes" className="mt-0">
                <h2 className="text-2xl font-bold mb-4">Aviation Taxes & Fees</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#8B0000]/20 border-b border-white/10">
                        <th className="p-3 text-left">Tax/Fee Type</th>
                        <th className="p-3 text-left">Code</th>
                        <th className="p-3 text-left">Typical Range</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Passenger Service Charge", code: "PSC", range: "$15-30", description: "Fee for use of airport facilities" },
                        { name: "Security Service Charge", code: "SSC", range: "$5-15", description: "Fee for security screening" },
                        { name: "Value Added Tax", code: "VAT", range: "0-20%", description: "Government tax on services" },
                        { name: "Airport Development Fee", code: "ADF", range: "$10-25", description: "Fee for airport infrastructure development" },
                        { name: "International Departure Tax", code: "IDT", range: "$15-50", description: "Tax for departing a country" },
                        { name: "Fuel Surcharge", code: "YQ/YR", range: "Varies", description: "Charge to offset fluctuating fuel costs" }
                      ].map((tax, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3">{tax.name}</td>
                          <td className="p-3">{tax.code}</td>
                          <td className="p-3">{tax.range}</td>
                          <td className="p-3">{tax.description}</td>
                          <td className="p-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-[#8B0000]/10 border-[#8B0000]/30 hover:bg-[#8B0000]/20"
                              onClick={() => handleTaxSelect(tax.code)}
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
      
      {/* Dialogs */}
      <AircraftDialog 
        open={aircraftDialogOpen} 
        onOpenChange={setAircraftDialogOpen} 
        aircraft={selectedAircraft}
        loading={loadingAircraft}
      />
      
      <AirportDialog 
        open={airportDialogOpen} 
        onOpenChange={setAirportDialogOpen} 
        airport={selectedAirport}
      />
      
      <AirlineDialog 
        open={airlineDialogOpen} 
        onOpenChange={setAirlineDialogOpen} 
        airline={selectedAirline}
      />
      
      <RouteDialog 
        open={routeDialogOpen} 
        onOpenChange={setRouteDialogOpen} 
        routeDetails={selectedRoute}
        loading={loadingRoute}
      />
      
      <TaxDialog 
        open={taxDialogOpen} 
        onOpenChange={setTaxDialogOpen} 
        taxDetail={selectedTax}
        loading={loadingTax}
      />
      
      <Footer />
    </div>
  );
};

export default AviationInfo;
