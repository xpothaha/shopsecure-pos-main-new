// Database configuration
import { DbConfig } from '../../types/database';

// Check if we're in development mode
// @ts-ignore
const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

// Database configuration
export const dbConfig: DbConfig = {
  development: {
    expressApiBaseUrl: 'http://localhost:3000/api',
  },
  production: {
    expressApiBaseUrl: '/api',
  },
  // Use development config for local development
  current: isDev ? 'development' : 'production',
};
