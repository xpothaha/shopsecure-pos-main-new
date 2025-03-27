
import { Category, Product, Purchase, Sale, Warranty, LowStockProduct } from '@/types';

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Generate random product code
export const generateProductCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
};

// Generate invoice number
export const generateInvoiceNumber = (prefix: string, id: number): string => {
  return `${prefix}-${id.toString().padStart(6, '0')}`;
};

// Mock categories
export const mockCategories: Category[] = [
  { id: '1', name: 'หูฟัง', description: 'หูฟังทุกประเภท', parentId: null },
  { id: '2', name: 'หูฟังเกมมิ่ง', description: 'หูฟังสำหรับเล่นเกม', parentId: '1' },
  { id: '3', name: 'คอมพิวเตอร์', description: 'คอมพิวเตอร์และอุปกรณ์', parentId: null },
  { id: '4', name: 'โน๊ตบุ๊ค', description: 'คอมพิวเตอร์แบบพกพา', parentId: '3' },
  { id: '5', name: 'เมาส์', description: 'อุปกรณ์นำเข้าข้อมูล', parentId: null },
  { id: '6', name: 'คีย์บอร์ด', description: 'อุปกรณ์นำเข้าข้อมูล', parentId: null },
  { id: '7', name: 'จอภาพ', description: 'จอแสดงผล', parentId: null },
  { id: '8', name: 'อุปกรณ์เน็ตเวิร์ก', description: 'อุปกรณ์เชื่อมต่อเครือข่าย', parentId: null },
  { id: '9', name: 'ลำโพง', description: 'อุปกรณ์เสียง', parentId: null },
];

