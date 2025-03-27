
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, PenSquare, Trash2, Printer, FileDown } from 'lucide-react';
import { Sale } from '@/types';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { getStatusClass, getStatusLabel } from '@/utils/statusHelpers';

interface SaleTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
  onPrint: (sale: Sale) => void;
  onDownloadPdf: (sale: Sale) => void;
}

const SaleTable: React.FC<SaleTableProps> = ({
  sales,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onDownloadPdf
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>เลขที่ใบขาย</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>ชื่อลูกค้า</TableHead>
            <TableHead className="text-right">มูลค่ารวม</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead className="text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                <TableCell>{formatShortDate(sale.date)}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(sale.status)}`}>
                    {getStatusLabel(sale.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onView(sale)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(sale)}
                    >
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onPrint(sale)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onDownloadPdf(sale)}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => onDelete(sale.id)}
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
                ไม่พบข้อมูลบิลขาย
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaleTable;
