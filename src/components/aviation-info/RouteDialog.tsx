
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Route, Clock, Plane, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RouteDetails } from "@/services/aircraftService";

interface RouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeDetails: RouteDetails | null;
  loading: boolean;
}

const RouteDialog: React.FC<RouteDialogProps> = ({ open, onOpenChange, routeDetails, loading }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-purple rounded-full"></div>
        </div>
      ) : routeDetails ? (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Route className="text-purple" />
              {routeDetails.from_airport} → {routeDetails.to_airport}
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              {routeDetails.distance} • {routeDetails.duration} flight time
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-light">Route Information</h4>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-light" />
                <span>Duration: {routeDetails.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-light" />
                <span>Distance: {routeDetails.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-gray-light" />
                <span>Direct Flights: {routeDetails.direct_flights} daily</span>
              </div>
              
              <h4 className="text-sm font-semibold text-gray-light mt-4">Operating Airlines</h4>
              <div className="flex flex-wrap gap-2">
                {routeDetails.airlines.map((airline, index) => (
                  <Badge key={index} variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                    {airline}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-light mb-2">Additional Details</h4>
                <p>Average Price: {routeDetails.avg_price}</p>
                <p>Frequency: {routeDetails.frequency}</p>
                <p>Time Zones: {routeDetails.time_zones}</p>
                
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
          <p>Route details not found</p>
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

export default RouteDialog;
