
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Airport } from "@/services/shared/types";

interface AirportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airport: Airport | null;
}

const AirportDialog: React.FC<AirportDialogProps> = ({ open, onOpenChange, airport }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
      {airport && (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Building2 className="text-purple" />
              {airport.name}
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {airport.iata_code || "N/A"} &bull; {airport.icao_code || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-light">Location</h4>
              <p>{airport.city || "Unknown"}, {airport.country || airport.country_code || "Unknown"}</p>
              <h4 className="text-sm font-semibold text-gray-light mt-4">Coordinates</h4>
              <p>Latitude: {airport.lat}</p>
              <p>Longitude: {airport.lon}</p>
              <h4 className="text-sm font-semibold text-gray-light mt-4">Time Zone</h4>
              <p>{airport.timezone || "Unknown"}</p>
            </div>
            <div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-light mb-2">Additional Information</h4>
                <p>Altitude: {airport.alt || "Not available"} ft</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-dark/50 border-gray-light/20"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${airport.lat},${airport.lon}`, '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full bg-gray-dark/50 border-gray-light/20">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default AirportDialog;
