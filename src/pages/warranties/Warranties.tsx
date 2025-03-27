
import React, { useState } from 'react';
import { Shield, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { generateProductCode } from '@/utils/productCodeGenerator';
import { useToast } from '@/hooks/use-toast';
import { Warranty } from '@/types';
import { useWarranties } from '@/hooks/use-warranties';

// Import our new components
import WarrantySearch from '@/components/warranty/WarrantySearch';
import WarrantyList from '@/components/warranty/WarrantyList';
import WarrantyForm, { WarrantyFormData } from '@/components/warranty/WarrantyForm';

const Warranties: React.FC = () => {
  const { 
    filteredWarranties, 
    searchTerm, 
    setSearchTerm, 
    addWarranty, 
    updateWarranty, 
    deleteWarranty 
  } = useWarranties();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWarranty, setCurrentWarranty] = useState<Warranty | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [warrantyToDelete, setWarrantyToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const handleGenerateCode = () => {
    const newCode = generateProductCode();
    return newCode;
  };
  
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (warranty: Warranty) => {
    setCurrentWarranty(warranty);
    setIsEditModalOpen(true);
  };
  
  const openDeleteConfirm = (warrantyId: string) => {
    setWarrantyToDelete(warrantyId);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteWarranty = () => {
    if (warrantyToDelete) {
      deleteWarranty(warrantyToDelete);
      setIsDeleteConfirmOpen(false);
      setWarrantyToDelete(null);
    }
  };
  
  const onAddSubmit = (data: WarrantyFormData) => {
    const newWarranty = {
      productId: data.productId || Math.random().toString(36).substring(2, 9),
      productCode: data.productCode,
      productName: data.productName,
      customerName: data.customerName,
      startDate: data.startDate,
      endDate: data.endDate,
      purchasePrice: null,
      notes: data.notes,
    };
    
    addWarranty(newWarranty);
    setIsAddModalOpen(false);
  };
  
  const onEditSubmit = (data: WarrantyFormData) => {
    if (!currentWarranty) return;
    
    const updatedData = {
      productCode: data.productCode,
      productName: data.productName,
      customerName: data.customerName,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes,
    };
    
    updateWarranty(currentWarranty.id, updatedData);
    setIsEditModalOpen(false);
    setCurrentWarranty(null);
  };
  
  return (
    <Layout>
      <div className="container mx-auto animate-fade">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold">การรับประกัน</h1>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={openAddModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">เพิ่มข้อมูลการรับประกัน</span>
            <span className="md:hidden">เพิ่ม</span>
          </Button>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow mb-6">
          <div className="mb-6">
            <WarrantySearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
          </div>
          
          <WarrantyList 
            warranties={filteredWarranties} 
            onEdit={openEditModal} 
            onDelete={openDeleteConfirm} 
          />
        </div>
      </div>
      
      {/* Add Warranty Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มข้อมูลการรับประกัน</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลรายละเอียดการรับประกันสินค้า
            </DialogDescription>
          </DialogHeader>
          
          <WarrantyForm 
            onSubmit={onAddSubmit}
            onCancel={() => setIsAddModalOpen(false)}
            onGenerateCode={() => {
              const newCode = handleGenerateCode();
              toast({
                title: "รหัสสินค้าถูกสร้างแล้ว",
                description: `รหัสสินค้าใหม่: ${newCode}`,
              });
              return newCode;
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Warranty Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลการรับประกัน</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลรายละเอียดการรับประกันสินค้า
            </DialogDescription>
          </DialogHeader>
          
          {currentWarranty && (
            <WarrantyForm 
              initialData={currentWarranty}
              onSubmit={onEditSubmit}
              onCancel={() => setIsEditModalOpen(false)}
              onGenerateCode={() => {
                const newCode = handleGenerateCode();
                toast({
                  title: "รหัสสินค้าถูกสร้างแล้ว",
                  description: `รหัสสินค้าใหม่: ${newCode}`,
                });
                return newCode;
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="ยืนยันการลบข้อมูลการรับประกัน"
        description="คุณต้องการลบข้อมูลการรับประกันนี้ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        onConfirm={handleDeleteWarranty}
        confirmText="ลบข้อมูล"
        cancelText="ยกเลิก"
        variant="danger"
      />
    </Layout>
  );
};

export default Warranties;
