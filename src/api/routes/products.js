// Express router for products routes
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Load environment variables
dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, s.name as supplier_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       ORDER BY p.name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, s.name as supplier_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      barcode,
      category_id,
      supplier_id,
      cost_price,
      selling_price,
      quantity,
      reorder_level,
      reorder_quantity,
      location,
      is_active,
      is_featured,
      image_url,
      attributes
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    
    // Check if product with same SKU already exists
    if (sku) {
      const existingProduct = await pool.query(
        'SELECT * FROM products WHERE sku = $1',
        [sku]
      );
      
      if (existingProduct.rows.length > 0) {
        return res.status(400).json({ error: 'Product with this SKU already exists' });
      }
    }
    
    // Check if product with same barcode already exists
    if (barcode) {
      const existingProduct = await pool.query(
        'SELECT * FROM products WHERE barcode = $1',
        [barcode]
      );
      
      if (existingProduct.rows.length > 0) {
        return res.status(400).json({ error: 'Product with this barcode already exists' });
      }
    }
    
    // If category_id is provided, check if it exists
    if (category_id) {
      const categoryCheck = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [category_id]
      );
      
      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }
    
    // If supplier_id is provided, check if it exists
    if (supplier_id) {
      const supplierCheck = await pool.query(
        'SELECT * FROM suppliers WHERE id = $1',
        [supplier_id]
      );
      
      if (supplierCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Supplier not found' });
      }
    }
    
    // Create new product
    const result = await pool.query(
      `INSERT INTO products (
        id, name, description, sku, barcode, category_id, supplier_id,
        cost_price, selling_price, quantity, reorder_level, reorder_quantity,
        location, is_active, is_featured, image_url, attributes, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW()
      ) RETURNING *`,
      [
        uuidv4(), name, description, sku, barcode, category_id, supplier_id,
        cost_price, selling_price, quantity, reorder_level, reorder_quantity,
        location, is_active, is_featured, image_url, attributes
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      sku,
      barcode,
      category_id,
      supplier_id,
      cost_price,
      selling_price,
      quantity,
      reorder_level,
      reorder_quantity,
      location,
      is_active,
      is_featured,
      image_url,
      attributes
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    
    // Check if product exists
    const productCheck = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product with same SKU already exists (excluding this product)
    if (sku) {
      const existingProduct = await pool.query(
        'SELECT * FROM products WHERE sku = $1 AND id != $2',
        [sku, id]
      );
      
      if (existingProduct.rows.length > 0) {
        return res.status(400).json({ error: 'Product with this SKU already exists' });
      }
    }
    
    // Check if product with same barcode already exists (excluding this product)
    if (barcode) {
      const existingProduct = await pool.query(
        'SELECT * FROM products WHERE barcode = $1 AND id != $2',
        [barcode, id]
      );
      
      if (existingProduct.rows.length > 0) {
        return res.status(400).json({ error: 'Product with this barcode already exists' });
      }
    }
    
    // If category_id is provided, check if it exists
    if (category_id) {
      const categoryCheck = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [category_id]
      );
      
      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }
    
    // If supplier_id is provided, check if it exists
    if (supplier_id) {
      const supplierCheck = await pool.query(
        'SELECT * FROM suppliers WHERE id = $1',
        [supplier_id]
      );
      
      if (supplierCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Supplier not found' });
      }
    }
    
    // Update product
    const result = await pool.query(
      `UPDATE products SET
        name = $1,
        description = $2,
        sku = $3,
        barcode = $4,
        category_id = $5,
        supplier_id = $6,
        cost_price = $7,
        selling_price = $8,
        quantity = $9,
        reorder_level = $10,
        reorder_quantity = $11,
        location = $12,
        is_active = $13,
        is_featured = $14,
        image_url = $15,
        attributes = $16,
        updated_at = NOW()
      WHERE id = $17
      RETURNING *`,
      [
        name, description, sku, barcode, category_id, supplier_id,
        cost_price, selling_price, quantity, reorder_level, reorder_quantity,
        location, is_active, is_featured, image_url, attributes, id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const productCheck = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product is used in sales
    const salesCheck = await pool.query(
      'SELECT * FROM sale_items WHERE product_id = $1 LIMIT 1',
      [id]
    );
    
    if (salesCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete product that is used in sales' });
    }
    
    // Check if product is used in purchases
    const purchasesCheck = await pool.query(
      'SELECT * FROM purchase_items WHERE product_id = $1 LIMIT 1',
      [id]
    );
    
    if (purchasesCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete product that is used in purchases' });
    }
    
    // Delete product
    await pool.query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
