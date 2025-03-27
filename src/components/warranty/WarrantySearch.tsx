
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WarrantySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const WarrantySearch: React.FC<WarrantySearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="ค้นหาข้อมูลการรับประกัน..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default WarrantySearch;
