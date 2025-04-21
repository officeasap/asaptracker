
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorldClock from '@/components/WorldClock';

const WorldClockPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      {/* World Clock Hero */}
      <section className="pt-32 pb-16 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-4 animate-fade-in">
              World <span className="text-purple animate-text-glow">Clock</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Check the local time in major cities around the world with our interactive clock display.
            </p>
          </div>
        </div>
      </section>
      
      {/* World Clock Main Section */}
      <WorldClock />
      
      <Footer />
    </div>
  );
};

export default WorldClockPage;
