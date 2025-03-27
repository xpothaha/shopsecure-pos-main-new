
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, PenSquare, Trash2, Printer, FileDown } from 'lucide-react';
import { Sale } from '@/types';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { getStatusClass, getStatusLabel } from '@/utils/statusHelpers';

interface SaleCardProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
  onPrint: (sale: Sale) => void;
  onDownloadPdf: (sale: Sale) => void;
}

const SaleCard: React.FC<SaleCardProps> = ({
  sales,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onDownloadPdf
}) => {
  return (
    <div className="space-y-4">
      {sales.length > 0 ? (
        sales.map((sale) => (
          <Card key={sale.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{sale.invoiceNumber}</h3>
                  <p className="text-sm text-gray-500">{formatShortDate(sale.date)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(sale.status)}`}>
                  {getStatusLabel(sale.status)}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="font-medium">{sale.customerName}</p>
                <p className="text-sm text-gray-600">{sale.items.length} รายการ</p>
                <p className="mt-1 text-right font-bold">{formatCurrency(sale.total)}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(sale)}>
                  <Eye className="h-4 w-4 mr-1" />
                  ดูรายละเอียด
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(sale)}>
                  <PenSquare className="h-4 w-4 mr-1" />
                  แก้ไข
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onPrint(sale)}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  พิมพ์
                </Button>
              </div>
              <div className="flex mt-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onDownloadPdf(sale)}
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  ดาวน์โหลด PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-500 hover:text-red-700 hover:border-red-200" 
                  onClick={() => onDelete(sale.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  ลบ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 bg-white rounded-lg">
          <p>ไม่พบข้อมูลบิลขาย</p>
        </div>
      )}
    </div>
  );
};

export default SaleCard;
