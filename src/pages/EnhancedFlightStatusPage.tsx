import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flight, fetchFlightStatus } from '@/services/aviationService';
import { Loader2, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface FlightStatusProps {
  filterType: "all" | "weather" | "technical" | "operational";
}

const FlightStatusCard: React.FC<FlightStatusProps> = ({ filterType }) => {
  return (
    <Card className="bg-gray-dark/80 border-gray-light/20 text-white">
      <CardHeader>
        <h3 className="text-lg font-semibold">Flight Status</h3>
      </CardHeader>
      <CardContent>
        <p>Filter Type: {filterType}</p>
      </CardContent>
    </Card>
  );
};

const EnhancedFlightStatusPage = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightStatus, setFlightStatus] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleSearch = async () => {
    if (!flightNumber.trim()) {
      toast.error('Please enter a flight number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFlightStatus(flightNumber);
      if (data) {
        setFlightStatus(data);
      } else {
        setError('Flight not found.');
        setFlightStatus(null);
      }
    } catch (err) {
      console.error('Error fetching flight status:', err);
      setError('Failed to fetch flight status. Please try again later.');
      setFlightStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'scheduled':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-red-400';
      case 'incident':
        return 'text-orange-400';
      case 'diverted':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />

      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#8B0000]/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Cek <span className="text-[#8B0000] animate-text-glow">Status Penerbangan</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium font-space mb-4 animate-fade-in">
              Enhanced Flight Status
            </h2>
            <p className="text-lg text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Dapatkan informasi terkini mengenai status penerbangan Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto glass-panel p-6 md:p-8 backdrop-blur-md border-[#8B0000]/30">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter Flight Number (e.g., GA123)"
              className="bg-gray-dark/80 border-gray-dark text-white"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            />
            <Button className="bg-[#8B0000] hover:bg-[#A80000] text-white hover:shadow-[0_0_8px_#A80000]" onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Check Status'}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple" />
              <span className="ml-2">Loading flight status...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {flightStatus && (
            <Card className="bg-gray-dark/80 border-gray-light/20 text-white">
              <CardHeader>
                <h3 className="text-xl font-semibold">Flight Status: {flightStatus.flight_icao || 'N/A'}</h3>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center">
                  {flightStatus.flight_status === 'active' ? (
                    <CheckCircle className="text-green-400 h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="text-red-400 h-5 w-5 mr-2" />
                  )}
                  <span className={`font-semibold ${getStatusColor(flightStatus.flight_status)}`}>
                    {flightStatus.flight_status || 'Unknown'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Departure Airport:</Label>
                    <p>{flightStatus.dep_name || 'N/A'}</p>
                    <p className="text-sm text-gray-light">{flightStatus.dep_iata || 'N/A'}</p>
                    <p className="text-sm text-gray-light">
                      {flightStatus.dep_time ? new Date(flightStatus.dep_time).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label>Arrival Airport:</Label>
                    <p>{flightStatus.arr_name || 'N/A'}</p>
                    <p className="text-sm text-gray-light">{flightStatus.arr_iata || 'N/A'}</p>
                    <p className="text-sm text-gray-light">
                      {flightStatus.arr_time ? new Date(flightStatus.arr_time).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <Separator className="bg-gray-light/20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Airline:</Label>
                    <p>{flightStatus.airline_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Aircraft:</Label>
                    <p>{flightStatus.aircraft_icao24 || 'N/A'}</p>
                  </div>
                </div>

                <Separator className="bg-gray-light/20" />

                <div>
                  <Label>Additional Information:</Label>
                  {flightStatus.delayed ? (
                    <p className="text-yellow-400">Delayed: {flightStatus.delayed} minutes</p>
                  ) : (
                    <p>On Time</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Select onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="weather">Weather</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
          <FlightStatusCard filterType={selectedStatus as "all" | "weather" | "technical" | "operational"} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EnhancedFlightStatusPage;
