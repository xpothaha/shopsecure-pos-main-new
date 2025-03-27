// Express router for warranties routes
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

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

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(token, remoteip) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Get all warranties
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, p.name as product_name, c.name as customer_name, s.invoice_number
      FROM warranties w
      LEFT JOIN products p ON w.product_id = p.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN sales s ON w.sale_id = s.id
      ORDER BY w.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching warranties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get warranty by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT w.*, p.name as product_name, c.name as customer_name, s.invoice_number
      FROM warranties w
      LEFT JOIN products p ON w.product_id = p.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN sales s ON w.sale_id = s.id
      WHERE w.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching warranty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get warranty by serial number
router.get('/serial/:serialNumber', async (req, res) => {
  try {
    const { serialNumber } = req.params;
    
    const result = await pool.query(`
      SELECT w.*, p.name as product_name, c.name as customer_name, s.invoice_number
      FROM warranties w
      LEFT JOIN products p ON w.product_id = p.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN sales s ON w.sale_id = s.id
      WHERE w.serial_number = $1
    `, [serialNumber]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching warranty by serial number:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new warranty
router.post('/', async (req, res) => {
  try {
    const { 
      product_id, 
      customer_id, 
      sale_id, 
      serial_number, 
      warranty_period, 
      warranty_start, 
      warranty_end, 
      notes 
    } = req.body;
    
    if (!product_id || !customer_id) {
      return res.status(400).json({ error: 'Product ID and Customer ID are required' });
    }
    
    if (!serial_number) {
      return res.status(400).json({ error: 'Serial number is required' });
    }
    
    // Check if warranty with the same serial number already exists
    const existingWarranty = await pool.query(
      'SELECT * FROM warranties WHERE serial_number = $1',
      [serial_number]
    );
    
    if (existingWarranty.rows.length > 0) {
      return res.status(400).json({ error: 'Warranty with this serial number already exists' });
    }
    
    const id = uuidv4();
    
    // Calculate warranty end date if not provided
    let warrantyEndDate = warranty_end;
    if (!warrantyEndDate && warranty_start && warranty_period) {
      const startDate = new Date(warranty_start);
      warrantyEndDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(warranty_period))).toISOString();
    }
    
    const result = await pool.query(
      `INSERT INTO warranties (
        id, product_id, customer_id, sale_id, serial_number, 
        warranty_period, warranty_start, warranty_end, notes, 
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *`,
      [
        id, product_id, customer_id, sale_id, serial_number,
        warranty_period, warranty_start, warrantyEndDate, notes || ''
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating warranty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update warranty
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      product_id, 
      customer_id, 
      sale_id, 
      serial_number, 
      warranty_period, 
      warranty_start, 
      warranty_end, 
      notes 
    } = req.body;
    
    // Check if warranty exists
    const warrantyCheck = await pool.query(
      'SELECT * FROM warranties WHERE id = $1',
      [id]
    );
    
    if (warrantyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    
    // Check if another warranty with the same serial number exists
    if (serial_number) {
      const existingWarranty = await pool.query(
        'SELECT * FROM warranties WHERE serial_number = $1 AND id != $2',
        [serial_number, id]
      );
      
      if (existingWarranty.rows.length > 0) {
        return res.status(400).json({ error: 'Another warranty with this serial number already exists' });
      }
    }
    
    // Calculate warranty end date if not provided but start date and period are updated
    let warrantyEndDate = warranty_end;
    if (!warrantyEndDate && warranty_start && warranty_period) {
      const startDate = new Date(warranty_start);
      warrantyEndDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(warranty_period))).toISOString();
    }
    
    const result = await pool.query(
      `UPDATE warranties 
       SET product_id = COALESCE($1, product_id),
           customer_id = COALESCE($2, customer_id),
           sale_id = COALESCE($3, sale_id),
           serial_number = COALESCE($4, serial_number),
           warranty_period = COALESCE($5, warranty_period),
           warranty_start = COALESCE($6, warranty_start),
           warranty_end = COALESCE($7, warranty_end),
           notes = COALESCE($8, notes),
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        product_id, customer_id, sale_id, serial_number,
        warranty_period, warranty_start, warrantyEndDate, notes, id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating warranty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete warranty
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if warranty exists
    const warrantyCheck = await pool.query(
      'SELECT * FROM warranties WHERE id = $1',
      [id]
    );
    
    if (warrantyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    
    await pool.query(
      'DELETE FROM warranties WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Warranty deleted successfully' });
  } catch (error) {
    console.error('Error deleting warranty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify warranty (public endpoint)
router.post('/verify', async (req, res) => {
  try {
    const { serial_number, turnstile_token } = req.body;
    
    if (!serial_number) {
      return res.status(400).json({ error: 'Serial number is required' });
    }
    
    // Verify Turnstile token if provided
    if (process.env.TURNSTILE_SECRET_KEY && turnstile_token) {
      try {
        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstile_token,
          }),
        });
        
        const turnstileData = await turnstileResponse.json();
        
        if (!turnstileData.success) {
          return res.status(400).json({ error: 'CAPTCHA verification failed' });
        }
      } catch (error) {
        console.error('Turnstile verification error:', error);
        return res.status(400).json({ error: 'CAPTCHA verification failed' });
      }
    }
    
    const result = await pool.query(`
      SELECT w.*, p.name as product_name, c.name as customer_name, s.invoice_number
      FROM warranties w
      LEFT JOIN products p ON w.product_id = p.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN sales s ON w.sale_id = s.id
      WHERE w.serial_number = $1
    `, [serial_number]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    
    const warranty = result.rows[0];
    
    // Calculate warranty status
    const now = new Date();
    const endDate = new Date(warranty.warranty_end);
    const isValid = now <= endDate;
    
    res.json({
      warranty,
      status: isValid ? 'valid' : 'expired',
      days_remaining: isValid ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : 0
    });
  } catch (error) {
    console.error('Error verifying warranty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
