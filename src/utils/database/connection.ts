import { toast } from 'sonner';
import { dbConfig } from '@/config/database';
import { loadMockData } from './mockData';

// Mock database for frontend development
const mockDb: Record<string, any[]> = {
  users: [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
      email: 'admin@shopsecure.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  warranties: [],
  products: [],
  categories: [],
  sales: [],
  purchases: []
};

// Check if in development mode (use mock data)
export const isDevMode = () => {
  return dbConfig.dev.useMock;
};

// Initialize database connection 
export const initializeDatabase = async () => {
  try {
    if (isDevMode()) {
      console.log('Initializing mock database...');
      // Load mock data
      await loadMockData(mockDb);
      console.log('Mock database initialized successfully');
      return true;
    } else {
      console.log('Using PostgreSQL database via Express API');
      // No additional initialization needed for API calls
      return true;
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    toast.error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้');
    return false;
  }
};

// Close the database connection
export const closeDatabase = async () => {
  console.log('Database connection closed');
};

// Export mockDb for use in other modules
export { mockDb };
