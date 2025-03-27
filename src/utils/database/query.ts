
import { toast } from 'sonner';
import { isDevMode, mockDb } from './connection';
import { generateId } from './idGenerator';
import { fetchFromApi } from './apiClient';
import { createDataObjectFromParams } from './dataMapper';

// Execute a query with parameters
export const executeQuery = async<T>(
  query: string, 
  params: any[] = []
): Promise<T[] | null> => {
  try {
    if (isDevMode()) {
      // Mock database mode
      console.log('Executing mock query:', query);
      console.log('With params:', params);
      
      // Simple query parser for basic queries
      if (query.includes('SELECT') || query.includes('select')) {
        // Handle selects based on table names
        if (query.includes('users') && query.includes('username') && params.length > 0) {
          // Login query
          const username = params[0];
          const password = params[1];
          const user = mockDb.users.find(u => u.username === username && u.password === password);
          return user ? [user] as unknown as T[] : [] as unknown as T[];
        } 
        else if (query.includes('warranties')) {
          if (params.length > 0 && query.includes('product_code')) {
            // Get warranty by product code
            const productCode = params[0];
            const warranty = mockDb.warranties.find(w => w.productCode === productCode);
            return warranty ? [warranty] as unknown as T[] : [] as unknown as T[];
          } else if (params.length > 0 && query.includes('id')) {
            // Get warranty by id
            const id = params[0];
            const warranty = mockDb.warranties.find(w => w.id === id);
            return warranty ? [warranty] as unknown as T[] : [] as unknown as T[];
          } else {
            // Get all warranties
            return mockDb.warranties as unknown as T[];
          }
        }
        // Add more conditions for other tables as needed
      } 
      else if (query.includes('INSERT') || query.includes('insert')) {
        // Handle inserts
        if (query.includes('warranties')) {
          const newWarranty = {
            id: generateId(),
            productId: params[0],
            productCode: params[1],
            productName: params[2],
            customerName: params[3],
            startDate: params[4],
            endDate: params[5],
            purchasePrice: params[6],
            notes: params[7],
            created_at: params[8],
            updated_at: params[9]
          };
          mockDb.warranties.push(newWarranty);
          return [newWarranty] as unknown as T[];
        }
        // Add more conditions for other tables as needed
      }
      else if (query.includes('UPDATE') || query.includes('update')) {
        // Handle updates
        if (query.includes('warranties')) {
          const id = params[params.length - 1]; // id is last parameter
          const index = mockDb.warranties.findIndex(w => w.id === id);
          if (index !== -1) {
            mockDb.warranties[index] = {
              ...mockDb.warranties[index],
              productCode: params[0] || mockDb.warranties[index].productCode,
              productName: params[1] || mockDb.warranties[index].productName,
              customerName: params[2] || mockDb.warranties[index].customerName,
              startDate: params[3] || mockDb.warranties[index].startDate,
              endDate: params[4] || mockDb.warranties[index].endDate,
              purchasePrice: params[5] || mockDb.warranties[index].purchasePrice,
              notes: params[6] || mockDb.warranties[index].notes,
              updated_at: params[7]
            };
            return [mockDb.warranties[index]] as unknown as T[];
          }
        }
        // Add more conditions for other tables as needed
      }
      else if (query.includes('DELETE') || query.includes('delete')) {
        // Handle deletes
        if (query.includes('warranties')) {
          const id = params[0];
          const index = mockDb.warranties.findIndex(w => w.id === id);
          if (index !== -1) {
            mockDb.warranties.splice(index, 1);
            return [] as unknown as T[];
          }
        }
        // Add more conditions for other tables as needed
      }
      
      // Default return empty array if no specific handler
      return [] as unknown as T[];
    } else {
      // Cloudflare D1 mode - convert SQL query to API call
      
      // Extract table name from query
      const tableMatch = query.match(/FROM\\s+([a-zA-Z_]+)/i) || query.match(/INTO\\s+([a-zA-Z_]+)/i);
      const tableName = tableMatch ? tableMatch[1].toLowerCase() : '';
      
      if (!tableName) {
        console.error('Could not determine table name from query:', query);
        return null;
      }
      
      // Convert SQL to REST API endpoints
      if (query.includes('SELECT') || query.includes('select')) {
        // Query to fetch data
        if (query.includes('id = ?') && params.length > 0) {
          // Fetch by ID
          return await fetchFromApi<T[]>(`/${tableName}/${params[0]}`);
        } else if ((tableName === 'users') && params.length >= 2) {
          // Login query
          return await fetchFromApi<T[]>(`/auth/login`, 'POST', {
            username: params[0],
            password: params[1]
          });
        } else if (tableName.includes('_items') && params.length > 0) {
          // Fetch items for specific sale/purchase
          const parentTable = tableName.replace('_items', '');
          const parentId = params[0];
          return await fetchFromApi<T[]>(`/${parentTable}/${parentId}/items`);
        } else {
          // Fetch all records
          return await fetchFromApi<T[]>(`/${tableName}`);
        }
      } 
      else if (query.includes('INSERT') || query.includes('insert')) {
        // Insert query
        if (tableName.includes('_items') && params.length > 0) {
          // Add items to a sale/purchase
          const parentTable = tableName.replace('_items', '');
          const parentId = params[0];
          const itemData = {
            product_id: params[1],
            product_code: params[2],
            product_name: params[3],
            quantity: params[4],
            unit_price: params[5],
            total: params[6]
          };
          return await fetchFromApi<T[]>(`/${parentTable}/${parentId}/items`, 'POST', itemData);
        } else {
          // Insert general data
          // Convert parameters to object according to schema
          const data = createDataObjectFromParams(tableName, params);
          return await fetchFromApi<T[]>(`/${tableName}`, 'POST', data);
        }
      }
      else if (query.includes('UPDATE') || query.includes('update')) {
        // Update query
        const id = params[params.length - 1];
        // Convert parameters to object according to schema
        const data = createDataObjectFromParams(tableName, params.slice(0, -1));
        return await fetchFromApi<T[]>(`/${tableName}/${id}`, 'PUT', data);
      }
      else if (query.includes('DELETE') || query.includes('delete')) {
        // Delete query
        if (tableName.includes('_items') && params.length > 0) {
          // Delete all items for a sale/purchase
          const parentTable = tableName.replace('_items', '');
          const parentId = params[0];
          return await fetchFromApi<T[]>(`/${parentTable}/${parentId}/items`, 'DELETE');
        } else {
          // Delete general data
          const id = params[0];
          return await fetchFromApi<T[]>(`/${tableName}/${id}`, 'DELETE');
        }
      }
      
      // Default return empty array if no specific handler
      console.warn('Query not handled by API converter:', query);
      return [] as unknown as T[];
    }
  } catch (error) {
    console.error('Database query error:', error);
    toast.error('เกิดข้อผิดพลาดในการสืบค้นข้อมูล');
    return null;
  }
};
