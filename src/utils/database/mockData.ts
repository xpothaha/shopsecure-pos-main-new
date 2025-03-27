import { mockDb } from './connection';

/**
 * Load mock data for testing and development
 */
export const loadMockData = async (mockDb: Record<string, any[]>) => {
  console.log('Loading mock data...');
  
  // Create default admin user if not exists
  if (!mockDb.users || mockDb.users.length === 0) {
    mockDb.users = [
      {
        id: '1',
        username: 'admin',
        password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
        password_salt: '0123456789abcdef',
        name: 'Admin User',
        email: 'admin@shopsecure.com',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
  
  // Initialize settings if not exists
  if (!mockDb.app_settings) {
    mockDb.app_settings = [
      {
        id: '1',
        key: 'registration_enabled',
        value: 'false',
        description: 'เปิด/ปิดระบบการสมัครสมาชิก',
        updated_at: new Date().toISOString()
      }
    ];
  }
  
  // Initialize other collections with empty arrays if they don't exist
  if (!mockDb.warranties) mockDb.warranties = [];
  if (!mockDb.products) mockDb.products = [];
  if (!mockDb.categories) mockDb.categories = [];
  if (!mockDb.sales) mockDb.sales = [];
  if (!mockDb.purchases) mockDb.purchases = [];
  
  console.log('Mock data loaded successfully');
  return true;
};
