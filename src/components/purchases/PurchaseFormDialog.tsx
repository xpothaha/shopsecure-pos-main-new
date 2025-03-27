import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus, Package, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Purchase, PurchaseItem, Product } from '@/types';
import { mockProducts } from '@/utils/mockData';
import { toast } from 'sonner';

interface PurchaseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchase: Purchase) => void;
  editPurchase?: Purchase | null;
}

const emptyPurchaseItem: PurchaseItem = {
  productId: '',
  quantity: 1,
  unitPrice: 0,
  total: 0
};

const defaultPurchase: Purchase = {
  id: '',
  invoiceNumber: '',
  vendorName: '',
  vendorTaxId: '',
  vendorPhone: '',
  vendorAddress: '',
  date: new Date().toISOString().split('T')[0],
  items: [{ ...emptyPurchaseItem }],
  subtotal: 0,
  tax: 0,
  taxRate: 7,
  discount: 0,
  total: 0,
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const PurchaseFormDialog: React.FC<PurchaseFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  editPurchase
}) => {
  const [purchase, setPurchase] = useState<Purchase>({ ...defaultPurchase });
  const [products] = useState<Product[]>(mockProducts);
  
  useEffect(() => {
    if (editPurchase) {
      setPurchase({ ...editPurchase });
    } else {
      const newInvoiceNumber = `PO${new Date().getFullYear().toString().slice(2)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setPurchase({ 
        ...defaultPurchase, 
        id: uuidv4(),
        invoiceNumber: newInvoiceNumber
      });
    }
  }, [editPurchase, isOpen]);
  
  const calculateItemTotal = (item: PurchaseItem): number => {
    return item.quantity * item.unitPrice;
  };
  
  const updateTotals = (updatedPurchase: Purchase): Purchase => {
    const subtotal = updatedPurchase.items.reduce((sum, item) => sum + item.total, 0);
    const tax = (subtotal - updatedPurchase.discount) * (updatedPurchase.taxRate / 100);
    const total = subtotal - updatedPurchase.discount + tax;
    
    return {
      ...updatedPurchase,
      subtotal,
      tax,
      total
    };
  };
  
  const handleAddItem = () => {
    const updatedPurchase = {
      ...purchase,
      items: [...purchase.items, { ...emptyPurchaseItem }]
    };
    setPurchase(updatedPurchase);
  };
  
  const handleRemoveItem = (index: number) => {
    if (purchase.items.length === 1) {
      toast.error('ต้องมีรายการสินค้าอย่างน้อย 1 รายการ');
      return;
    }
    
    const updatedItems = purchase.items.filter((_, i) => i !== index);
    const updatedPurchase = {
      ...purchase,
      items: updatedItems
    };
    setPurchase(updateTotals(updatedPurchase));
  };
  
  const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
    const updatedItems = [...purchase.items];
    
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          productId: selectedProduct.id,
          productCode: selectedProduct.code,
          productName: selectedProduct.name,
          unitPrice: selectedProduct.cost
        };
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    updatedItems[index].total = calculateItemTotal(updatedItems[index]);
    
    const updatedPurchase = {
      ...purchase,
      items: updatedItems
    };
    
    setPurchase(updateTotals(updatedPurchase));
  };
  
  const handleInputChange = (field: keyof Purchase, value: any) => {
    const updatedPurchase = {
      ...purchase,
      [field]: value
    };
    
    if (field === 'discount' || field === 'taxRate') {
      setPurchase(updateTotals(updatedPurchase));
    } else {
      setPurchase(updatedPurchase);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchase.vendorName) {
      toast.error('กรุณาระบุชื่อผู้ขาย');
      return;
    }
    
    if (purchase.items.some(item => !item.productId)) {
      toast.error('กรุณาเลือกสินค้าให้ครบทุกรายการ');
      return;
    }
    
    const finalPurchase = {
      ...purchase,
      updatedAt: new Date().toISOString()
    };
    
    onSave(finalPurchase);
    toast.success(editPurchase ? 'แก้ไขบิลซื้อสำเร็จ' : 'สร้างบิลซื้อสำเร็จ');
    onClose();
  };
  
  const title = editPurchase ? 'แก้ไขบิลซื้อ' : 'สร้างบิลซื้อใหม่';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {editPurchase ? 'แก้ไขข้อมูลบิลซื้อ' : 'กรอกข้อมูลเพื่อสร้างบิลซื้อใหม่'}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">เลขที่ใบซื้อ</Label>
              <Input 
                id="invoiceNumber" 
                value={purchase.invoiceNumber} 
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                readOnly={editPurchase !== null}
              />
            </div>
            
            <div>
              <Label htmlFor="date">วันที่</Label>
              <Input 
                id="date" 
                type="date" 
                value={purchase.date} 
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="vendorName">ชื่อผู้ขาย *</Label>
              <Input 
                id="vendorName" 
                value={purchase.vendorName} 
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="vendorTaxId">เลขประจำตัวผู้เสียภาษี</Label>
              <Input 
                id="vendorTaxId" 
                value={purchase.vendorTaxId || ''} 
                onChange={(e) => handleInputChange('vendorTaxId', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="vendorPhone">เบอร์โทรศัพท์</Label>
              <Input 
                id="vendorPhone" 
                value={purchase.vendorPhone || ''} 
                onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="status">สถานะ</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={purchase.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="pending">รอดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="vendorAddress">ที่อยู่</Label>
            <Textarea 
              id="vendorAddress" 
              value={purchase.vendorAddress || ''} 
              onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">รายการสินค้า</h3>
              <Button type="button" onClick={handleAddItem} className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                เพิ่มรายการ
              </Button>
            </div>
            
            <div className="space-y-4">
              {purchase.items.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 border rounded-md relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <Label htmlFor={`item-${index}-product`}>สินค้า *</Label>
                      <select
                        id={`item-${index}-product`}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        required
                      >
                        <option value="">เลือกสินค้า</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.code} - {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`item-${index}-quantity`}>จำนวน *</Label>
                      <Input 
                        id={`item-${index}-quantity`} 
                        type="number" 
                        min="1"
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`item-${index}-unitPrice`}>ราคาต่อหน่วย *</Label>
                      <Input 
                        id={`item-${index}-unitPrice`} 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={item.unitPrice} 
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`item-${index}-total`}>รวมเป็นเงิน</Label>
                      <Input 
                        id={`item-${index}-total`} 
                        value={formatCurrency(item.total)}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="discount">ส่วนลด</Label>
              <Input 
                id="discount" 
                type="number" 
                min="0"
                step="0.01"
                value={purchase.discount} 
                onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
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
                value={purchase.taxRate} 
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2 rounded-md bg-gray-50 p-4">
            <div className="flex justify-between">
              <span>ยอดรวม</span>
              <span>{formatCurrency(purchase.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>ส่ว��ลด</span>
              <span>{formatCurrency(purchase.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>ภาษีมูลค่าเพิ่ม ({purchase.taxRate}%)</span>
              <span>{formatCurrency(purchase.tax)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>ยอดสุทธิ</span>
              <span>{formatCurrency(purchase.total)}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit">
              {editPurchase ? 'บันทึกการแก้ไข' : 'สร้างบิลซื้อ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseFormDialog;
