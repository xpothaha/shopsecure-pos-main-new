
import React from 'react';
import { Search, Filter, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PurchaseFilterProps {
  search: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
}

const PurchaseFilter: React.FC<PurchaseFilterProps> = ({
  search,
  dateFilter,
  onSearchChange,
  onDateFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="ค้นหาบิลซื้อ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Input
        type="date"
        value={dateFilter}
        onChange={(e) => onDateFilterChange(e.target.value)}
        className="w-full"
      />
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-1 items-center hidden md:flex">
          <Filter className="h-4 w-4" />
          กรอง
        </Button>
        <Button variant="outline" className="gap-1 items-center hidden md:flex">
          <FileDown className="h-4 w-4" />
          ส่งออก
        </Button>
      </div>
    </div>
  );
};

export default PurchaseFilter;
