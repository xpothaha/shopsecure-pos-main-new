// Express API for ShopSecure POS
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const customersRoutes = require('./routes/customers');
const warrantiesRoutes = require('./routes/warranties');
const purchasesRoutes = require('./routes/purchases');
const suppliersRoutes = require('./routes/suppliers');
const reportsRoutes = require('./routes/reports');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'shopsecure',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/warranties', warrantiesRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/reports', reportsRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

// Export for testing
module.exports = app;
