// Database schema for D1
export const D1_SCHEMA = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT,
  price REAL NOT NULL,
  cost REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create warranties table
CREATE TABLE IF NOT EXISTS warranties (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  purchase_price REAL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_tax_id TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  date TEXT NOT NULL,
  subtotal REAL NOT NULL,
  tax REAL NOT NULL,
  tax_rate REAL NOT NULL,
  discount REAL NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total REAL NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_tax_id TEXT,
  vendor_phone TEXT,
  vendor_address TEXT,
  date TEXT NOT NULL,
  subtotal REAL NOT NULL,
  tax REAL NOT NULL,
  tax_rate REAL NOT NULL,
  discount REAL NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create purchase_items table
CREATE TABLE IF NOT EXISTS purchase_items (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total REAL NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TEXT NOT NULL
);

-- Insert default settings
INSERT OR IGNORE INTO app_settings (id, key, value, description, updated_at)
VALUES ('1', 'registration_enabled', 'false', 'เปิด/ปิดระบบการสมัครสมาชิก', CURRENT_TIMESTAMP);
`;
