
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Eye, Printer, FileDown } from 'lucide-react';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Sale } from '@/types';
import { printHtml, generatePdfFromHtml, createSaleBillHtml } from '@/utils/pdf';
import { toast } from 'sonner';

interface SaleViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'เสร็จสิ้น';
    case 'pending':
      return 'รอดำเนินการ';
    case 'cancelled':
      return 'ยกเลิก';
    default:
      return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SaleViewDialog: React.FC<SaleViewDialogProps> = ({ 
  isOpen, 
  onClose, 
  sale 
}) => {
  if (!sale) return null;
  
  const handlePrint = () => {
    try {
      const billHtml = createSaleBillHtml(sale);
      printHtml(billHtml);
      toast.success('เริ่มดำเนินการพิมพ์...');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('เกิดข้อผิดพลาดในการพิมพ์');
    }
  };
  
  const handleDownloadPdf = () => {
    try {
      const billHtml = createSaleBillHtml(sale);
      generatePdfFromHtml(billHtml, `sale_${sale.invoiceNumber}.pdf`);
      toast.success('กำลังดาวน์โหลด PDF...');
    } catch (error) {
      console.error('PDF error:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            รายละเอียดบิลขาย
          </DialogTitle>
        </DialogHeader>
        
        <div id="sale-detail" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">ข้อมูลบิลขาย</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">เลขที่ใบขาย:</span>
                  <span className="font-medium">{sale.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่:</span>
                  <span>{formatShortDate(sale.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">สถานะ:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(sale.status)}`}>
                    {getStatusLabel(sale.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">ข้อมูลลูกค้า</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">ชื่อลูกค้า:</span>
                  <span className="font-medium">{sale.customerName}</span>
                </div>
                {sale.customerTaxId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">เลขประจำตัวผู้เสียภาษี:</span>
                    <span>{sale.customerTaxId}</span>
                  </div>
                )}
                {sale.customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                    <span>{sale.customerPhone}</span>
                  </div>
                )}
                {sale.customerAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">ที่อยู่:</span>
                    <span className="text-right">{sale.customerAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">รายการสินค้า</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ลำดับ</TableHead>
                    <TableHead>รหัสสินค้า</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead className="text-right">จำนวน</TableHead>
                    <TableHead className="text-right">ราคาต่อหน่วย</TableHead>
                    <TableHead className="text-right">รวมเป็นเงิน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="md:flex-1"></div>
            <div className="md:w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ยอดรวม:</span>
                <span>{formatCurrency(sale.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ส่วนลด:</span>
                <span>{formatCurrency(sale.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ภาษีมูลค่าเพิ่ม ({sale.taxRate}%):</span>
                <span>{formatCurrency(sale.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>ยอดสุทธิ:</span>
                <span>{formatCurrency(sale.total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            พิมพ์
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            <FileDown className="h-4 w-4 mr-2" />
            ดาวน์โหลด PDF
          </Button>
          <Button onClick={onClose}>
            ปิด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaleViewDialog;
