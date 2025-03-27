import { toast } from 'sonner';
import { dbConfig } from '@/config/database';

// API client function for Express API
export const fetchFromApi = async<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T | null> => {
  try {
    const url = `${dbConfig.express.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับ API');
    return null;
  }
};
