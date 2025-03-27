// Express router for purchases routes
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

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, s.name as supplier_name, u.username as created_by_username
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.purchase_date DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get purchase by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchaseResult = await pool.query(`
      SELECT p.*, s.name as supplier_name, u.username as created_by_username
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (purchaseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const purchase = purchaseResult.rows[0];
    
    // Get purchase items
    const itemsResult = await pool.query(`
      SELECT pi.*, pr.name as product_name, pr.sku
      FROM purchase_items pi
      LEFT JOIN products pr ON pi.product_id = pr.id
      WHERE pi.purchase_id = $1
    `, [id]);
    
    purchase.items = itemsResult.rows;
    
    res.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new purchase
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      supplier_id, 
      purchase_date, 
      reference_number, 
      total_amount, 
      payment_status, 
      payment_method,
      notes,
      items,
      created_by
    } = req.body;
    
    if (!supplier_id) {
      return res.status(400).json({ error: 'Supplier ID is required' });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Purchase items are required' });
    }
    
    // Validate items
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.cost_price) {
        return res.status(400).json({ error: 'Each item must have product_id, quantity, and cost_price' });
      }
      
      // Check if product exists
      const productCheck = await client.query(
        'SELECT * FROM products WHERE id = $1',
        [item.product_id]
      );
      
      if (productCheck.rows.length === 0) {
        return res.status(400).json({ error: `Product with ID ${item.product_id} not found` });
      }
    }
    
    const id = uuidv4();
    
    // Calculate total amount if not provided
    let calculatedTotalAmount = total_amount;
    if (!calculatedTotalAmount) {
      calculatedTotalAmount = items.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0);
    }
    
    // Insert purchase
    const purchaseResult = await client.query(
      `INSERT INTO purchases (
        id, supplier_id, purchase_date, reference_number, 
        total_amount, payment_status, payment_method, notes, 
        created_by, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *`,
      [
        id, 
        supplier_id, 
        purchase_date || new Date().toISOString(), 
        reference_number || '', 
        calculatedTotalAmount, 
        payment_status || 'pending', 
        payment_method || 'cash',
        notes || '',
        created_by
      ]
    );
    
    const purchase = purchaseResult.rows[0];
    
    // Insert purchase items and update product stock
    const purchaseItems = [];
    
    for (const item of items) {
      const itemId = uuidv4();
      
      // Insert purchase item
      const itemResult = await client.query(
        `INSERT INTO purchase_items (
          id, purchase_id, product_id, quantity, cost_price, 
          total_price, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *`,
        [
          itemId,
          id,
          item.product_id,
          item.quantity,
          item.cost_price,
          item.quantity * item.cost_price
        ]
      );
      
      purchaseItems.push(itemResult.rows[0]);
      
      // Update product stock
      await client.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity + $1,
             cost_price = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [item.quantity, item.cost_price, item.product_id]
      );
    }
    
    purchase.items = purchaseItems;
    
    await client.query('COMMIT');
    
    res.status(201).json(purchase);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Update purchase
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { 
      supplier_id, 
      purchase_date, 
      reference_number, 
      total_amount, 
      payment_status, 
      payment_method,
      notes
    } = req.body;
    
    // Check if purchase exists
    const purchaseCheck = await client.query(
      'SELECT * FROM purchases WHERE id = $1',
      [id]
    );
    
    if (purchaseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    // Update purchase
    const result = await client.query(
      `UPDATE purchases 
       SET supplier_id = COALESCE($1, supplier_id),
           purchase_date = COALESCE($2, purchase_date),
           reference_number = COALESCE($3, reference_number),
           total_amount = COALESCE($4, total_amount),
           payment_status = COALESCE($5, payment_status),
           payment_method = COALESCE($6, payment_method),
           notes = COALESCE($7, notes),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        supplier_id, 
        purchase_date, 
        reference_number, 
        total_amount, 
        payment_status, 
        payment_method,
        notes,
        id
      ]
    );
    
    const purchase = result.rows[0];
    
    // Get purchase items
    const itemsResult = await client.query(
      `SELECT pi.*, p.name as product_name, p.sku
       FROM purchase_items pi
       LEFT JOIN products p ON pi.product_id = p.id
       WHERE pi.purchase_id = $1`,
      [id]
    );
    
    purchase.items = itemsResult.rows;
    
    await client.query('COMMIT');
    
    res.json(purchase);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Delete purchase
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Check if purchase exists
    const purchaseCheck = await client.query(
      'SELECT * FROM purchases WHERE id = $1',
      [id]
    );
    
    if (purchaseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    // Get purchase items to revert stock
    const itemsResult = await client.query(
      'SELECT * FROM purchase_items WHERE purchase_id = $1',
      [id]
    );
    
    // Revert stock for each item
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }
    
    // Delete purchase items
    await client.query(
      'DELETE FROM purchase_items WHERE purchase_id = $1',
      [id]
    );
    
    // Delete purchase
    await client.query(
      'DELETE FROM purchases WHERE id = $1',
      [id]
    );
    
    await client.query('COMMIT');
    
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get purchases by supplier
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, s.name as supplier_name, u.username as created_by_username
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.supplier_id = $1
      ORDER BY p.purchase_date DESC
    `, [supplierId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching supplier purchases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add items to purchase
router.post('/:id/items', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Purchase items are required' });
    }
    
    // Check if purchase exists
    const purchaseCheck = await client.query(
      'SELECT * FROM purchases WHERE id = $1',
      [id]
    );
    
    if (purchaseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    const purchase = purchaseCheck.rows[0];
    let totalAmount = parseFloat(purchase.total_amount);
    
    // Add each item
    const addedItems = [];
    
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.cost_price) {
        return res.status(400).json({ error: 'Each item must have product_id, quantity, and cost_price' });
      }
      
      // Check if product exists
      const productCheck = await client.query(
        'SELECT * FROM products WHERE id = $1',
        [item.product_id]
      );
      
      if (productCheck.rows.length === 0) {
        return res.status(400).json({ error: `Product with ID ${item.product_id} not found` });
      }
      
      const itemId = uuidv4();
      const itemTotal = item.quantity * item.cost_price;
      
      // Insert purchase item
      const itemResult = await client.query(
        `INSERT INTO purchase_items (
          id, purchase_id, product_id, quantity, cost_price, 
          total_price, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *`,
        [
          itemId,
          id,
          item.product_id,
          item.quantity,
          item.cost_price,
          itemTotal
        ]
      );
      
      addedItems.push(itemResult.rows[0]);
      
      // Update product stock
      await client.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity + $1,
             cost_price = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [item.quantity, item.cost_price, item.product_id]
      );
      
      // Update total amount
      totalAmount += itemTotal;
    }
    
    // Update purchase total
    await client.query(
      `UPDATE purchases 
       SET total_amount = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [totalAmount, id]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Items added to purchase successfully',
      items: addedItems,
      total_amount: totalAmount
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding items to purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Remove item from purchase
router.delete('/:purchaseId/items/:itemId', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { purchaseId, itemId } = req.params;
    
    // Check if purchase exists
    const purchaseCheck = await client.query(
      'SELECT * FROM purchases WHERE id = $1',
      [purchaseId]
    );
    
    if (purchaseCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    // Check if item exists
    const itemCheck = await client.query(
      'SELECT * FROM purchase_items WHERE id = $1 AND purchase_id = $2',
      [itemId, purchaseId]
    );
    
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase item not found' });
    }
    
    const item = itemCheck.rows[0];
    
    // Update product stock
    await client.query(
      `UPDATE products 
       SET stock_quantity = stock_quantity - $1,
           updated_at = NOW()
       WHERE id = $2`,
      [item.quantity, item.product_id]
    );
    
    // Update purchase total
    await client.query(
      `UPDATE purchases 
       SET total_amount = total_amount - $1,
           updated_at = NOW()
       WHERE id = $2`,
      [item.total_price, purchaseId]
    );
    
    // Delete item
    await client.query(
      'DELETE FROM purchase_items WHERE id = $1',
      [itemId]
    );
    
    await client.query('COMMIT');
    
    res.json({ message: 'Item removed from purchase successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error removing item from purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
