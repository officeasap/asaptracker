
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AlertTriangle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AvTaxDetail } from "@/services/aircraftService";

interface TaxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxDetail: AvTaxDetail | null;
  loading: boolean;
}

const TaxDialog: React.FC<TaxDialogProps> = ({ open, onOpenChange, taxDetail, loading }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-gray-dark border-gray-light/20 text-white">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-purple rounded-full"></div>
        </div>
      ) : taxDetail ? (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="text-purple" />
              {taxDetail.name} ({taxDetail.code})
            </DialogTitle>
            <DialogDescription className="text-gray-light">
              Typical Range: {taxDetail.range}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-light">Description</h4>
              <p>{taxDetail.description}</p>
              
              <h4 className="text-sm font-semibold text-gray-light mt-4">Common in Countries</h4>
              <div className="flex flex-wrap gap-2">
                {taxDetail.countries.map((country, index) => (
                  <Badge key={index} variant="outline" className="bg-[#8B0000]/10 text-white border-[#8B0000]/30">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-light mb-2">Example Amounts</h4>
                {taxDetail.examples.map((example, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-light">{example.country}</span>
                    <Tag className="h-4 w-4 mr-1 text-gray-light" />
                    <span>{example.amount}</span>
                  </div>
                ))}
                
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
          <p>Tax details not found</p>
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

export default TaxDialog;
