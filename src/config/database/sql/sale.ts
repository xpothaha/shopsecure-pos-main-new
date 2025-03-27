
// SQL queries for sale operations
export const saleQueries = {
  getAll: `
    SELECT * FROM sales
    ORDER BY date DESC
  `,
  getById: `
    SELECT * FROM sales
    WHERE id = ?
  `,
  insert: `
    INSERT INTO sales (
      invoice_number, customer_name, customer_tax_id, customer_phone,
      customer_address, date, subtotal, tax, tax_rate, discount,
      total, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING id
  `,
  insertItem: `
    INSERT INTO sale_items (
      sale_id, product_id, product_code, product_name,
      quantity, unit_price, total
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE sales
    SET invoice_number = ?, customer_name = ?, customer_tax_id = ?,
        customer_phone = ?, customer_address = ?, date = ?,
        subtotal = ?, tax = ?, tax_rate = ?, discount = ?,
        total = ?, status = ?, updated_at = ?
    WHERE id = ?
    RETURNING id
  `,
  deleteItems: `
    DELETE FROM sale_items
    WHERE sale_id = ?
  `,
  delete: `
    DELETE FROM sales
    WHERE id = ?
  `,
  getItems: `
    SELECT * FROM sale_items
    WHERE sale_id = ?
  `,
};
