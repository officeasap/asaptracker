
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaneTakeoff, Building2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { fetchAirports, fetchAirlines } from '@/services/aviationService';
import type { Airport, Airline } from '@/services/shared/types';
import SearchBar from '@/components/airports-airlines/SearchBar';
import AirportTable from '@/components/airports-airlines/AirportTable';
import AirlineTable from '@/components/airports-airlines/AirlineTable';
import CustomPagination from '@/components/airports-airlines/CustomPagination';
import AirportDialog from '@/components/airports-airlines/AirportDialog';
import AirlineDialog from '@/components/airports-airlines/AirlineDialog';
// Fix Toast and missing ArrowUpDown import:
import { useToast, toast } from "@/hooks/use-toast";
import { ArrowUpDown } from "lucide-react";

const ITEMS_PER_PAGE = 25;

const AirportsAirlinesPage = () => {
  const [activeTab, setActiveTab] = useState("airports");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [displayedAirports, setDisplayedAirports] = useState<Airport[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [isAirportDialogOpen, setIsAirportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [filteredAirlines, setFilteredAirlines] = useState<Airline[]>([]);
  const [displayedAirlines, setDisplayedAirlines] = useState<Airline[]>([]);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [isAirlineDialogOpen, setIsAirlineDialogOpen] = useState(false);
  const [airlineCurrentPage, setAirlineCurrentPage] = useState(1);
  const [airlineTotalPages, setAirlineTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "airports") {
      loadAirports();
    } else {
      loadAirlines();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "airports") {
      const total = Math.ceil(filteredAirports.length / ITEMS_PER_PAGE);
      setTotalPages(total || 1);
      updateDisplayedAirports(currentPage);
    } else {
      const total = Math.ceil(filteredAirlines.length / ITEMS_PER_PAGE);
      setAirlineTotalPages(total || 1);
      updateDisplayedAirlines(airlineCurrentPage);
    }
    // eslint-disable-next-line
  }, [filteredAirports, filteredAirlines, currentPage, airlineCurrentPage, activeTab]);

  const updateDisplayedAirports = (page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedAirports(filteredAirports.slice(startIndex, endIndex));
  };

  const updateDisplayedAirlines = (page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedAirlines(filteredAirlines.slice(startIndex, endIndex));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAirlinePageChange = (page: number) => {
    setAirlineCurrentPage(page);
  };

  const loadAirports = async (search: string = "") => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) {
        params.search = search;
      }

      const airportData = await fetchAirports(params);

      if (airportData && airportData.length > 0) {
        setAirports(airportData);
        setFilteredAirports(airportData);
        setCurrentPage(1);
        toast({
          title: "Airports Loaded",
          description: `Loaded ${airportData.length} airports`,
        });
      } else {
        toast({
          title: "No airports found",
          description: "No airports found for your search",
        });
        setAirports([]);
        setFilteredAirports([]);
      }
    } catch (error) {
      console.error("Error loading airports:", error);
      toast({
        title: "Error",
        description: "Failed to load airports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAirlines = async (search: string = "") => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) {
        params.search = search;
      }

      const airlineData = await fetchAirlines(params);

      if (airlineData && airlineData.length > 0) {
        setAirlines(airlineData);
        setFilteredAirlines(airlineData);
        setAirlineCurrentPage(1);
        toast({
          title: "Airlines Loaded",
          description: `Loaded ${airlineData.length} airlines`,
        });
      } else {
        toast({
          title: "No airlines found",
          description: "No airlines found for your search",
        });
        setAirlines([]);
        setFilteredAirlines([]);
      }
    } catch (error) {
      console.error("Error loading airlines:", error);
      toast({
        title: "Error",
        description: "Failed to load airlines. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === "airports") {
      loadAirports(searchTerm);
    } else {
      loadAirlines(searchTerm);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (activeTab === "airports") {
      if (!value.trim()) {
        setFilteredAirports(airports);
        return;
      }

      const filtered = airports.filter(airport =>
        airport.name.toLowerCase().includes(value) ||
        (airport.iata_code && airport.iata_code.toLowerCase().includes(value)) ||
        (airport.icao_code && airport.icao_code.toLowerCase().includes(value)) ||
        (airport.country_code && airport.country_code.toLowerCase().includes(value)) ||
        (airport.city && airport.city.toLowerCase().includes(value))
      );

      setFilteredAirports(filtered);
      setCurrentPage(1);
    } else {
      if (!value.trim()) {
        setFilteredAirlines(airlines);
        return;
      }

      const filtered = airlines.filter(airline =>
        airline.name.toLowerCase().includes(value) ||
        (airline.iata_code && airline.iata_code.toLowerCase().includes(value)) ||
        (airline.icao_code && airline.icao_code.toLowerCase().includes(value)) ||
        (airline.country_code && airline.country_code.toLowerCase().includes(value))
      );

      setFilteredAirlines(filtered);
      setAirlineCurrentPage(1);
    }
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    if (activeTab === "airports") {
      const sortedData = [...filteredAirports].sort((a, b) => {
        const aValue = (a as any)[key] || "";
        const bValue = (b as any)[key] || "";

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredAirports(sortedData);
    } else {
      const sortedData = [...filteredAirlines].sort((a, b) => {
        const aValue = (a as any)[key] || "";
        const bValue = (b as any)[key] || "";

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredAirlines(sortedData);
    }
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }

    return sortConfig.direction === 'asc'
      ? <ArrowUpDown className="ml-1 h-4 w-4 text-purple rotate-180" />
      : <ArrowUpDown className="ml-1 h-4 w-4 text-purple" />;
  };

  const handleOpenAirportDetail = (airport: Airport) => {
    setSelectedAirport(airport);
    setIsAirportDialogOpen(true);
  };

  const handleOpenAirlineDetail = (airline: Airline) => {
    setSelectedAirline(airline);
    setIsAirlineDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />

      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#4c2a90]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Airports & <span className="text-purple animate-text-glow">Airlines</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Explore detailed information about airports and airlines worldwide
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 container mx-auto px-4">
        <div className="border-4 border-[#8B0000] rounded-2xl shadow-[0_4px_12px_rgba(139,0,0,0.4)] overflow-hidden">
          <Tabs
            defaultValue="airports"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="airports" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Airports</span>
                </TabsTrigger>
                <TabsTrigger value="airlines" className="flex items-center gap-2">
                  <PlaneTakeoff className="h-4 w-4" />
                  <span>Airlines</span>
                </TabsTrigger>
              </TabsList>

              <SearchBar
                searchTerm={searchTerm}
                isLoading={isLoading}
                onSearchChange={handleFilterChange}
                onSearch={handleSearch}
              />
            </div>

            <TabsContent value="airports" className="mt-0">
              <Card className="bg-gray-dark/60 border-gray-light/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="text-purple" />
                    <span>Airports Directory</span>
                  </CardTitle>
                  <CardDescription>
                    Browse {filteredAirports.length} airports from around the world
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="animate-spin h-8 w-8 text-purple" />
                    </div>
                  ) : filteredAirports.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-light">No airports found matching your criteria.</p>
                      <Button
                        variant="outline"
                        onClick={() => loadAirports()}
                        className="mt-4"
                      >
                        Load Airports
                      </Button>
                    </div>
                  ) : (
                    <>
                      <AirportTable
                        airports={displayedAirports}
                        onSort={requestSort}
                        sortConfig={sortConfig}
                        onAirportSelect={handleOpenAirportDetail}
                      />

                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="airlines" className="mt-0">
              <Card className="bg-gray-dark/60 border-gray-light/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <PlaneTakeoff className="text-purple" />
                    <span>Airlines Directory</span>
                  </CardTitle>
                  <CardDescription>
                    Browse {filteredAirlines.length} airlines from around the world
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="animate-spin h-8 w-8 text-purple" />
                    </div>
                  ) : filteredAirlines.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-light">No airlines found matching your criteria.</p>
                      <Button
                        variant="outline"
                        onClick={() => loadAirlines()}
                        className="mt-4"
                      >
                        Load Airlines
                      </Button>
                    </div>
                  ) : (
                    <>
                      <AirlineTable
                        airlines={displayedAirlines}
                        onSort={requestSort}
                        sortConfig={sortConfig}
                        onAirlineSelect={handleOpenAirlineDetail}
                      />

                      <CustomPagination
                        currentPage={airlineCurrentPage}
                        totalPages={airlineTotalPages}
                        onPageChange={handleAirlinePageChange}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AirportDialog
        open={isAirportDialogOpen}
        onOpenChange={setIsAirportDialogOpen}
        airport={selectedAirport}
      />

      <AirlineDialog
        open={isAirlineDialogOpen}
        onOpenChange={setIsAirlineDialogOpen}
        airline={selectedAirline}
      />

      <Footer />
    </div>
  );
};

export default AirportsAirlinesPage;
