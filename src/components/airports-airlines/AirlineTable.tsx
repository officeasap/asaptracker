
import React from 'react';
import { ArrowUpDown, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Airline } from '@/services/shared/types';

interface AirlineTableProps {
  airlines: Airline[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onAirlineSelect: (airline: Airline) => void;
}

const AirlineTable = ({ airlines, onSort, sortConfig, onAirlineSelect }: AirlineTableProps) => {
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-1 h-4 w-4 text-purple rotate-180" />
      : <ArrowUpDown className="ml-1 h-4 w-4 text-purple" />;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-white/5">
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Airline Name
                {getSortIndicator('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('iata_code')}
            >
              <div className="flex items-center">
                IATA
                {getSortIndicator('iata_code')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('icao_code')}
            >
              <div className="flex items-center">
                ICAO
                {getSortIndicator('icao_code')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('country_code')}
            >
              <div className="flex items-center">
                Country
                {getSortIndicator('country_code')}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-end">
                Details
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {airlines.map((airline, index) => (
            <TableRow 
              key={`${airline.iata_code || airline.icao_code || index}-${index}`}
              className="hover:bg-white/5 cursor-pointer"
              onClick={() => onAirlineSelect(airline)}
            >
              <TableCell className="font-medium">{airline.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {airline.iata_code || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono">
                  {airline.icao_code || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>{airline.country_name || airline.country_code || 'Unknown'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AirlineTable;
