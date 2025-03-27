
import React from 'react';
import { Warranty } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import WarrantyCard from './WarrantyCard';
import WarrantyTable from './WarrantyTable';

interface WarrantyListProps {
  warranties: Warranty[];
  onEdit: (warranty: Warranty) => void;
  onDelete: (warrantyId: string) => void;
}

const WarrantyList: React.FC<WarrantyListProps> = ({ warranties, onEdit, onDelete }) => {
  const isMobile = useIsMobile();

  if (warranties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">ไม่พบข้อมูลการรับประกัน</p>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          {warranties.map((warranty) => (
            <WarrantyCard 
              key={warranty.id} 
              warranty={warranty} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      ) : (
        <WarrantyTable 
          warranties={warranties} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      )}
    </>
  );
};

export default WarrantyList;
