
// Export all database related configurations

// Configuration
export { dbConfig } from './config';

// Schema
export { D1_SCHEMA } from './schema';

// SQL Queries
import { authQueries } from './sql/auth';
import { warrantyQueries } from './sql/warranty';
import { saleQueries } from './sql/sale';
import { purchaseQueries } from './sql/purchase';
import { settingsQueries } from './sql/settings';

// Aggregate SQL queries
export const SQL = {
  auth: authQueries,
  warranty: warrantyQueries,
  sale: saleQueries,
  purchase: purchaseQueries,
  settings: settingsQueries
};
