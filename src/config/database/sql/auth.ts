
// SQL queries for authentication operations
export const authQueries = {
  getUserByUsername: `
    SELECT id, username, password, password_salt, name, email, role
    FROM users
    WHERE username = ?
  `,
  getUserById: `
    SELECT id, username, name, email, role
    FROM users
    WHERE id = ?
  `,
  updatePassword: `
    UPDATE users
    SET password = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  createUser: `
    INSERT INTO users (id, username, password, password_salt, name, email, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  checkUsernameExists: `
    SELECT id FROM users WHERE username = ?
  `
};
