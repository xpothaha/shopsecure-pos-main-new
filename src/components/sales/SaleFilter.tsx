
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SaleFilterProps {
  searchTerm: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const SaleFilter: React.FC<SaleFilterProps> = ({
  searchTerm,
  dateFilter,
  onSearchChange,
  onDateChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="ค้นหาบิลขาย..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Input
        type="date"
        value={dateFilter}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default SaleFilter;
