
// Helper function to create data object from params for API requests
export function createDataObjectFromParams(tableName: string, params: any[]): Record<string, any> {
  // Create object based on table schema
  if (tableName === 'warranties') {
    return {
      product_id: params[0],
      product_code: params[1],
      product_name: params[2],
      customer_name: params[3],
      start_date: params[4],
      end_date: params[5],
      purchase_price: params[6],
      notes: params[7],
      created_at: params[8],
      updated_at: params[9]
    };
  } 
  else if (tableName === 'sales') {
    return {
      invoice_number: params[0],
      customer_name: params[1],
      customer_tax_id: params[2],
      customer_phone: params[3],
      customer_address: params[4],
      date: params[5],
      subtotal: params[6],
      tax: params[7],
      tax_rate: params[8],
      discount: params[9],
      total: params[10],
      status: params[11],
      created_at: params[12],
      updated_at: params[13]
    };
  }
  // Add mappings for other tables as needed
  
  // Default empty object
  return {};
}
