
import { v4 as uuidv4 } from 'uuid';
import { Sale, SaleItem } from '@/types';

export const emptySaleItem: SaleItem = {
  productId: '',
  quantity: 1,
  unitPrice: 0,
  total: 0
};

export const createDefaultSale = (): Sale => {
  const newInvoiceNumber = `INV${new Date().getFullYear().toString().slice(2)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  return {
    id: uuidv4(),
    invoiceNumber: newInvoiceNumber,
    customerName: '',
    customerTaxId: '',
    customerPhone: '',
    customerAddress: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ ...emptySaleItem }],
    subtotal: 0,
    tax: 0,
    taxRate: 7,
    discount: 0,
    total: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const calculateItemTotal = (item: SaleItem): number => {
  return item.quantity * item.unitPrice;
};

export const updateTotals = (sale: Sale): Sale => {
  const subtotal = sale.items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal - sale.discount) * (sale.taxRate / 100);
  const total = subtotal - sale.discount + tax;
  
  return {
    ...sale,
    subtotal,
    tax,
    total
  };
};
