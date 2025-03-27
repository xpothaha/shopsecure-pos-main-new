
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Printer, FileDown } from 'lucide-react';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Purchase } from '@/types';

interface PurchaseCardProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
  onEdit: (purchase: Purchase) => void;
  onPrint: (purchase: Purchase) => void;
  onDownloadPdf: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({
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
    <div className="space-y-4">
      {purchases.length > 0 ? (
        purchases.map((purchase) => (
          <Card key={purchase.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{purchase.invoiceNumber}</h3>
                  <p className="text-sm text-gray-500">{formatShortDate(purchase.date)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(purchase.status)}`}>
                  {getStatusLabel(purchase.status)}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="font-medium">{purchase.vendorName}</p>
                <p className="text-sm text-gray-600">{purchase.items.length} รายการ</p>
                <p className="mt-1 text-right font-bold">{formatCurrency(purchase.total)}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(purchase)}>
                  <Eye className="h-4 w-4 mr-1" />
                  ดูรายละเอียด
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(purchase)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  แก้ไข
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onPrint(purchase)}
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
                  onClick={() => onDownloadPdf(purchase)}
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  ดาวน์โหลด PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-500 hover:text-red-700 hover:border-red-200" 
                  onClick={() => onDelete(purchase.id)}
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
          <p>ไม่พบข้อมูลบิลซื้อ</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseCard;
