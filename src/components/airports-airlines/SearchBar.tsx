
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  isLoading: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchBar = ({ searchTerm, isLoading, onSearchChange, onSearch }: SearchBarProps) => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={onSearchChange}
          className="bg-gray-dark/50 border-gray-dark text-white pl-9"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-light" />
      </div>
      
      <Button 
        variant="outline" 
        onClick={onSearch}
        className="bg-gray-dark/50 border-gray-dark text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default SearchBar;
