-- PostgreSQL database schema for ShopSecure POS

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_id UUID,
  price DECIMAL(12, 2) NOT NULL,
  cost DECIMAL(12, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create warranties table
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  customer_name VARCHAR(100),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  purchase_price DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_tax_id VARCHAR(20),
  customer_phone VARCHAR(20),
  customer_address TEXT,
  date TIMESTAMP NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) NOT NULL,
  discount DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL,
  product_id UUID NOT NULL,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  vendor_name VARCHAR(100) NOT NULL,
  vendor_tax_id VARCHAR(20),
  vendor_phone VARCHAR(20),
  vendor_address TEXT,
  date TIMESTAMP NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) NOT NULL,
  discount DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create purchase_items table
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID NOT NULL,
  product_id UUID NOT NULL,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (key, value, description, updated_at)
VALUES ('registration_enabled', 'false', 'เปิด/ปิดระบบการสมัครสมาชิก', NOW())
ON CONFLICT (key) DO NOTHING;

-- Insert default admin user (username: adminpot, password: 147258369)
INSERT INTO users (username, password, password_salt, name, email, role, created_at, updated_at)
VALUES ('adminpot', '$2a$10$XQCg1z4YSl5K1NzMUmGRnuWQxwJ2PwZnU5FQGkK.6FKXDjcW/n.Hy', '$2a$10$XQCg1z4YSl5K1NzMUmGRnu', 'Admin User', 'admin@shopsecure.com', 'admin', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;
