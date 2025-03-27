
import { executeQuery } from '@/utils/database';
import { SQL } from '@/config/database';
import { Purchase, PurchaseItem } from '@/types';

export const PurchaseModel = {
  findAll: async (): Promise<Purchase[]> => {
    const purchases = await executeQuery<Purchase>(SQL.purchase.getAll);
    if (!purchases) return [];
    
    // Get items for each purchase
    const purchasesWithItems = await Promise.all(
      purchases.map(async (purchase) => {
        const items = await executeQuery<PurchaseItem>(SQL.purchase.getItems, [purchase.id]);
        return { ...purchase, items: items || [] };
      })
    );
    
    return purchasesWithItems;
  },
  
  findById: async (id: string): Promise<Purchase | null> => {
    const purchases = await executeQuery<Purchase>(SQL.purchase.getById, [id]);
    if (!purchases || purchases.length === 0) return null;
    
    const purchase = purchases[0];
    const items = await executeQuery<PurchaseItem>(SQL.purchase.getItems, [id]);
    
    return { ...purchase, items: items || [] };
  },
  
  create: async (purchase: Omit<Purchase, 'id'>): Promise<Purchase | null> => {
    const now = new Date().toISOString();
    
    // Insert purchase
    const purchases = await executeQuery<{ id: string }>(
      SQL.purchase.insert,
      [
        purchase.invoiceNumber,
        purchase.vendorName,
        purchase.vendorTaxId || null,
        purchase.vendorPhone || null,
        purchase.vendorAddress || null,
        purchase.date,
        purchase.subtotal,
        purchase.tax,
        purchase.taxRate,
        purchase.discount,
        purchase.total,
        purchase.status,
        now,
        now
      ]
    );
    
    if (!purchases || purchases.length === 0) return null;
    
    const purchaseId = purchases[0].id;
    
    // Insert purchase items
    if (purchase.items && purchase.items.length > 0) {
      for (const item of purchase.items) {
        await executeQuery(
          SQL.purchase.insertItem,
          [
            purchaseId,
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
    
    // Use the PurchaseModel's findById method
    return await PurchaseModel.findById(purchaseId);
  },
  
  update: async (id: string, purchase: Omit<Purchase, 'id'>): Promise<Purchase | null> => {
    const now = new Date().toISOString();
    
    // Update purchase
    const purchases = await executeQuery<{ id: string }>(
      SQL.purchase.update,
      [
        id,
        purchase.invoiceNumber,
        purchase.vendorName,
        purchase.vendorTaxId || null,
        purchase.vendorPhone || null,
        purchase.vendorAddress || null,
        purchase.date,
        purchase.subtotal,
        purchase.tax,
        purchase.taxRate,
        purchase.discount,
        purchase.total,
        purchase.status,
        now
      ]
    );
    
    if (!purchases || purchases.length === 0) return null;
    
    // Delete existing items
    await executeQuery(SQL.purchase.deleteItems, [id]);
    
    // Insert updated items
    if (purchase.items && purchase.items.length > 0) {
      for (const item of purchase.items) {
        await executeQuery(
          SQL.purchase.insertItem,
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
    
    // Use the PurchaseModel's findById method
    return await PurchaseModel.findById(id);
  },
  
  delete: async (id: string): Promise<boolean> => {
    // Delete items first (due to foreign key constraints)
    await executeQuery(SQL.purchase.deleteItems, [id]);
    
    // Delete purchase
    const result = await executeQuery(SQL.purchase.delete, [id]);
    return result !== null;
  },
};
