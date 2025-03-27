
import React from 'react';
import { useForm } from 'react-hook-form';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Warranty } from '@/types';

export interface WarrantyFormData {
  productId: string;
  productCode: string;
  productName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface WarrantyFormProps {
  onSubmit: (data: WarrantyFormData) => void;
  onCancel: () => void;
  initialData?: Warranty;
  onGenerateCode: () => void;
}

const WarrantyForm: React.FC<WarrantyFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  onGenerateCode 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<WarrantyFormData>({
    defaultValues: initialData ? {
      productCode: initialData.productCode,
      productName: initialData.productName,
      customerName: initialData.customerName || '',
      startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
      endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      notes: initialData.notes || '',
    } : undefined
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productCode">รหัสสินค้า</Label>
            <Input
              id="productCode"
              {...register('productCode', { required: 'กรุณากรอกรหัสสินค้า' })}
              icon={<Wand2 />}
              onIconClick={onGenerateCode}
            />
            {errors.productCode && (
              <p className="text-sm text-red-500">{errors.productCode.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productName">ชื่อสินค้า</Label>
            <Input
              id="productName"
              {...register('productName', { required: 'กรุณากรอกชื่อสินค้า' })}
            />
            {errors.productName && (
              <p className="text-sm text-red-500">{errors.productName.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerName">ชื่อลูกค้า</Label>
          <Input id="customerName" {...register('customerName')} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">วันเริ่มต้น</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate', { required: 'กรุณาเลือกวันเริ่มต้น' })}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">วันหมดอายุ</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate', { required: 'กรุณาเลือกวันหมดอายุ' })}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">หมายเหตุ</Label>
          <Input id="notes" {...register('notes')} />
        </div>
      </div>
      
      <DialogFooter className="sm:justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          ยกเลิก
        </Button>
        <Button type="submit">บันทึก</Button>
      </DialogFooter>
    </form>
  );
};

export default WarrantyForm;
