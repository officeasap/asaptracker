
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Airline } from "@/services/shared/types";

interface AirlineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airline: Airline | null;
}

const AirlineDialog: React.FC<AirlineDialogProps> = ({ open, onOpenChange, airline }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
      {airline && (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <PlaneTakeoff className="text-purple" />
              {airline.name}
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {airline.iata_code || "N/A"} &bull; {airline.icao_code || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-light">Information</h4>
              <p>Country: {airline.country_name || airline.country_code || "Unknown"}</p>
              <p>IATA Code: {airline.iata_code || "N/A"}</p>
              <p>ICAO Code: {airline.icao_code || "N/A"}</p>
            </div>
            <div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-light mb-2">Additional Details</h4>
                <p>Callsign: {airline.callsign || "Unknown"}</p>
                <div className="mt-4 flex flex-col gap-2">
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

export default AirlineDialog;
