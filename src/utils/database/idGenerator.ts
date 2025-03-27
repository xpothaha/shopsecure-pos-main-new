
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID (for SQLite which doesn't have UUID)
export const generateId = () => {
  return uuidv4();
};
