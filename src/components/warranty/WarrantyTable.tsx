
import React from 'react';
import { PenSquare, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Warranty } from '@/types';
import { formatShortDate, getWarrantyStatus } from '@/utils/formatters';

interface WarrantyTableProps {
  warranties: Warranty[];
  onEdit: (warranty: Warranty) => void;
  onDelete: (warrantyId: string) => void;
}

const WarrantyTable: React.FC<WarrantyTableProps> = ({ warranties, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสสินค้า</TableHead>
            <TableHead>ชื่อสินค้า</TableHead>
            <TableHead>ลูกค้า</TableHead>
            <TableHead>วันเริ่มต้น</TableHead>
            <TableHead>วันหมดอายุ</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead className="text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warranties.length > 0 ? (
            warranties.map((warranty) => {
              const status = getWarrantyStatus(warranty.endDate);
              return (
                <TableRow key={warranty.id}>
                  <TableCell className="font-medium">{warranty.productCode}</TableCell>
                  <TableCell>{warranty.productName}</TableCell>
                  <TableCell>{warranty.customerName || '-'}</TableCell>
                  <TableCell>{formatShortDate(warranty.startDate)}</TableCell>
                  <TableCell>{formatShortDate(warranty.endDate)}</TableCell>
                  <TableCell>
                    <Badge className={status.color}>
                      {status.text}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(warranty)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => onDelete(warranty.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                ไม่พบข้อมูลการรับประกัน
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WarrantyTable;
