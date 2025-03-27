
import { toast } from 'sonner';
import { initializeDatabase, closeDatabase } from '@/utils/database';
import { dbConfig, D1_SCHEMA } from '@/config/database';

// Database initialization service
export const databaseService = {
  initialize: async () => {
    try {
      console.log('Initializing database connection...');
      const success = await initializeDatabase();
      
      if (success) {
        console.log('Database connection established');
        return true;
      } else {
        console.error('Failed to connect to database');
        toast.error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาตรวจสอบการตั้งค่า');
        return false;
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล');
      return false;
    }
  },
  
  // Clean up database connection on app shutdown
  cleanup: async () => {
    await closeDatabase();
  }
};

// Create SQL scripts for database setup (for D1)
export const generateDatabaseSetupScripts = () => {
  return D1_SCHEMA;
};
