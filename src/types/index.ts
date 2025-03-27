
// User types
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
}

// Product types
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Purchase types
export interface PurchaseItem {
  id?: string;
  productId: string;
  productCode?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorTaxId: string | null;
  vendorPhone: string | null;
  vendorAddress: string | null;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Sales types
export interface SaleItem {
  id?: string;
  productId: string;
  productCode?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerTaxId: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  date: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Warranty types
export interface Warranty {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  customerName: string | null;
  startDate: string;
  endDate: string;
  purchasePrice: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface SalesSummary {
  totalSales: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface LowStockProduct {
  id: string;
  code: string;
  name: string;
  stock: number;
}

// Pagination and filtering
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}
