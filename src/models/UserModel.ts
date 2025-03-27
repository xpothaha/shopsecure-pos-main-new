
import { executeQuery } from '@/utils/database';
import { SQL } from '@/config/database';
import { User } from '@/types';
import { verifyPassword, hashPassword } from '@/utils/passwordUtils';
import { v4 as uuidv4 } from 'uuid';

interface UserWithPassword extends User {
  password: string;
  password_salt: string;
}

interface RegisterUserData {
  username: string;
  password: string;
  name: string;
  email: string;
  role?: "admin" | "employee";
}

export const UserModel = {
  findByCredentials: async (username: string, password: string, turnstileToken?: string): Promise<User | null> => {
    try {
      // Verify Turnstile token if provided
      if (turnstileToken) {
        // In a real application, we would verify the token with Cloudflare
        // For now, we'll just check that it's not empty
        console.log("Verifying Turnstile token:", turnstileToken);
        // The actual verification would happen on the server side
      }

      const users = await executeQuery<UserWithPassword>(SQL.auth.getUserByUsername, [username]);
      
      if (!users || users.length === 0) {
        return null;
      }
      
      const user = users[0];
      
      const isValid = verifyPassword(password, user.password, user.password_salt);
      
      if (!isValid) {
        return null;
      }
      
      const { password: _, password_salt: __, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      console.error('Error finding user by credentials:', error);
      return null;
    }
  },
  
  findById: async (id: string): Promise<User | null> => {
    const users = await executeQuery<User>(SQL.auth.getUserById, [id]);
    return users && users.length > 0 ? users[0] : null;
  },
  
  updatePassword: async (userId: string, newPassword: string, salt: string): Promise<boolean> => {
    try {
      await executeQuery(SQL.auth.updatePassword, [newPassword, salt, userId]);
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  },
  
  register: async (userData: RegisterUserData): Promise<User | null> => {
    try {
      const { username, password, name, email, role = 'employee' } = userData;
      
      const existingUsers = await executeQuery<{ id: string }>(SQL.auth.checkUsernameExists, [username]);
      if (existingUsers && existingUsers.length > 0) {
        throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
      }
      
      const { hash, salt } = hashPassword(password);
      
      const userId = uuidv4();
      const now = new Date().toISOString();
      
      await executeQuery(SQL.auth.createUser, [
        userId, username, hash, salt, name, email, role, now, now
      ]);
      
      return {
        id: userId,
        username,
        name,
        email,
        role
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  }
};
