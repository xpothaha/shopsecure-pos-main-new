// Express router for sales routes
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

// Get all sales
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM sales ORDER BY created_at DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sale by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get sale
    const saleResult = await pool.query(
      'SELECT * FROM sales WHERE id = $1',
      [id]
    );
    
    if (saleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    const sale = saleResult.rows[0];
    
    // Get sale items
    const itemsResult = await pool.query(
      'SELECT * FROM sale_items WHERE sale_id = $1',
      [id]
    );
    
    const items = itemsResult.rows;
    
    res.json({
      ...sale,
      items
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new sale
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      invoice_number,
      customer_name,
      customer_tax_id,
      customer_phone,
      customer_address,
      date,
      subtotal,
      tax,
      tax_rate,
      discount,
      total,
      status,
      items
    } = req.body;
    
    await client.query('BEGIN');
    
    // Create sale
    const saleId = uuidv4();
    const saleResult = await client.query(
      `INSERT INTO sales (
        id, invoice_number, customer_name, customer_tax_id, customer_phone, 
        customer_address, date, subtotal, tax, tax_rate, discount, total, 
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *`,
      [
        saleId, invoice_number, customer_name, customer_tax_id, customer_phone,
        customer_address, date, subtotal, tax, tax_rate, discount, total,
        status || 'completed'
      ]
    );
    
    const sale = saleResult.rows[0];
    
    // Create sale items
    for (const item of items) {
      await client.query(
        `INSERT INTO sale_items (
          id, sale_id, product_id, product_code, product_name, 
          quantity, unit_price, total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          uuidv4(), saleId, item.product_id, item.product_code, item.product_name,
          item.quantity, item.unit_price, item.total
        ]
      );
      
      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      ...sale,
      items
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Update sale
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const {
      invoice_number,
      customer_name,
      customer_tax_id,
      customer_phone,
      customer_address,
      date,
      subtotal,
      tax,
      tax_rate,
      discount,
      total,
      status,
      items
    } = req.body;
    
    await client.query('BEGIN');
    
    // Check if sale exists
    const checkResult = await client.query(
      'SELECT * FROM sales WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Update sale
    const saleResult = await client.query(
      `UPDATE sales SET
        invoice_number = $1,
        customer_name = $2,
        customer_tax_id = $3,
        customer_phone = $4,
        customer_address = $5,
        date = $6,
        subtotal = $7,
        tax = $8,
        tax_rate = $9,
        discount = $10,
        total = $11,
        status = $12,
        updated_at = NOW()
      WHERE id = $13
      RETURNING *`,
      [
        invoice_number, customer_name, customer_tax_id, customer_phone,
        customer_address, date, subtotal, tax, tax_rate, discount,
        total, status, id
      ]
    );
    
    const sale = saleResult.rows[0];
    
    // Get existing items to restore stock
    const existingItemsResult = await client.query(
      'SELECT * FROM sale_items WHERE sale_id = $1',
      [id]
    );
    
    const existingItems = existingItemsResult.rows;
    
    // Restore stock for existing items
    for (const item of existingItems) {
      await client.query(
        'UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    // Delete existing items
    await client.query(
      'DELETE FROM sale_items WHERE sale_id = $1',
      [id]
    );
    
    // Create new items
    for (const item of items) {
      await client.query(
        `INSERT INTO sale_items (
          id, sale_id, product_id, product_code, product_name, 
          quantity, unit_price, total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          uuidv4(), id, item.product_id, item.product_code, item.product_name,
          item.quantity, item.unit_price, item.total
        ]
      );
      
      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    await client.query('COMMIT');
    
    res.json({
      ...sale,
      items
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Delete sale
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // Check if sale exists
    const checkResult = await client.query(
      'SELECT * FROM sales WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Get sale items to restore stock
    const itemsResult = await client.query(
      'SELECT * FROM sale_items WHERE sale_id = $1',
      [id]
    );
    
    const items = itemsResult.rows;
    
    // Restore stock for items
    for (const item of items) {
      await client.query(
        'UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    // Delete sale items (cascade will handle this, but being explicit)
    await client.query(
      'DELETE FROM sale_items WHERE sale_id = $1',
      [id]
    );
    
    // Delete sale
    await client.query(
      'DELETE FROM sales WHERE id = $1',
      [id]
    );
    
    await client.query('COMMIT');
    
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
