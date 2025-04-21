
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Aircraft } from "@/services/aircraftService";

interface AircraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aircraft: Aircraft | null;
  loading: boolean;
}

const AircraftDialog: React.FC<AircraftDialogProps> = ({ open, onOpenChange, aircraft, loading }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-gray-dark border-gray-light/20 text-white max-h-[80vh] overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-purple rounded-full"></div>
        </div>
      ) : aircraft ? (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Plane className="text-purple" />
              {aircraft.manufacturer} {aircraft.model}
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {aircraft.type} • {aircraft.engine_count} x {aircraft.engine_type}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-light">Dimensions</h4>
              <p>Length: {aircraft.length}</p>
              <p>Wingspan: {aircraft.wingspan}</p>
              <p>Height: {aircraft.height}</p>
              
              <h4 className="text-sm font-semibold text-gray-light mt-4">Weight</h4>
              <p>Empty Weight: {aircraft.empty_weight}</p>
              <p>Max Takeoff Weight: {aircraft.max_takeoff_weight}</p>
              
              <h4 className="text-sm font-semibold text-gray-light mt-4">Performance</h4>
              <p>Max Speed: {aircraft.max_speed}</p>
              <p>Service Ceiling: {aircraft.ceiling}</p>
              <p>Range: {aircraft.range}</p>
            </div>
            <div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-light mb-2">Capacity</h4>
                <p>Seating: {aircraft.seat_capacity}</p>
                
                <h4 className="text-sm font-semibold text-gray-light mt-4 mb-2">Description</h4>
                <p className="text-sm">{aircraft.description}</p>
                
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
      ) : (
        <div className="text-center py-8">
          <p>Aircraft specifications not found</p>
          <DialogClose asChild className="mt-4">
            <Button variant="outline" className="bg-gray-dark/50 border-gray-light/20">
              Close
            </Button>
          </DialogClose>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default AircraftDialog;
