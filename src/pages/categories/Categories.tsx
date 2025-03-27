
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FolderTree, Plus, PenSquare, Trash2, Search } from 'lucide-react';
import { mockCategories } from '@/utils/mockData';
import { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { v4 as uuidv4 } from 'uuid';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    parentId: null
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get parent category name by ID
  const getParentCategoryName = (parentId: string | null): string => {
    if (!parentId) return 'ไม่มีหมวดหมู่หลัก';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : 'ไม่พบหมวดหมู่หลัก';
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" && name === "parentId" ? null : value
    }));
  };
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: null
    });
    setSelectedCategory(null);
  };
  
  // Open add dialog
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId
    });
    setIsEditDialogOpen(true);
  };
  
  // Close dialogs
  const closeAddDialog = () => setIsAddDialogOpen(false);
  const closeEditDialog = () => setIsEditDialogOpen(false);
  
  // Add new category
  const handleAddCategory = () => {
    if (!formData.name) {
      toast({
        title: "กรุณากรอกชื่อหมวดหมู่",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: formData.name,
      description: formData.description || null,
      parentId: formData.parentId || null
    };
    
    setCategories([...categories, newCategory]);
    toast({
      title: "เพิ่มหมวดหมู่สำเร็จ",
      description: `เพิ่ม ${newCategory.name} เรียบร้อยแล้ว`,
    });
    closeAddDialog();
    resetForm();
  };
  
  // Update category
  const handleUpdateCategory = () => {
    if (!selectedCategory || !formData.name) {
      toast({
        title: "กรุณากรอกชื่อหมวดหมู่",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          name: formData.name,
          description: formData.description || null,
          parentId: formData.parentId
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    toast({
      title: "แก้ไขหมวดหมู่สำเร็จ",
      description: `แก้ไข ${formData.name} เรียบร้อยแล้ว`,
    });
    closeEditDialog();
    resetForm();
  };
  
  // Delete category handler
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) {
      // Check if this category is a parent for any other category
      const isParent = categories.some(cat => cat.parentId === categoryId);
      
      if (isParent) {
        toast({
          title: "ไม่สามารถลบได้",
          description: "หมวดหมู่นี้มีหมวดหมู่ย่อยอยู่ กรุณาลบหมวดหมู่ย่อยก่อน",
          variant: "destructive",
        });
        return;
      }
      
      setCategories(categories.filter(category => category.id !== categoryId));
      toast({
        title: "ลบหมวดหมู่สำเร็จ",
      });
    }
  };

  // Render mobile view
  const renderMobileView = () => (
    <div className="space-y-4">
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h3 className="font-medium text-lg">{category.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{category.description || '-'}</p>
            <p className="text-sm mt-2">
              <span className="font-medium">หมวดหมู่หลัก:</span> {getParentCategoryName(category.parentId)}
            </p>
            <div className="flex mt-4 pt-3 border-t border-gray-100 justify-end space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(category)}>
                <PenSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow p-4 text-center">
          ไม่พบข้อมูลหมวดหมู่
        </div>
      )}
    </div>
  );
  
  return (
    <Layout>
      <div className="container mx-auto animate-fade">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FolderTree className="mr-2" />
            <h1 className="text-3xl font-bold">จัดการหมวดหมู่</h1>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มหมวดหมู่ใหม่
          </Button>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="ค้นหาหมวดหมู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {isMobile ? (
            renderMobileView()
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อหมวดหมู่</TableHead>
                    <TableHead>คำอธิบาย</TableHead>
                    <TableHead>หมวดหมู่หลัก</TableHead>
                    <TableHead className="text-center">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>{getParentCategoryName(category.parentId)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => openEditDialog(category)}
                            >
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        ไม่พบข้อมูลหมวดหมู่
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
              <DialogDescription>กรอกข้อมูลเพื่อเพิ่มหมวดหมู่ใหม่</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  ชื่อหมวดหมู่ *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="ใส่ชื่อหมวดหมู่"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  คำอธิบาย
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="ใส่คำอธิบายหมวดหมู่"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="parentId" className="text-sm font-medium">
                  หมวดหมู่หลัก
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.parentId || ""}
                  onChange={handleInputChange}
                >
                  <option value="">ไม่มีหมวดหมู่หลัก</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeAddDialog}>
                ยกเลิก
              </Button>
              <Button onClick={handleAddCategory}>บันทึก</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>แก้ไขหมวดหมู่</DialogTitle>
              <DialogDescription>แก้ไขข้อมูลหมวดหมู่</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  ชื่อหมวดหมู่ *
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="ใส่ชื่อหมวดหมู่"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  คำอธิบาย
                </label>
                <Textarea
                  id="edit-description"
                  name="description"
                  placeholder="ใส่คำอธิบายหมวดหมู่"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-parentId" className="text-sm font-medium">
                  หมวดหมู่หลัก
                </label>
                <select
                  id="edit-parentId"
                  name="parentId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.parentId || ""}
                  onChange={handleInputChange}
                >
                  <option value="">ไม่มีหมวดหมู่หลัก</option>
                  {categories
                    .filter(cat => cat.id !== selectedCategory?.id) // Cannot set itself as parent
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog}>
                ยกเลิก
              </Button>
              <Button onClick={handleUpdateCategory}>บันทึก</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Categories;
