
import { executeQuery } from '@/utils/database';
import { SQL } from '@/config/database';
import { Sale, SaleItem } from '@/types';

export const SaleModel = {
  findAll: async (): Promise<Sale[]> => {
    const sales = await executeQuery<Sale>(SQL.sale.getAll);
    if (!sales) return [];
    
    // Get items for each sale
    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const items = await executeQuery<SaleItem>(SQL.sale.getItems, [sale.id]);
        return { ...sale, items: items || [] };
      })
    );
    
    return salesWithItems;
  },
  
  findById: async (id: string): Promise<Sale | null> => {
    const sales = await executeQuery<Sale>(SQL.sale.getById, [id]);
    if (!sales || sales.length === 0) return null;
    
    const sale = sales[0];
    const items = await executeQuery<SaleItem>(SQL.sale.getItems, [id]);
    
    return { ...sale, items: items || [] };
  },
  
  create: async (sale: Omit<Sale, 'id'>): Promise<Sale | null> => {
    const now = new Date().toISOString();
    
    // Insert sale
    const sales = await executeQuery<{ id: string }>(
      SQL.sale.insert,
      [
        sale.invoiceNumber,
        sale.customerName,
        sale.customerTaxId,
        sale.customerPhone,
        sale.customerAddress,
        sale.date,
        sale.subtotal,
        sale.tax,
        sale.taxRate,
        sale.discount,
        sale.total,
        sale.status,
        now,
        now
      ]
    );
    
    if (!sales || sales.length === 0) return null;
    
    const saleId = sales[0].id;
    
    // Insert sale items
    if (sale.items && sale.items.length > 0) {
      for (const item of sale.items) {
        await executeQuery(
          SQL.sale.insertItem,
          [
            saleId,
            item.productId,
            item.productCode || '',
            item.productName || '',
            item.quantity,
            item.unitPrice,
            item.total
          ]
        );
      }
    }
    
    // Use the SaleModel's findById method
    return await SaleModel.findById(saleId);
  },
  
  update: async (id: string, sale: Omit<Sale, 'id'>): Promise<Sale | null> => {
    const now = new Date().toISOString();
    
    // Update sale
    const sales = await executeQuery<{ id: string }>(
      SQL.sale.update,
      [
        id,
        sale.invoiceNumber,
        sale.customerName,
        sale.customerTaxId || null,
        sale.customerPhone || null,
        sale.customerAddress || null,
        sale.date,
        sale.subtotal,
        sale.tax,
        sale.taxRate,
        sale.discount,
        sale.total,
        sale.status,
        now
      ]
    );
    
    if (!sales || sales.length === 0) return null;
    
    // Delete existing items
    await executeQuery(SQL.sale.deleteItems, [id]);
    
    // Insert updated items
    if (sale.items && sale.items.length > 0) {
      for (const item of sale.items) {
        await executeQuery(
          SQL.sale.insertItem,
          [
            id,
            item.productId,
            item.productCode || '',
            item.productName || '',
            item.quantity,
            item.unitPrice,
            item.total
          ]
        );
      }
    }
    
    // Use the SaleModel's findById method
    return await SaleModel.findById(id);
  },
  
  delete: async (id: string): Promise<boolean> => {
    // Delete items first (due to foreign key constraints)
    await executeQuery(SQL.sale.deleteItems, [id]);
    
    // Delete sale
    const result = await executeQuery(SQL.sale.delete, [id]);
    return result !== null;
  },
};
