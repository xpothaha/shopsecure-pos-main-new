// Express server for ShopSecure POS
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Import API routes
import authRoutes from './src/api/routes/auth.js';
import categoriesRoutes from './src/api/routes/categories.js';
import customersRoutes from './src/api/routes/customers.js';
import productsRoutes from './src/api/routes/products.js';
import purchasesRoutes from './src/api/routes/purchases.js';
import reportsRoutes from './src/api/routes/reports.js';
import salesRoutes from './src/api/routes/sales.js';
import suppliersRoutes from './src/api/routes/suppliers.js';
import warrantiesRoutes from './src/api/routes/warranties.js';

// API routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Mount route modules
apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoriesRoutes);
apiRouter.use('/customers', customersRoutes);
apiRouter.use('/products', productsRoutes);
apiRouter.use('/purchases', purchasesRoutes);
apiRouter.use('/reports', reportsRoutes);
apiRouter.use('/sales', salesRoutes);
apiRouter.use('/suppliers', suppliersRoutes);
apiRouter.use('/warranties', warrantiesRoutes);

// Mount API router
app.use('/api', apiRouter);

// For SPA routing - serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});
