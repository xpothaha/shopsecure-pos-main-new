
import { executeQuery } from '@/utils/database';
import { SQL } from '@/config/database';
import { Warranty } from '@/types';

export const WarrantyModel = {
  findAll: async (): Promise<Warranty[]> => {
    const warranties = await executeQuery<Warranty>(SQL.warranty.getAll);
    return warranties || [];
  },
  
  findByProductCode: async (productCode: string): Promise<Warranty | null> => {
    const warranties = await executeQuery<Warranty>(SQL.warranty.getByProductCode, [productCode]);
    return warranties && warranties.length > 0 ? warranties[0] : null;
  },
  
  findById: async (id: string): Promise<Warranty | null> => {
    const warranties = await executeQuery<Warranty>(SQL.warranty.getById, [id]);
    return warranties && warranties.length > 0 ? warranties[0] : null;
  },
  
  create: async (warranty: Omit<Warranty, 'id'>): Promise<Warranty | null> => {
    const now = new Date().toISOString();
    const warranties = await executeQuery<Warranty>(
      SQL.warranty.insert,
      [
        warranty.productId,
        warranty.productCode,
        warranty.productName,
        warranty.customerName,
        warranty.startDate,
        warranty.endDate,
        warranty.purchasePrice,
        warranty.notes,
        now,
        now
      ]
    );
    return warranties && warranties.length > 0 ? warranties[0] : null;
  },
  
  update: async (id: string, warranty: Partial<Warranty>): Promise<Warranty | null> => {
    const now = new Date().toISOString();
    const warranties = await executeQuery<Warranty>(
      SQL.warranty.update,
      [
        id,
        warranty.productCode,
        warranty.productName,
        warranty.customerName,
        warranty.startDate,
        warranty.endDate,
        warranty.purchasePrice,
        warranty.notes,
        now
      ]
    );
    return warranties && warranties.length > 0 ? warranties[0] : null;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const result = await executeQuery(SQL.warranty.delete, [id]);
    return result !== null;
  },
};
