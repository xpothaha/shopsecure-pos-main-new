
import { useState } from 'react';
import { Warranty } from '@/types';
import { mockWarranties } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export const useWarranties = () => {
  const [warranties, setWarranties] = useState<Warranty[]>(mockWarranties);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredWarranties = warranties.filter(warranty => 
    warranty.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (warranty.customerName && warranty.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addWarranty = (newWarranty: Omit<Warranty, 'id' | 'createdAt' | 'updatedAt'>) => {
    const warranty: Warranty = {
      id: Math.random().toString(36).substring(2, 9),
      ...newWarranty,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setWarranties([...warranties, warranty]);
    toast({
      title: "เพิ่มข้อมูลการรับประกันสำเร็จ",
      description: "ข้อมูลการรับประกันถูกเพิ่มเข้าระบบแล้ว",
    });
    
    return warranty;
  };

  const updateWarranty = (id: string, updatedData: Partial<Warranty>) => {
    const updatedWarranties = warranties.map(warranty => {
      if (warranty.id === id) {
        return {
          ...warranty,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
      }
      return warranty;
    });
    
    setWarranties(updatedWarranties);
    toast({
      title: "แก้ไขข้อมูลการรับประกันสำเร็จ",
      description: "ข้อมูลการรับประกันถูกอัปเดตแล้ว",
    });
  };

  const deleteWarranty = (id: string) => {
    setWarranties(warranties.filter(warranty => warranty.id !== id));
    toast({
      title: "ลบข้อมูลการรับประกันสำเร็จ",
      description: "ข้อมูลการรับประกันถูกลบออกจากระบบแล้ว",
    });
  };

  return {
    warranties,
    filteredWarranties,
    searchTerm,
    setSearchTerm,
    addWarranty,
    updateWarranty,
    deleteWarranty
  };
};
