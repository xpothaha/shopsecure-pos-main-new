
// SQL queries for warranty operations
export const warrantyQueries = {
  getAll: `
    SELECT * FROM warranties
    ORDER BY created_at DESC
  `,
  getById: `
    SELECT * FROM warranties
    WHERE id = ?
  `,
  getByProductCode: `
    SELECT * FROM warranties
    WHERE product_code = ?
  `,
  insert: `
    INSERT INTO warranties (
      product_id, product_code, product_name, customer_name,
      start_date, end_date, purchase_price, notes,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `,
  update: `
    UPDATE warranties
    SET product_code = ?, product_name = ?, customer_name = ?,
        start_date = ?, end_date = ?, purchase_price = ?,
        notes = ?, updated_at = ?
    WHERE id = ?
    RETURNING *
  `,
  delete: `
    DELETE FROM warranties
    WHERE id = ?
  `,
};