// Mock products
export const mockProducts: Product[] = [
  {
    id: '1',
    code: 'L06MRXZ4',
    name: 'หูฟังเกมมิ่งรุ่น3',
    description: 'หูฟังเกมมิ่งรุ่น3',
    categoryId: '2',
    price: 300,
    cost: 200,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'L9EA2CME',
    name: 'หูฟังเกมมิ่งรุ่น2',
    description: 'รายละเอียดหูฟังเกมมิ่งรุ่น2',
    categoryId: '2',
    price: 400,
    cost: 200,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'NOTMDL7F',
    name: 'สินค้าทดสอบ5',
    description: 'รายละเอียดสินค้าทดสอบ5',
    categoryId: '1',
    price: 800,
    cost: 400,
    stock: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    code: 'M345OJDZ',
    name: 'หูฟังเกมมิ่งรุ่น6',
    description: 'รายละเอียดหูฟังเกมมิ่งรุ่น6',
    categoryId: '1',
    price: 500,
    cost: 400,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    code: 'NMIYVIZQ',
    name: 'หูฟังเกมมิ่ง62',
    description: 'หูฟังเกมมิ่ง64',
    categoryId: '2',
    price: 200,
    cost: 100,
    stock: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    code: 'KOV1GF4D',
    name: 'หูฟังเกมมิ่งรุ่นใหญ่',
    description: 'หูฟังเกมมิ่งรุ่นใหญ่',
    categoryId: '2',
    price: 400,
    cost: 200,
    stock: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    code: 'OWOY9YQV',
    name: 'เมาส์',
    description: 'เมาส์',
    categoryId: '5',
    price: 400,
    cost: 200,
    stock: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    code: 'U77T3GHP',
    name: 'เหลือสินค้าจากมือซื้อ',
    description: 'เหลือสินค้าจากมือซื้อ',
    categoryId: '7',
    price: 500,
    cost: 300,
    stock: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock purchases
export const mockPurchases: Purchase[] = [
  {
    id: '1',
    invoiceNumber: 'LCB-000001',
    vendorName: 'หูฟังซัพพลายเออร์2',
    vendorTaxId: '1234567890123',
    vendorPhone: '0811234567',
    vendorAddress: 'กรุงเทพฯ',
    date: '2023-01-09',
    items: [
      {
        id: '1',
        productId: '1',
        productCode: 'L06MRXZ4',
        productName: 'หูฟังเกมมิ่งรุ่น3',
        quantity: 5,
        unitPrice: 180,
        total: 900
      },
      {
        id: '2',
        productId: '2',
        productCode: 'L9EA2CME',
        productName: 'หูฟังเกมมิ่งรุ่น2',
        quantity: 2,
        unitPrice: 150,
        total: 300
      }
    ],
    subtotal: 1000,
    tax: 70,
    taxRate: 7,
    discount: 0,
    total: 1070,
    status: 'completed',
    createdAt: '2023-01-09T10:00:00Z',
    updatedAt: '2023-01-09T10:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'LCB-000002',
    vendorName: 'หูฟังซัพพลายเออร์2',
    vendorTaxId: '2222222222',
    vendorPhone: '0222222222',
    vendorAddress: 'หูฟังซัพพลายเออร',
    date: '2023-01-28',
    items: [
      {
        id: '1',
        productId: '3',
        productCode: 'TESTBYEDIT12',
        productName: 'หูฟังเกมมิ่ง',
        quantity: 4,
        unitPrice: 1000,
        total: 4000
      },
      {
        id: '2',
        productId: '4',
        productCode: 'BBBBBB',
        productName: 'หูฟัง5',
        quantity: 9,
        unitPrice: 100,
        total: 900
      }
    ],
    subtotal: 4900,
    tax: 343,
    taxRate: 7,
    discount: 0,
    total: 5243,
    status: 'completed',
    createdAt: '2023-01-28T10:00:00Z',
    updatedAt: '2023-01-28T10:00:00Z'
  }
];

// Mock sales
export const mockSales: Sale[] = [
  {
    id: '1',
    invoiceNumber: 'LCS-000001',
    customerName: 'หูฟังช็อป2',
    customerTaxId: null,
    customerPhone: '0891234567',
    customerAddress: '123 Main Street',
    date: '2023-01-12',
    items: [
      {
        id: '1',
        productId: '1',
        productCode: 'L06MRXZ4',
        productName: 'หูฟังเกมมิ่งรุ่น3',
        quantity: 2,
        unitPrice: 300,
        total: 600
      },
      {
        id: '2',
        productId: '2',
        productCode: 'L9EA2CME',
        productName: 'หูฟังเกมมิ่งรุ่น2',
        quantity: 1,
        unitPrice: 400,
        total: 400
      }
    ],
    subtotal: 1000,
    tax: 0,
    taxRate: 0,
    discount: 0,
    total: 1000,
    status: 'completed',
    createdAt: '2023-01-12T14:00:00Z',
    updatedAt: '2023-01-12T14:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'LCS-000002',
    customerName: 'หูฟังเช็ค2',
    customerTaxId: null,
    customerPhone: '0891234567',
    customerAddress: '456 Second Street',
    date: '2023-01-12',
    items: [
      {
        id: '1',
        productId: '3',
        productCode: 'NOTMDL7F',
        productName: 'สินค้าทดสอบ5',
        quantity: 1,
        unitPrice: 800,
        total: 800
      },
      {
        id: '2',
        productId: '6',
        productCode: 'KOV1GF4D',
        productName: 'หูฟังเกมมิ่งรุ่นใหญ่',
        quantity: 0.5,
        unitPrice: 400,
        total: 200
      }
    ],
    subtotal: 1000,
    tax: 0,
    taxRate: 0,
    discount: 0,
    total: 1000,
    status: 'completed',
    createdAt: '2023-01-12T15:30:00Z',
    updatedAt: '2023-01-12T15:30:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'LCS-000003',
    customerName: 'หูฟังเช็ค3',
    customerTaxId: null,
    customerPhone: '0891234567',
    customerAddress: '789 Third Street',
    date: '2023-01-01',
    items: [
      {
        id: '1',
        productId: '4',
        productCode: 'M345OJDZ',
        productName: 'หูฟังเกมมิ่งรุ่น6',
        quantity: 1,
        unitPrice: 500,
        total: 500
      }
    ],
    subtotal: 500,
    tax: 0,
    taxRate: 0,
    discount: 0,
    total: 500,
    status: 'completed',
    createdAt: '2023-01-01T09:15:00Z',
    updatedAt: '2023-01-01T09:15:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'LCS-000004',
    customerName: 'หูฟังเช็ค4',
    customerTaxId: null,
    customerPhone: '0891234567',
    customerAddress: '101 Fourth Street',
    date: '2023-01-01',
    items: [
      {
        id: '1',
        productId: '5',
        productCode: 'NMIYVIZQ',
        productName: 'หูฟังเกมมิ่ง62',
        quantity: 2,
        unitPrice: 200,
        total: 400
      },
      {
        id: '2',
        productId: '7',
        productCode: 'OWOY9YQV',
        productName: 'เมาส์',
        quantity: 1,
        unitPrice: 400,
        total: 400
      }
    ],
    subtotal: 800,
    tax: 0,
    taxRate: 0,
    discount: 0,
    total: 800,
    status: 'completed',
    createdAt: '2023-01-01T12:45:00Z',
    updatedAt: '2023-01-01T12:45:00Z'
  },
  {
    id: '5',
    invoiceNumber: 'LCS-000005',
    customerName: 'หูฟังซื้อง่าย5',
    customerTaxId: '5555555555555',
    customerPhone: '0555555555',
    customerAddress: '55 M.5',
    date: '2023-01-30',
    items: [
      {
        id: '1',
        productId: '1',
        productCode: 'BBBBBB',
        productName: 'TESTITEMB',
        quantity: 3,
        unitPrice: 100,
        total: 300
      }
    ],
    subtotal: 300,
    tax: 21,
    taxRate: 7,
    discount: 0,
    total: 321,
    status: 'completed',
    createdAt: '2023-01-30T14:00:00Z',
    updatedAt: '2023-01-30T14:00:00Z'
  }
];

// Mock warranties
export const mockWarranties: Warranty[] = [
  {
    id: '1',
    productId: '1',
    productCode: '8434QQ15',
    productName: 'หูฟังเกมมิ่ง',
    customerName: 'หูฟังซื้อลูกค้า',
    startDate: '2023-05-20',
    endDate: '2023-12-20',
    purchasePrice: 300,
    notes: 'หูฟังรุ่น',
    createdAt: '2023-05-20T10:00:00Z',
    updatedAt: '2023-05-20T10:00:00Z'
  }
];

// Mock low stock products
export const mockLowStockProducts: LowStockProduct[] = [
  {
    id: '8',
    code: 'U77T3GHP',
    name: 'เหลือสินค้าจากมือซื้อ',
    stock: 0
  },
  {
    id: '5',
    code: 'NMIYVIZQ',
    name: 'หูฟังเกมมิ่ง62',
    stock: 1
  },
  {
    id: '7',
    code: 'OWOY9YQV',
    name: 'เมาส์',
    stock: 1
  }
];

// Get sales summary for dashboard
export const getSalesSummary = () => {
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = mockProducts.length;
  const lowStockCount = mockProducts.filter(product => product.stock < 2).length;
  
  return {
    totalSales,
    totalProducts,
    lowStockCount
  };
};

// Get low stock products
export const getLowStockProducts = () => {
  return mockProducts
    .filter(product => product.stock < 2)
    .map(product => ({
      id: product.id,
      code: product.code,
      name: product.name,
      stock: product.stock
    }));
};
