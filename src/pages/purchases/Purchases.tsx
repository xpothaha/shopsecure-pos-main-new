
import React from 'react';
import { Package, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import PurchaseFormDialog from '@/components/purchases/PurchaseFormDialog';
import PurchaseViewDialog from '@/components/purchases/PurchaseViewDialog';
import PurchaseTable from '@/components/purchases/PurchaseTable';
import PurchaseCard from '@/components/purchases/PurchaseCard';
import PurchaseFilter from '@/components/purchases/PurchaseFilter';
import { getStatusLabel, getStatusClass } from '@/utils/statusHelpers';
import { usePurchases } from '@/hooks/use-purchases';

const Purchases: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    purchases,
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
  } = usePurchases();
  
  return (
    <Layout>
      <div className="container mx-auto animate-fade">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Package className="mr-2" />
            <h1 className="text-3xl font-bold">จัดการบิลซื้อ</h1>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleAddPurchase}
          >
            <Plus className="mr-2 h-4 w-4" />
            สร้างบิลซื้อใหม่
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <PurchaseFilter 
            search={search}
            dateFilter={dateFilter}
            onSearchChange={setSearch}
            onDateFilterChange={setDateFilter}
          />
          
          {isMobile ? (
            <PurchaseCard 
              purchases={purchases}
              onView={handleViewPurchase}
              onEdit={handleEditPurchase}
              onPrint={handlePrintPurchase}
              onDownloadPdf={handleDownloadPurchasePdf}
              onDelete={confirmDeletePurchase}
              getStatusLabel={getStatusLabel}
              getStatusClass={getStatusClass}
            />
          ) : (
            <PurchaseTable 
              purchases={purchases}
              onView={handleViewPurchase}
              onEdit={handleEditPurchase}
              onPrint={handlePrintPurchase}
              onDownloadPdf={handleDownloadPurchasePdf}
              onDelete={confirmDeletePurchase}
              getStatusLabel={getStatusLabel}
              getStatusClass={getStatusClass}
            />
          )}
        </div>
        
        {/* Purchase Form Dialog */}
        <PurchaseFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSavePurchase}
          editPurchase={selectedPurchase}
        />
        
        {/* Purchase View Dialog */}
        <PurchaseViewDialog
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          purchase={selectedPurchase}
        />
        
        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="ยืนยันการลบบิลซื้อ"
          description="คุณต้องการลบบิลซื้อนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
          onConfirm={handleDeletePurchase}
          confirmText="ลบบิลซื้อ"
          cancelText="ยกเลิก"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default Purchases;
