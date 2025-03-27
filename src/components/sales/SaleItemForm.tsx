
import React from 'react';
import { X } from 'lucide-react';
import { SaleItem, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface SaleItemFormProps {
  item: SaleItem;
  index: number;
  products: Product[];
  onItemChange: (index: number, field: keyof SaleItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  showRemoveButton: boolean;
}

const SaleItemForm: React.FC<SaleItemFormProps> = ({
  item,
  index,
  products,
  onItemChange,
  onRemoveItem,
  showRemoveButton
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md relative">
      {showRemoveButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => onRemoveItem(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <Label htmlFor={`item-${index}-product`}>สินค้า *</Label>
          <select
            id={`item-${index}-product`}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={item.productId}
            onChange={(e) => onItemChange(index, 'productId', e.target.value)}
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
            onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
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
            onChange={(e) => onItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
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
  );
};

export default SaleItemForm;
