
import React from 'react';
import Header from '@/components/Header';
import DelayedFlights from '@/components/DelayedFlights';
import HistoricalFlights from '@/components/HistoricalFlights';
import Footer from '@/components/Footer';

const FlightStatus = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Flight <span className="text-[#8B0000] animate-text-glow">Status</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Monitor delays, gate changes, and real-time status updates for flights worldwide.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <DelayedFlights />
        <HistoricalFlights />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FlightStatus;
