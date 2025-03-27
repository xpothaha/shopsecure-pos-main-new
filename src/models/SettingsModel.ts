
import { executeQuery } from '@/utils/database';
import { SQL } from '@/config/database';
import { v4 as uuidv4 } from 'uuid';

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export const SettingsModel = {
  getAllSettings: async (): Promise<AppSetting[]> => {
    try {
      return await executeQuery<AppSetting>(SQL.settings.getAllSettings, []);
    } catch (error) {
      console.error('Error getting all settings:', error);
      return [];
    }
  },
  
  getSettingByKey: async (key: string): Promise<AppSetting | null> => {
    try {
      const settings = await executeQuery<AppSetting>(SQL.settings.getSettingByKey, [key]);
      return settings && settings.length > 0 ? settings[0] : null;
    } catch (error) {
      console.error(`Error getting setting by key ${key}:`, error);
      return null;
    }
  },
  
  updateSetting: async (key: string, value: string): Promise<boolean> => {
    try {
      await executeQuery(SQL.settings.updateSetting, [value, key]);
      return true;
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }
  },
  
  createSetting: async (key: string, value: string, description?: string): Promise<AppSetting | null> => {
    try {
      const id = uuidv4();
      await executeQuery(SQL.settings.createSetting, [id, key, value, description || null, new Date().toISOString()]);
      
      return {
        id,
        key,
        value,
        description: description || null,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error creating setting ${key}:`, error);
      return null;
    }
  },
  
  isRegistrationEnabled: async (): Promise<boolean> => {
    try {
      const setting = await SettingsModel.getSettingByKey('registration_enabled');
      return setting ? setting.value === 'true' : false;
    } catch (error) {
      console.error('Error checking if registration is enabled:', error);
      return false;
    }
  },
  
  toggleRegistration: async (enabled: boolean): Promise<boolean> => {
    return await SettingsModel.updateSetting('registration_enabled', enabled ? 'true' : 'false');
  }
};
