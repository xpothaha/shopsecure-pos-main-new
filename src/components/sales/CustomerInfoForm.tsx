
import React from 'react';
import { Sale } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CustomerInfoFormProps {
  sale: Sale;
  onInputChange: (field: keyof Sale, value: any) => void;
  isEditMode: boolean;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  sale,
  onInputChange,
  isEditMode
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">เลขที่ใบขาย</Label>
          <Input 
            id="invoiceNumber" 
            value={sale.invoiceNumber} 
            onChange={(e) => onInputChange('invoiceNumber', e.target.value)}
            readOnly={isEditMode}
          />
        </div>
        
        <div>
          <Label htmlFor="date">วันที่</Label>
          <Input 
            id="date" 
            type="date" 
            value={sale.date} 
            onChange={(e) => onInputChange('date', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="customerName">ชื่อลูกค้า *</Label>
          <Input 
            id="customerName" 
            value={sale.customerName} 
            onChange={(e) => onInputChange('customerName', e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="customerTaxId">เลขประจำตัวผู้เสียภาษี</Label>
          <Input 
            id="customerTaxId" 
            value={sale.customerTaxId || ''} 
            onChange={(e) => onInputChange('customerTaxId', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="customerPhone">เบอร์โทรศัพท์</Label>
          <Input 
            id="customerPhone" 
            value={sale.customerPhone || ''} 
            onChange={(e) => onInputChange('customerPhone', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="status">สถานะ</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={sale.status}
            onChange={(e) => onInputChange('status', e.target.value)}
          >
            <option value="pending">รอดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="customerAddress">ที่อยู่</Label>
        <Textarea 
          id="customerAddress" 
          value={sale.customerAddress || ''} 
          onChange={(e) => onInputChange('customerAddress', e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};

export default CustomerInfoForm;
