// Express router for categories routes
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

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    // Check if category with the same name already exists
    const existingCategory = await pool.query(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );
    
    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    
    const id = uuidv4();
    
    const result = await pool.query(
      `INSERT INTO categories (id, name, description, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [id, name, description || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    // Check if category exists
    const categoryCheck = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if another category with the same name exists
    const existingCategory = await pool.query(
      'SELECT * FROM categories WHERE name = $1 AND id != $2',
      [name, id]
    );
    
    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: 'Another category with this name already exists' });
    }
    
    const result = await pool.query(
      `UPDATE categories 
       SET name = $1, description = $2, updated_at = NOW() 
       WHERE id = $3
       RETURNING *`,
      [name, description || '', id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const categoryCheck = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if category is being used by products
    const productsCheck = await pool.query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1',
      [id]
    );
    
    if (parseInt(productsCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category because it is being used by products',
        count: parseInt(productsCheck.rows[0].count)
      });
    }
    
    await pool.query(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
