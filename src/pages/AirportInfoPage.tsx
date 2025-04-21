
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AirportDetail } from '@/components/AirportDetail';
import { Button } from '@/components/ui/button';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { SuggestResult } from '@/services/aviationService';
import { MapPin, Info } from 'lucide-react';

const AirportInfoPage = () => {
  const [selectedAirport, setSelectedAirport] = useState<SuggestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sampleAirport: SuggestResult = {
    name: "Soekarno-Hatta International Airport",
    iata_code: "CGK",
    icao_code: "WIII",
    city: "Jakarta",
    country_code: "ID",
    type: "airport" // Explicitly set to "airport" to match SuggestResult type
  };

  useEffect(() => {
    // Set a default airport on initial load
    setSelectedAirport(sampleAirport);
  }, []);

  const handleAirportSelect = (airport: SuggestResult) => {
    setSelectedAirport(airport);
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
              Informasi <span className="text-[#8B0000] animate-text-glow">Bandara</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium font-space mb-4 animate-fade-in">
              Airport Information
            </h2>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Dapatkan informasi detail mengenai bandara di seluruh dunia.
            </p>
          </div>
        </div>
      </section>
      
      {/* Batik Pattern Divider */}
      <div className="w-full h-8 bg-[url('/lovable-uploads/e61de6be-a0a9-4504-bfe9-7416e471d743.png')] bg-repeat-x opacity-15"></div>
      
      {/* Search Controls */}
      <section className="py-10 px-4 bg-[#1A1A1A]/80">
        <div className="max-w-3xl mx-auto glass-panel p-6 md:p-8 backdrop-blur-md border-[#8B0000]/30">
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1">
              <p className="mb-2 text-sm text-gray-light">Search Airport</p>
              <div className="relative">
                <AutocompleteSearch 
                  placeholder="Enter airport name or IATA code..." 
                  onSelect={handleAirportSelect}
                  type="airport"
                  className="w-full rounded-[14px] bg-dark border-[#8B0000]/20 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Airport Detail Section */}
      <section className="py-8 px-4 relative">
        <div className="max-w-6xl mx-auto">
          {selectedAirport ? (
            <AirportDetail airport={selectedAirport} />
          ) : (
            <div className="bg-[#1A1A1A] border border-[#8B0000]/20 rounded-lg overflow-hidden h-[40vh] relative flex flex-col items-center justify-center">
              <MapPin className="h-12 w-12 text-[#8B0000] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select an Airport</h3>
              <p className="text-gray-light text-center max-w-md px-4">
                Enter an airport name or IATA code to view detailed information.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AirportInfoPage;
