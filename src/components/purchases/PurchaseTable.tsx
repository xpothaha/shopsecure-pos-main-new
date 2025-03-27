
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Printer, FileDown } from 'lucide-react';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Purchase } from '@/types';

interface PurchaseTableProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
  onEdit: (purchase: Purchase) => void;
  onPrint: (purchase: Purchase) => void;
  onDownloadPdf: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({
  purchases,
  onView,
  onEdit,
  onPrint,
  onDownloadPdf,
  onDelete,
  getStatusLabel,
  getStatusClass
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>เลขที่บิลซื้อ</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>ผู้ขาย</TableHead>
            <TableHead className="text-right">มูลค่ารวม</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead className="text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                <TableCell>{formatShortDate(purchase.date)}</TableCell>
                <TableCell>{purchase.vendorName}</TableCell>
                <TableCell className="text-right">{formatCurrency(purchase.total)}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(purchase.status)}`}>
                    {getStatusLabel(purchase.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onView(purchase)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(purchase)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onPrint(purchase)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onDownloadPdf(purchase)}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => onDelete(purchase.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                ไม่พบข้อมูลบิลซื้อ
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseTable;
