// Express router for suppliers routes
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

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM suppliers ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM suppliers WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search suppliers
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM suppliers 
       WHERE name ILIKE $1 OR contact_name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 OR address ILIKE $1
       ORDER BY name ASC`,
      [`%${query}%`]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new supplier
router.post('/', async (req, res) => {
  try {
    const { name, contact_name, phone, email, address, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }
    
    const id = uuidv4();
    
    const result = await pool.query(
      `INSERT INTO suppliers (id, name, contact_name, phone, email, address, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [id, name, contact_name || '', phone || '', email || '', address || '', notes || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_name, phone, email, address, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }
    
    // Check if supplier exists
    const supplierCheck = await pool.query(
      'SELECT * FROM suppliers WHERE id = $1',
      [id]
    );
    
    if (supplierCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    const result = await pool.query(
      `UPDATE suppliers 
       SET name = $1, contact_name = $2, phone = $3, email = $4, address = $5, notes = $6, updated_at = NOW() 
       WHERE id = $7
       RETURNING *`,
      [name, contact_name || '', phone || '', email || '', address || '', notes || '', id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier exists
    const supplierCheck = await pool.query(
      'SELECT * FROM suppliers WHERE id = $1',
      [id]
    );
    
    if (supplierCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    // Check if supplier is being used in purchases
    const purchasesCheck = await pool.query(
      'SELECT COUNT(*) FROM purchases WHERE supplier_id = $1',
      [id]
    );
    
    if (parseInt(purchasesCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete supplier because they have purchase records',
        count: parseInt(purchasesCheck.rows[0].count)
      });
    }
    
    await pool.query(
      'DELETE FROM suppliers WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supplier purchase history
router.get('/:id/purchases', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier exists
    const supplierCheck = await pool.query(
      'SELECT * FROM suppliers WHERE id = $1',
      [id]
    );
    
    if (supplierCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    // Get all purchases for this supplier
    const purchasesResult = await pool.query(
      `SELECT p.*, u.username as created_by_username
       FROM purchases p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.supplier_id = $1
       ORDER BY p.purchase_date DESC`,
      [id]
    );
    
    // Get purchase items for each purchase
    const purchases = await Promise.all(purchasesResult.rows.map(async (purchase) => {
      const itemsResult = await pool.query(
        `SELECT pi.*, pr.name as product_name, pr.sku
         FROM purchase_items pi
         LEFT JOIN products pr ON pi.product_id = pr.id
         WHERE pi.purchase_id = $1`,
        [purchase.id]
      );
      
      return {
        ...purchase,
        items: itemsResult.rows
      };
    }));
    
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching supplier purchase history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
