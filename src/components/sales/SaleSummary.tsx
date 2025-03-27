
import React from 'react';
import { Sale } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';

interface SaleSummaryProps {
  sale: Sale;
  onInputChange: (field: keyof Sale, value: any) => void;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({ sale, onInputChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="discount">ส่วนลด</Label>
          <Input 
            id="discount" 
            type="number" 
            min="0"
            step="0.01"
            value={sale.discount} 
            onChange={(e) => onInputChange('discount', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="taxRate">อัตราภาษี (%)</Label>
          <Input 
            id="taxRate" 
            type="number" 
            min="0"
            max="100"
            step="0.01"
            value={sale.taxRate} 
            onChange={(e) => onInputChange('taxRate', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      
      <div className="space-y-2 rounded-md bg-gray-50 p-4">
        <div className="flex justify-between">
          <span>ยอดรวม</span>
          <span>{formatCurrency(sale.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>ส่วนลด</span>
          <span>{formatCurrency(sale.discount)}</span>
        </div>
        <div className="flex justify-between">
          <span>ภาษีมูลค่าเพิ่ม ({sale.taxRate}%)</span>
          <span>{formatCurrency(sale.tax)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>ยอดสุทธิ</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
      </div>
    </>
  );
};

export default SaleSummary;
