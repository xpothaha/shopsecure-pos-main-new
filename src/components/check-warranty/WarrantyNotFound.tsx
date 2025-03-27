
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarrantyNotFoundProps {
  productCode: string;
}

const WarrantyNotFound: React.FC<WarrantyNotFoundProps> = ({ productCode }) => {
  return (
    <div className="text-center py-4">
      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
      <p className="text-gray-800 font-medium">ไม่พบข้อมูลการรับประกัน</p>
      <p className="text-gray-600 text-sm mt-1">
        ไม่พบข้อมูลการรับประกันสำหรับรหัสสินค้า "{productCode}"
      </p>
    </div>
  );
};

export default WarrantyNotFound;
