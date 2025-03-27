
import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, Shield } from 'lucide-react';
import { Warranty } from '@/types';
import { formatShortDate, isWarrantyActive, daysBetween } from '@/utils/formatters';

interface WarrantyDetailsProps {
  warranty: Warranty;
  calculateFromStartDays: (startDate: string) => number;
}

const WarrantyDetails: React.FC<WarrantyDetailsProps> = ({ warranty, calculateFromStartDays }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">ข้อมูลการรับประกัน</h3>
        {isWarrantyActive(warranty.endDate) ? (
          <div className="flex items-center text-green-600">
            <ShieldCheck className="h-5 w-5 mr-1" />
            <span>มีการรับประกัน</span>
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <AlertTriangle className="h-5 w-5 mr-1" />
            <span>หมดประกัน</span>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">รหัสสินค้า</p>
            <p className="font-medium">{warranty.productCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ชื่อสินค้า</p>
            <p className="font-medium">{warranty.productName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">วันที่เริ่มต้น</p>
            <p className="font-medium">{formatShortDate(warranty.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">วันที่สิ้นสุด</p>
            <p className="font-medium">{formatShortDate(warranty.endDate)}</p>
          </div>
        </div>
        
        {isWarrantyActive(warranty.endDate) && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <p className="text-sm">
                เหลือเวลารับประกันอีก {daysBetween(new Date().toISOString(), warranty.endDate)} วัน
              </p>
            </div>
            <div className="mt-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <p className="text-sm">
                ใช้งานมาแล้ว {calculateFromStartDays(warranty.startDate)} วัน
              </p>
            </div>
          </div>
        )}
        
        {warranty.notes && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">หมายเหตุ</p>
            <p>{warranty.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarrantyDetails;
