
import React from 'react';
import { PenSquare, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Warranty } from '@/types';
import { formatShortDate, getWarrantyStatus } from '@/utils/formatters';

interface WarrantyCardProps {
  warranty: Warranty;
  onEdit: (warranty: Warranty) => void;
  onDelete: (warrantyId: string) => void;
}

const WarrantyCard: React.FC<WarrantyCardProps> = ({ warranty, onEdit, onDelete }) => {
  const status = getWarrantyStatus(warranty.endDate);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>{warranty.productCode}</span>
          <Badge className={status.color}>
            {status.text}
          </Badge>
        </CardTitle>
        <CardDescription>{warranty.productName}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">ลูกค้า</p>
            <p>{warranty.customerName || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">วันเริ่มต้น</p>
            <p>{formatShortDate(warranty.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">วันหมดอายุ</p>
            <p>{formatShortDate(warranty.endDate)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(warranty)}
        >
          <PenSquare className="h-4 w-4 mr-1" />
          แก้ไข
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 hover:text-red-700" 
          onClick={() => onDelete(warranty.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          ลบ
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WarrantyCard;
