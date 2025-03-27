// Express router for customers routes
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

// Get all customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search customers
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM customers 
       WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 OR address ILIKE $1
       ORDER BY name ASC`,
      [`%${query}%`]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    
    const id = uuidv4();
    
    const result = await pool.query(
      `INSERT INTO customers (id, name, phone, email, address, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [id, name, phone || '', email || '', address || '', notes || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    
    // Check if customer exists
    const customerCheck = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const result = await pool.query(
      `UPDATE customers 
       SET name = $1, phone = $2, email = $3, address = $4, notes = $5, updated_at = NOW() 
       WHERE id = $6
       RETURNING *`,
      [name, phone || '', email || '', address || '', notes || '', id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if customer exists
    const customerCheck = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Check if customer is being used in sales
    const salesCheck = await pool.query(
      'SELECT COUNT(*) FROM sales WHERE customer_id = $1',
      [id]
    );
    
    if (parseInt(salesCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete customer because they have sales records',
        count: parseInt(salesCheck.rows[0].count)
      });
    }
    
    // Check if customer is being used in warranties
    const warrantiesCheck = await pool.query(
      'SELECT COUNT(*) FROM warranties WHERE customer_id = $1',
      [id]
    );
    
    if (parseInt(warrantiesCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete customer because they have warranty records',
        count: parseInt(warrantiesCheck.rows[0].count)
      });
    }
    
    await pool.query(
      'DELETE FROM customers WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer purchase history
router.get('/:id/purchases', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if customer exists
    const customerCheck = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Get all sales for this customer
    const salesResult = await pool.query(
      `SELECT s.*, u.username as created_by_username
       FROM sales s
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.customer_id = $1
       ORDER BY s.created_at DESC`,
      [id]
    );
    
    // Get sale items for each sale
    const sales = await Promise.all(salesResult.rows.map(async (sale) => {
      const itemsResult = await pool.query(
        `SELECT si.*, p.name as product_name, p.sku
         FROM sale_items si
         LEFT JOIN products p ON si.product_id = p.id
         WHERE si.sale_id = $1`,
        [sale.id]
      );
      
      return {
        ...sale,
        items: itemsResult.rows
      };
    }));
    
    res.json(sales);
  } catch (error) {
    console.error('Error fetching customer purchase history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer warranty history
router.get('/:id/warranties', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if customer exists
    const customerCheck = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Get all warranties for this customer
    const result = await pool.query(
      `SELECT w.*, p.name as product_name, s.invoice_number
       FROM warranties w
       LEFT JOIN products p ON w.product_id = p.id
       LEFT JOIN sales s ON w.sale_id = s.id
       WHERE w.customer_id = $1
       ORDER BY w.created_at DESC`,
      [id]
    );
    
    // Calculate warranty status for each warranty
    const warranties = result.rows.map(warranty => {
      const now = new Date();
      const endDate = new Date(warranty.warranty_end);
      const isValid = now <= endDate;
      
      return {
        ...warranty,
        status: isValid ? 'valid' : 'expired',
        days_remaining: isValid ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : 0
      };
    });
    
    res.json(warranties);
  } catch (error) {
    console.error('Error fetching customer warranty history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
