
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Receipt } from 'lucide-react';
import { Sale, SaleItem, Product } from '@/types';
import { mockProducts } from '@/utils/mockData';
import { toast } from 'sonner';
import CustomerInfoForm from './CustomerInfoForm';
import SaleItemForm from './SaleItemForm';
import SaleSummary from './SaleSummary';
import { createDefaultSale, emptySaleItem, calculateItemTotal, updateTotals } from './SaleFormModel';

interface SaleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  editSale?: Sale | null;
}

const SaleFormDialog: React.FC<SaleFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  editSale
}) => {
  const [sale, setSale] = useState<Sale>(createDefaultSale());
  const [products] = useState<Product[]>(mockProducts);
  
  useEffect(() => {
    if (editSale) {
      setSale({ ...editSale });
    } else {
      setSale(createDefaultSale());
    }
  }, [editSale, isOpen]);
  
  const handleItemChange = (index: number, field: keyof SaleItem, value: any) => {
    const updatedItems = [...sale.items];
    
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          productId: selectedProduct.id,
          productCode: selectedProduct.code,
          productName: selectedProduct.name,
          unitPrice: selectedProduct.price
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    updatedItems[index].total = calculateItemTotal(updatedItems[index]);
    
    const updatedSale = {
      ...sale,
      items: updatedItems
    };
    
    setSale(updateTotals(updatedSale));
  };
  
  const handleInputChange = (field: keyof Sale, value: any) => {
    const updatedSale = {
      ...sale,
      [field]: value
    };
    
    if (field === 'discount' || field === 'taxRate') {
      setSale(updateTotals(updatedSale));
    } else {
      setSale(updatedSale);
    }
  };
  
  const handleAddItem = () => {
    const updatedSale = {
      ...sale,
      items: [...sale.items, { ...emptySaleItem }]
    };
    setSale(updatedSale);
  };
  
  const handleRemoveItem = (index: number) => {
    if (sale.items.length === 1) {
      toast.error('ต้องมีรายการสินค้าอย่างน้อย 1 รายการ');
      return;
    }
    
    const updatedItems = sale.items.filter((_, i) => i !== index);
    const updatedSale = {
      ...sale,
      items: updatedItems
    };
    setSale(updateTotals(updatedSale));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sale.customerName) {
      toast.error('กรุณาระบุชื่อลูกค้า');
      return;
    }
    
    if (sale.items.some(item => !item.productId)) {
      toast.error('กรุณาเลือกสินค้าให้ครบทุกรายการ');
      return;
    }
    
    const finalSale = {
      ...sale,
      updatedAt: new Date().toISOString()
    };
    
    onSave(finalSale);
    toast.success(editSale ? 'แก้ไขบิลขายสำเร็จ' : 'สร้างบิลขายสำเร็จ');
    onClose();
  };
  
  const title = editSale ? 'แก้ไขบิลขาย' : 'สร้างบิลขายใหม่';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center">
          <Receipt className="h-6 w-6 mr-2" />
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {editSale ? 'แก้ไขข้อมูลบิลขาย' : 'กรอกข้อมูลเพื่อสร้างบิลขายใหม่'}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <CustomerInfoForm 
            sale={sale} 
            onInputChange={handleInputChange} 
            isEditMode={editSale !== null} 
          />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">รายการสินค้า</h3>
              <Button type="button" onClick={handleAddItem} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                เพิ่มรายการ
              </Button>
            </div>
            
            <div className="space-y-4">
              {sale.items.map((item, index) => (
                <SaleItemForm
                  key={index}
                  item={item}
                  index={index}
                  products={products}
                  onItemChange={handleItemChange}
                  onRemoveItem={handleRemoveItem}
                  showRemoveButton={sale.items.length > 1}
                />
              ))}
            </div>
          </div>
          
          <SaleSummary sale={sale} onInputChange={handleInputChange} />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit">
              {editSale ? 'บันทึกการแก้ไข' : 'สร้างบิลขาย'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleFormDialog;
