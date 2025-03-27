// Express router for reports routes
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

// Get sales summary report
router.get('/sales/summary', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE s.created_at >= $1 AND s.created_at <= $2';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE s.created_at >= $1';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE s.created_at <= $1';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        SUM(total_amount - total_cost) as total_profit,
        AVG(total_amount) as average_sale,
        MIN(total_amount) as min_sale,
        MAX(total_amount) as max_sale
      FROM sales s
      ${dateFilter}
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error generating sales summary report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales by date report
router.get('/sales/by-date', async (req, res) => {
  try {
    const { start_date, end_date, group_by } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE s.created_at >= $1 AND s.created_at <= $2';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE s.created_at >= $1';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE s.created_at <= $1';
      params.push(end_date);
    }
    
    let timeFormat = "DATE_TRUNC('day', s.created_at)";
    if (group_by === 'month') {
      timeFormat = "DATE_TRUNC('month', s.created_at)";
    } else if (group_by === 'year') {
      timeFormat = "DATE_TRUNC('year', s.created_at)";
    } else if (group_by === 'week') {
      timeFormat = "DATE_TRUNC('week', s.created_at)";
    } else if (group_by === 'hour') {
      timeFormat = "DATE_TRUNC('hour', s.created_at)";
    }
    
    const query = `
      SELECT 
        ${timeFormat} as date,
        COUNT(*) as sales_count,
        SUM(total_amount) as total_revenue,
        SUM(total_amount - total_cost) as total_profit
      FROM sales s
      ${dateFilter}
      GROUP BY date
      ORDER BY date ASC
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating sales by date report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top selling products report
router.get('/products/top-selling', async (req, res) => {
  try {
    const { start_date, end_date, limit } = req.query;
    
    let dateFilter = '';
    const params = [parseInt(limit) || 10];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE s.created_at >= $2 AND s.created_at <= $3';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE s.created_at >= $2';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE s.created_at <= $2';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        SUM(si.quantity) as total_quantity,
        SUM(si.total_price) as total_revenue,
        SUM(si.total_price - (si.quantity * p.cost_price)) as total_profit,
        COUNT(DISTINCT s.id) as sales_count
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      JOIN sales s ON si.sale_id = s.id
      ${dateFilter}
      GROUP BY p.id, p.name, p.sku
      ORDER BY total_quantity DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating top selling products report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inventory value report
router.get('/inventory/value', async (req, res) => {
  try {
    const query = `
      SELECT 
        SUM(stock_quantity * cost_price) as total_cost_value,
        SUM(stock_quantity * selling_price) as total_selling_value,
        SUM(stock_quantity * (selling_price - cost_price)) as potential_profit,
        COUNT(*) as total_products,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_products,
        SUM(CASE WHEN stock_quantity <= reorder_level THEN 1 ELSE 0 END) as low_stock_products
      FROM products
    `;
    
    const result = await pool.query(query);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error generating inventory value report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get low stock products report
router.get('/inventory/low-stock', async (req, res) => {
  try {
    const { limit } = req.query;
    
    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.stock_quantity,
        p.reorder_level,
        p.cost_price,
        p.selling_price,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock_quantity <= p.reorder_level
      ORDER BY (p.reorder_level - p.stock_quantity) DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [parseInt(limit) || 20]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating low stock products report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales by category report
router.get('/sales/by-category', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE s.created_at >= $1 AND s.created_at <= $2';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE s.created_at >= $1';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE s.created_at <= $1';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT s.id) as sales_count,
        SUM(si.quantity) as total_quantity,
        SUM(si.total_price) as total_revenue,
        SUM(si.total_price - (si.quantity * p.cost_price)) as total_profit
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      JOIN sales s ON si.sale_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${dateFilter}
      GROUP BY c.id, c.name
      ORDER BY total_revenue DESC
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating sales by category report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top customers report
router.get('/customers/top', async (req, res) => {
  try {
    const { start_date, end_date, limit } = req.query;
    
    let dateFilter = '';
    const params = [parseInt(limit) || 10];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE s.created_at >= $2 AND s.created_at <= $3';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE s.created_at >= $2';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE s.created_at <= $2';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.email,
        COUNT(s.id) as sales_count,
        SUM(s.total_amount) as total_spent,
        AVG(s.total_amount) as average_purchase,
        MAX(s.created_at) as last_purchase_date
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      ${dateFilter}
      GROUP BY c.id, c.name, c.phone, c.email
      ORDER BY total_spent DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating top customers report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profit margin report
router.get('/sales/profit-margin', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE s.created_at >= $1 AND s.created_at <= $2';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE s.created_at >= $1';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE s.created_at <= $1';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        SUM(si.quantity) as total_quantity,
        SUM(si.total_price) as total_revenue,
        SUM(si.quantity * p.cost_price) as total_cost,
        SUM(si.total_price - (si.quantity * p.cost_price)) as total_profit,
        CASE 
          WHEN SUM(si.total_price) > 0 
          THEN ROUND((SUM(si.total_price - (si.quantity * p.cost_price)) / SUM(si.total_price)) * 100, 2)
          ELSE 0
        END as profit_margin
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      JOIN sales s ON si.sale_id = s.id
      ${dateFilter}
      GROUP BY p.id, p.name, p.sku
      ORDER BY profit_margin DESC
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating profit margin report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment methods report
router.get('/sales/payment-methods', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE created_at >= $1 AND created_at <= $2';
      params.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'WHERE created_at >= $1';
      params.push(start_date);
    } else if (end_date) {
      dateFilter = 'WHERE created_at <= $1';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        payment_method,
        COUNT(*) as sales_count,
        SUM(total_amount) as total_amount,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales ${dateFilter})), 2) as percentage
      FROM sales
      ${dateFilter}
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `;
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating payment methods report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get warranty status report
router.get('/warranties/status', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_warranties,
        SUM(CASE WHEN warranty_end >= CURRENT_DATE THEN 1 ELSE 0 END) as active_warranties,
        SUM(CASE WHEN warranty_end < CURRENT_DATE THEN 1 ELSE 0 END) as expired_warranties,
        SUM(CASE WHEN warranty_end BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' THEN 1 ELSE 0 END) as expiring_soon
      FROM warranties
    `;
    
    const result = await pool.query(query);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error generating warranty status report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expiring warranties report
router.get('/warranties/expiring', async (req, res) => {
  try {
    const { days, limit } = req.query;
    const daysAhead = parseInt(days) || 30;
    
    const query = `
      SELECT 
        w.id,
        w.serial_number,
        w.warranty_start,
        w.warranty_end,
        w.warranty_period,
        p.name as product_name,
        p.sku,
        c.name as customer_name,
        c.phone,
        c.email,
        s.invoice_number,
        EXTRACT(DAY FROM (w.warranty_end - CURRENT_DATE)) as days_remaining
      FROM warranties w
      JOIN products p ON w.product_id = p.id
      JOIN customers c ON w.customer_id = c.id
      LEFT JOIN sales s ON w.sale_id = s.id
      WHERE w.warranty_end BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '$1 days'
      ORDER BY w.warranty_end ASC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [daysAhead, parseInt(limit) || 50]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error generating expiring warranties report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
