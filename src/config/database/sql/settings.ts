
// SQL queries for application settings
export const settingsQueries = {
  getAllSettings: `
    SELECT id, key, value, description, updated_at
    FROM app_settings
  `,
  
  getSettingByKey: `
    SELECT id, key, value, description, updated_at
    FROM app_settings
    WHERE key = ?
  `,
  
  updateSetting: `
    UPDATE app_settings
    SET value = ?, updated_at = CURRENT_TIMESTAMP
    WHERE key = ?
  `,
  
  createSetting: `
    INSERT INTO app_settings (id, key, value, description, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `,
  
  deleteSetting: `
    DELETE FROM app_settings
    WHERE key = ?
  `
};
