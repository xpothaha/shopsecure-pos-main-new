
// Import PDF libraries
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatShortDate } from './formatters';

// Generate PDF function
export const generatePdf = (element: HTMLElement, filename: string): void => {
  console.log(`Generating PDF from ${element.id} with filename ${filename}`);
  
  const options = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Use html2pdf library
  html2pdf().from(element).set(options).save();
};

// Create purchase bill HTML for printing/PDF
export const createPurchaseBillHtml = (purchase: any): string => {
  const itemRows = purchase.items.map((item: any, index: number) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productCode}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    <div class="bill-container" style="font-family: 'Sarabun', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">ใบสั่งซื้อ</h1>
        <p style="margin: 5px 0; font-size: 14px;">บริษัท EXAMPLE CO., LTD.</p>
        <p style="margin: 5px 0; font-size: 14px;">123 ถนนสาทร แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120</p>
        <p style="margin: 5px 0; font-size: 14px;">โทร: 02-123-4567 แฟกซ์: 02-123-4568</p>
        <p style="margin: 5px 0; font-size: 14px;">เลขประจำตัวผู้เสียภาษี: 0123456789012</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="width: 48%;">
          <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">ข้อมูลบิลซื้อ</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0;">เลขที่ใบซื้อ:</td>
              <td style="padding: 4px 0; text-align: right;"><strong>${purchase.invoiceNumber}</strong></td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">วันที่:</td>
              <td style="padding: 4px 0; text-align: right;">${formatShortDate(purchase.date)}</td>
            </tr>
          </table>
        </div>
        <div style="width: 48%;">
          <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">ข้อมูลผู้ขาย</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0;">ชื่อผู้ขาย:</td>
              <td style="padding: 4px 0; text-align: right;"><strong>${purchase.vendorName}</strong></td>
            </tr>
            ${purchase.vendorTaxId ? `
            <tr>
              <td style="padding: 4px 0;">เลขประจำตัวผู้เสียภาษี:</td>
              <td style="padding: 4px 0; text-align: right;">${purchase.vendorTaxId}</td>
            </tr>` : ''}
            ${purchase.vendorPhone ? `
            <tr>
              <td style="padding: 4px 0;">เบอร์โทรศัพท์:</td>
              <td style="padding: 4px 0; text-align: right;">${purchase.vendorPhone}</td>
            </tr>` : ''}
            ${purchase.vendorAddress ? `
            <tr>
              <td style="padding: 4px 0;">ที่อยู่:</td>
              <td style="padding: 4px 0; text-align: right;">${purchase.vendorAddress}</td>
            </tr>` : ''}
          </table>
        </div>
      </div>

      <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">รายการสินค้า</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">ลำดับ</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">รหัสสินค้า</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">ชื่อสินค้า</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">จำนวน</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">ราคาต่อหน่วย</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">รวมเป็นเงิน</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <table style="width: 300px; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0;">ยอดรวม:</td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(purchase.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">ส่วนลด:</td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(purchase.discount)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">ภาษีมูลค่าเพิ่ม (${purchase.taxRate}%):</td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(purchase.tax)}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td style="padding: 8px 0; border-top: 1px solid #ddd;">ยอดสุทธิ:</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #ddd;">${formatCurrency(purchase.total)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 14px;">
        <div style="width: 45%; text-align: center;">
          <div style="margin-bottom: 60px;">ลงชื่อ................................................ผู้สั่งซื้อ</div>
          <div>(.................................................)</div>
          <div>วันที่........../........../............</div>
        </div>
        <div style="width: 45%; text-align: center;">
          <div style="margin-bottom: 60px;">ลงชื่อ................................................ผู้อนุมัติ</div>
          <div>(.................................................)</div>
          <div>วันที่........../........../............</div>
        </div>
      </div>
    </div>
  `;
};

// Create sale bill HTML for printing/PDF
export const createSaleBillHtml = (sale: any): string => {
  const itemRows = sale.items.map((item: any, index: number) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${index + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productCode}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    <div class="bill-container" style="font-family: 'Sarabun', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">ใบเสร็จรับเงิน</h1>
        <p style="margin: 5px 0; font-size: 14px;">บริษัท EXAMPLE CO., LTD.</p>
        <p style="margin: 5px 0; font-size: 14px;">123 ถนนสาทร แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120</p>
        <p style="margin: 5px 0; font-size: 14px;">โทร: 02-123-4567 แฟกซ์: 02-123-4568</p>
        <p style="margin: 5px 0; font-size: 14px;">เลขประจำตัวผู้เสียภาษี: 0123456789012</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="width: 48%;">
          <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">ข้อมูลบิลขาย</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0;">เลขที่ใบขาย:</td>
              <td style="padding: 4px 0; text-align: right;"><strong>${sale.invoiceNumber}</strong></td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">วันที่:</td>
              <td style="padding: 4px 0; text-align: right;">${formatShortDate(sale.date)}</td>
            </tr>
          </table>
        </div>
        <div style="width: 48%;">
          <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">ข้อมูลลูกค้า</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0;">ชื่อลูกค้า:</td>
              <td style="padding: 4px 0; text-align: right;"><strong>${sale.customerName}</strong></td>
            </tr>
            ${sale.customerTaxId ? `
            <tr>
              <td style="padding: 4px 0;">เลขประจำตัวผู้เสียภาษี:</td>
              <td style="padding: 4px 0; text-align: right;">${sale.customerTaxId}</td>
            </tr>` : ''}
            ${sale.customerPhone ? `
            <tr>
              <td style="padding: 4px 0;">เบอร์โทรศัพท์:</td>
              <td style="padding: 4px 0; text-align: right;">${sale.customerPhone}</td>
            </tr>` : ''}
            ${sale.customerAddress ? `
            <tr>
              <td style="padding: 4px 0;">ที่อยู่:</td>
              <td style="padding: 4px 0; text-align: right;">${sale.customerAddress}</td>
            </tr>` : ''}
          </table>
        </div>
      </div>

      <h2 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">รายการสินค้า</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">ลำดับ</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">รหัสสินค้า</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">ชื่อสินค้า</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">จำนวน</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">ราคาต่อหน่วย</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">รวมเป็นเงิน</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <table style="width: 300px; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0;">ยอดรวม:</td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(sale.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">ส่วนลด:</td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(sale.discount)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">ภาษีมูลค่าเพิ่ม (${sale.taxRate}%):</td>
            <td style="padding: 8px 0; text-align: right;">${formatCurrency(sale.tax)}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td style="padding: 8px 0; border-top: 1px solid #ddd;">ยอดสุทธิ:</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #ddd;">${formatCurrency(sale.total)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 14px;">
        <div style="width: 45%; text-align: center;">
          <div style="margin-bottom: 60px;">ลงชื่อ................................................ผู้รับเงิน</div>
          <div>(.................................................)</div>
          <div>วันที่........../........../............</div>
        </div>
        <div style="width: 45%; text-align: center;">
          <div style="margin-bottom: 60px;">ลงชื่อ................................................ผู้จ่ายเงิน</div>
          <div>(.................................................)</div>
          <div>วันที่........../........../............</div>
        </div>
      </div>
    </div>
  `;
};

// Print function - alternative approach that doesn't reload the page
export const printElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }
  
  // Write content to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Sarabun', sans-serif; }
          @media print {
            body { margin: 0; padding: 15mm; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Wait for resources to load before printing
  printWindow.onload = function() {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = function() {
      printWindow.close();
    };
  };
};

// Print bill directly with HTML content
export const printHtml = (html: string): void => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }
  
  // Write content to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Sarabun', sans-serif; }
          @media print {
            body { margin: 0; padding: 15mm; }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Wait for resources to load before printing
  printWindow.onload = function() {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = function() {
      printWindow.close();
    };
  };
};

// Generate PDF directly from HTML content
export const generatePdfFromHtml = (html: string, filename: string): void => {
  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  const options = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // Use html2pdf library
  html2pdf()
    .from(container)
    .set(options)
    .save()
    .then(() => {
      // Remove the temporary container
      document.body.removeChild(container);
    });
};
