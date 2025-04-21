
import React from 'react';
import { CheckCircle, Clock, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 w-full max-w-6xl mx-auto">
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-space mb-4">About ASAP Tracker</h2>
          <p className="text-gray-light max-w-2xl mx-auto">
            We provide real-time flight tracking, scheduling information, and weather forecasts to help you plan and navigate your air travel with confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 bg-[#1A1A1A] border-2 border-[#8B0000]">
            <h3 className="text-xl font-semibold mb-4 font-space text-white">Our Mission</h3>
            <p className="text-gray-light mb-6">
              ASAP Tracker is dedicated to providing travelers with accurate, up-to-date information about flight schedules, delays, and weather conditions around the globe. Our goal is to help you make informed decisions and have a smoother travel experience.
            </p>
            <p className="text-gray-light">
              Using advanced technology and real-time data integration, we offer a comprehensive view of the current state of air travel, allowing you to stay informed about your flights and potential disruptions.
            </p>
          </div>
          
          <div className="glass-panel p-6 bg-[#1A1A1A] border-2 border-[#8B0000]">
            <h3 className="text-xl font-semibold mb-4 font-space text-white">Why Choose Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-[#8B0000] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Real-Time Updates</h4>
                  <p className="text-sm text-gray-light">Our system pulls data from multiple sources to provide you with the most current information.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Globe className="text-[#8B0000] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Global Coverage</h4>
                  <p className="text-sm text-gray-light">Track flights and weather conditions at airports around the world.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-[#8B0000] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">24/7 Availability</h4>
                  <p className="text-sm text-gray-light">Access our services anytime, from anywhere, on any device.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="text-[#8B0000] h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Reliable & Secure</h4>
                  <p className="text-sm text-gray-light">Trust in our secure platform and dependable information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 font-space">Start Tracking Your Flights Today</h3>
          <p className="text-gray-light max-w-2xl mx-auto mb-6">
            Join thousands of travelers who rely on ASAP Tracker for their journey planning and real-time updates.
          </p>
          <a href="https://app.asaptraker.com" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000] transition-all">
              Sign Up for Free
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
