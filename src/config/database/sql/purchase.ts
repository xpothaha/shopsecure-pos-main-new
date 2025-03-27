
// SQL queries for purchase operations
export const purchaseQueries = {
  getAll: `
    SELECT * FROM purchases
    ORDER BY date DESC
  `,
  getById: `
    SELECT * FROM purchases
    WHERE id = ?
  `,
  insert: `
    INSERT INTO purchases (
      invoice_number, vendor_name, vendor_tax_id, vendor_phone,
      vendor_address, date, subtotal, tax, tax_rate, discount,
      total, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING id
  `,
  insertItem: `
    INSERT INTO purchase_items (
      purchase_id, product_id, product_code, product_name,
      quantity, unit_price, total
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE purchases
    SET invoice_number = ?, vendor_name = ?, vendor_tax_id = ?,
        vendor_phone = ?, vendor_address = ?, date = ?,
        subtotal = ?, tax = ?, tax_rate = ?, discount = ?,
        total = ?, status = ?, updated_at = ?
    WHERE id = ?
    RETURNING id
  `,
  deleteItems: `
    DELETE FROM purchase_items
    WHERE purchase_id = ?
  `,
  delete: `
    DELETE FROM purchases
    WHERE id = ?
  `,
  getItems: `
    SELECT * FROM purchase_items
    WHERE purchase_id = ?
  `,
};
