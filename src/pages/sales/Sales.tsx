
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Receipt, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSales } from '@/hooks/use-sales';
import SaleFormDialog from '@/components/sales/SaleFormDialog';
import SaleViewDialog from '@/components/sales/SaleViewDialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import SaleFilter from '@/components/sales/SaleFilter';
import SaleTable from '@/components/sales/SaleTable';
import SaleCard from '@/components/sales/SaleCard';

const Sales: React.FC = () => {
  const isMobile = useIsMobile();
  const {
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
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleViewSale,
    handleEditSale,
    handleSaveSale,
    confirmDeleteSale,
    handleDeleteSale,
    handlePrintSale,
    handleDownloadSalePdf
  } = useSales();
  
  return (
    <Layout>
      <div className="container mx-auto animate-fade">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Receipt className="mr-2" />
            <h1 className="text-3xl font-bold">จัดการบิลขาย</h1>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            สร้างบิลขายใหม่
          </Button>
        </div>
        
        <Card className="p-6 rounded-lg shadow mb-6">
          <SaleFilter 
            searchTerm={searchTerm}
            dateFilter={dateFilter}
            onSearchChange={setSearchTerm}
            onDateChange={setDateFilter}
          />
          
          {isMobile ? (
            <SaleCard
              sales={filteredSales}
              onView={handleViewSale}
              onEdit={handleEditSale}
              onDelete={confirmDeleteSale}
              onPrint={handlePrintSale}
              onDownloadPdf={handleDownloadSalePdf}
            />
          ) : (
            <SaleTable
              sales={filteredSales}
              onView={handleViewSale}
              onEdit={handleEditSale}
              onDelete={confirmDeleteSale}
              onPrint={handlePrintSale}
              onDownloadPdf={handleDownloadSalePdf}
            />
          )}
        </Card>
        
        {/* Dialogs */}
        <SaleFormDialog 
          isOpen={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)} 
          onSave={handleSaveSale}
        />
        
        <SaleFormDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => setIsEditDialogOpen(false)} 
          onSave={handleSaveSale}
          editSale={currentSale}
        />
        
        <SaleViewDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          sale={currentSale}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="ยืนยันการลบบิลขาย"
          description="คุณต้องการลบบิลขายนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
          onConfirm={handleDeleteSale}
          confirmText="ลบบิลขาย"
          cancelText="ยกเลิก"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default Sales;
