
import { useState } from 'react';
import { Sale } from '@/types';
import { mockSales } from '@/utils/mockData';
import { toast } from 'sonner';
import { createSaleBillHtml, printHtml, generatePdfFromHtml } from '@/utils/pdf';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  
  // Filter sales based on search term and date
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? sale.date.includes(dateFilter) : true;
    return matchesSearch && matchesDate;
  });
  
  // Handle view sale
  const handleViewSale = (sale: Sale) => {
    setCurrentSale(sale);
    setIsViewDialogOpen(true);
  };
  
  // Handle edit sale
  const handleEditSale = (sale: Sale) => {
    setCurrentSale(sale);
    setIsEditDialogOpen(true);
  };
  
  // Handle save sale (both add and edit)
  const handleSaveSale = (sale: Sale) => {
    if (sale) {
      const index = sales.findIndex(s => s.id === sale.id);
      if (index !== -1) {
        // Edit existing sale
        const updatedSales = [...sales];
        updatedSales[index] = sale;
        setSales(updatedSales);
      } else {
        // Add new sale
        setSales([...sales, sale]);
      }
    }
  };
  
  // Open delete confirmation dialog
  const confirmDeleteSale = (saleId: string) => {
    setSaleToDelete(saleId);
    setDeleteDialogOpen(true);
  };
  
  // Delete sale handler
  const handleDeleteSale = () => {
    if (saleToDelete) {
      setSales(sales.filter(sale => sale.id !== saleToDelete));
      toast.success('ลบบิลขายสำเร็จ');
      setSaleToDelete(null);
    }
  };

  // Print sale bill
  const handlePrintSale = (sale: Sale) => {
    try {
      const billHtml = createSaleBillHtml(sale);
      printHtml(billHtml);
      toast.success('เริ่มดำเนินการพิมพ์...');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('เกิดข้อผิดพลาดในการพิมพ์');
    }
  };
  
  // Download sale bill as PDF
  const handleDownloadSalePdf = (sale: Sale) => {
    try {
      const billHtml = createSaleBillHtml(sale);
      generatePdfFromHtml(billHtml, `sale_${sale.invoiceNumber}.pdf`);
      toast.success('กำลังดาวน์โหลด PDF...');
    } catch (error) {
      console.error('PDF error:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  return {
    sales,
    filteredSales,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentSale,
    setCurrentSale,
    deleteDialogOpen,
    setDeleteDialogOpen,
    saleToDelete,
    handleViewSale,
    handleEditSale,
    handleSaveSale,
    confirmDeleteSale,
    handleDeleteSale,
    handlePrintSale,
    handleDownloadSalePdf
  };
}
