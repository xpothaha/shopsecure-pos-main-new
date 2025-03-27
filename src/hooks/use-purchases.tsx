
import { useState } from 'react';
import { Purchase } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { createPurchaseBillHtml, printHtml, generatePdfFromHtml } from '@/utils/pdf';

// Mock purchase data
const initialPurchases: Purchase[] = [
  {
    id: '1',
    invoiceNumber: 'PO23001',
    vendorName: 'บริษัท เอบีซี จำกัด',
    vendorTaxId: '1234567890123',
    vendorPhone: '02-123-4567',
    vendorAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    date: '2023-10-15',
    items: [
      { 
        id: '101', 
        productId: '1', 
        productCode: 'P001', 
        productName: 'โน๊ตบุ๊ค ASUS VivoBook', 
        quantity: 2, 
        unitPrice: 18500, 
        total: 37000 
      },
      { 
        id: '102', 
        productId: '2', 
        productCode: 'P002', 
        productName: 'จอมอนิเตอร์ Samsung 24"', 
        quantity: 3, 
        unitPrice: 4500, 
        total: 13500 
      }
    ],
    subtotal: 50500,
    tax: 3535,
    taxRate: 7,
    discount: 0,
    total: 54035,
    status: 'completed',
    createdAt: '2023-10-15T08:30:00Z',
    updatedAt: '2023-10-15T08:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'PO23002',
    vendorName: 'บริษัท อุปกรณ์คอม จำกัด',
    vendorTaxId: '9876543210123',
    vendorPhone: '02-987-6543',
    vendorAddress: '456 ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพฯ 10310',
    date: '2023-10-20',
    items: [
      { 
        id: '201', 
        productId: '3', 
        productCode: 'P003', 
        productName: 'คีย์บอร์ด Logitech MX Keys', 
        quantity: 5, 
        unitPrice: 3200, 
        total: 16000 
      }
    ],
    subtotal: 16000,
    tax: 1120,
    taxRate: 7,
    discount: 500,
    total: 16620,
    status: 'completed',
    createdAt: '2023-10-20T10:15:00Z',
    updatedAt: '2023-10-20T10:15:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'PO23003',
    vendorName: 'ร้านอิเล็กทรอนิกส์ทั่วไป',
    vendorTaxId: null,
    vendorPhone: '081-234-5678',
    vendorAddress: '789 ถนนเพชรเกษม แขวงหนองค้างพลู เขตหนองแขม กรุงเทพฯ 10160',
    date: '2023-10-25',
    items: [
      { 
        id: '301', 
        productId: '4', 
        productCode: 'P004', 
        productName: 'เมาส์ไร้สาย Logitech MX Master', 
        quantity: 3, 
        unitPrice: 2800, 
        total: 8400 
      },
      { 
        id: '302', 
        productId: '5', 
        productCode: 'P005', 
        productName: 'หูฟัง Sony WH-1000XM4', 
        quantity: 1, 
        unitPrice: 9500, 
        total: 9500 
      }
    ],
    subtotal: 17900,
    tax: 1253,
    taxRate: 7,
    discount: 1000,
    total: 18153,
    status: 'pending',
    createdAt: '2023-10-25T14:45:00Z',
    updatedAt: '2023-10-25T14:45:00Z'
  }
];

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);

  const filteredPurchases = purchases.filter(purchase => {
    const searchLower = search.toLowerCase();
    const matchesSearch = purchase.invoiceNumber.toLowerCase().includes(searchLower) ||
                         purchase.vendorName.toLowerCase().includes(searchLower);
    const matchesDate = dateFilter ? purchase.date.includes(dateFilter) : true;
    return matchesSearch && matchesDate;
  });

  const handleAddPurchase = () => {
    setSelectedPurchase(null);
    setIsFormOpen(true);
  };
  
  const handleEditPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsFormOpen(true);
  };
  
  const handleViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsViewOpen(true);
  };
  
  const confirmDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeletePurchase = () => {
    if (purchaseToDelete) {
      setPurchases(purchases.filter(purchase => purchase.id !== purchaseToDelete));
      toast.success('ลบบิลซื้อสำเร็จ');
      setPurchaseToDelete(null);
    }
  };
  
  const handleSavePurchase = (purchase: Purchase) => {
    if (purchase.id && purchases.some(p => p.id === purchase.id)) {
      // Edit existing purchase
      setPurchases(purchases.map(p => (p.id === purchase.id ? purchase : p)));
      toast.success('แก้ไขบิลซื้อสำเร็จ');
    } else {
      // Add new purchase
      setPurchases([...purchases, { ...purchase, id: uuidv4() }]);
      toast.success('สร้างบิลซื้อสำเร็จ');
    }
  };
  
  const handlePrintPurchase = (purchase: Purchase) => {
    try {
      const billHtml = createPurchaseBillHtml(purchase);
      printHtml(billHtml);
      toast.success('เริ่มดำเนินการพิมพ์...');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('เกิดข้อผิดพลาดในการพิมพ์');
    }
  };
  
  const handleDownloadPurchasePdf = (purchase: Purchase) => {
    try {
      const billHtml = createPurchaseBillHtml(purchase);
      generatePdfFromHtml(billHtml, `purchase_${purchase.invoiceNumber}.pdf`);
      toast.success('กำลังดาวน์โหลด PDF...');
    } catch (error) {
      console.error('PDF error:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  return {
    purchases: filteredPurchases,
    search,
    dateFilter,
    selectedPurchase,
    isFormOpen,
    isViewOpen,
    deleteDialogOpen,
    purchaseToDelete,
    setSearch,
    setDateFilter,
    handleAddPurchase,
    handleEditPurchase,
    handleViewPurchase,
    confirmDeletePurchase,
    handleDeletePurchase,
    handleSavePurchase,
    handlePrintPurchase,
    handleDownloadPurchasePdf,
    setIsFormOpen,
    setIsViewOpen,
    setDeleteDialogOpen
  };
}
