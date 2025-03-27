import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus, PenSquare, Trash2, Search, Wand2 } from 'lucide-react';
import { mockProducts, mockCategories } from '@/utils/mockData';
import { formatCurrency } from '@/utils/formatters';
import { Product, Category } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { generateProductCode } from '@/utils/productCodeGenerator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ProductFormValues {
  code: string;
  name: string;
  description: string;
  categoryId: string;
  price: string;
  cost: string;
  stock: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const addProductForm = useForm<ProductFormValues>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      categoryId: '',
      price: '',
      cost: '',
      stock: '',
    },
  });
  
  const editProductForm = useForm<ProductFormValues>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      categoryId: '',
      price: '',
      cost: '',
      stock: '',
    },
  });

  const handleGenerateCodeForAdd = () => {
    const newCode = generateProductCode();
    addProductForm.setValue('code', newCode);
    toast({
      title: "รหัสสินค้าถูกสร้างแล้ว",
      description: `รหัสสินค้าใหม่: ${newCode}`,
    });
  };

  const handleGenerateCodeForEdit = () => {
    const newCode = generateProductCode();
    editProductForm.setValue('code', newCode);
    toast({
      title: "รหัสสินค้าถูกสร้างแล้ว",
      description: `รหัสสินค้าใหม่: ${newCode}`,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId === 'all' ? true : product.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  const getCategoryNameById = (categoryId: string): string => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'ไม่ระบุหมวดหมู่';
  };

  const openDeleteConfirm = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(product => product.id !== productToDelete));
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
      toast({
        title: "ลบสินค้าสำเร็จ",
        description: "สินค้าถูกลบออกจากระบบแล้ว",
      });
    }
  };

  const openAddModal = () => {
    addProductForm.reset();
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    editProductForm.reset({
      code: product.code,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
    });
    setIsEditModalOpen(true);
  };

  const onAddSubmit = (data: ProductFormValues) => {
    const newProduct: Product = {
      id: uuidv4(),
      code: data.code,
      name: data.name,
      description: data.description || null,
      categoryId: data.categoryId,
      price: parseFloat(data.price),
      cost: parseFloat(data.cost),
      stock: parseInt(data.stock),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
    toast({
      title: "เพิ่มสินค้าสำเร็จ",
      description: "สินค้าถูกเพิ่มเข้าระบบแล้ว",
    });
  };

  const onEditSubmit = (data: ProductFormValues) => {
    if (!currentProduct) return;
    
    const updatedProducts = products.map(product => {
      if (product.id === currentProduct.id) {
        return {
          ...product,
          code: data.code,
          name: data.name,
          description: data.description || null,
          categoryId: data.categoryId,
          price: parseFloat(data.price),
          cost: parseFloat(data.cost),
          stock: parseInt(data.stock),
          updatedAt: new Date().toISOString(),
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    setCurrentProduct(null);
    toast({
      title: "แก้ไขสินค้าสำเร็จ",
      description: "ข้อมูลสินค้าถูกอัปเดตแล้ว",
    });
  };

  const MobileProductCard = ({ product }: { product: Product }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">รหัส: {product.code}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">หมวดหมู่</p>
            <p>{getCategoryNameById(product.categoryId)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">คงเหลือ</p>
            <p className={`${product.stock <= 5 ? 'text-red-500 font-semibold' : ''}`}>
              {product.stock}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">ราคาทุน</p>
            <p>{formatCurrency(product.cost)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ราคาขาย</p>
            <p>{formatCurrency(product.price)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => openEditModal(product)}
        >
          <PenSquare className="h-4 w-4 mr-1" />
          แก้ไข
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 hover:text-red-700" 
          onClick={() => openDeleteConfirm(product.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          ลบ
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto animate-fade">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Package className="mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold">จัดการสินค้า</h1>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={openAddModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">เพิ่มสินค้าใหม่</span>
            <span className="md:hidden">เพิ่ม</span>
          </Button>
        </div>
        
        <div className="bg-white p-3 md:p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select 
              value={selectedCategoryId} 
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="ทุกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isMobile ? (
            <div className="space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <MobileProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">ไม่พบข้อมูลสินค้า</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสสินค้า</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead className="text-right">ราคาทุน</TableHead>
                    <TableHead className="text-right">ราคาขาย</TableHead>
                    <TableHead className="text-right">คงเหลือ</TableHead>
                    <TableHead className="text-center">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{getCategoryNameById(product.categoryId)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.cost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`${product.stock <= 5 ? 'text-red-500 font-semibold' : ''}`}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => openEditModal(product)}
                            >
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => openDeleteConfirm(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        ไม่พบข้อมูลสินค้า
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลรายละเอียดสินค้าที่ต้องการเพิ่ม
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addProductForm}>
            <form onSubmit={addProductForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addProductForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสสินค้า</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="รหัสสินค้า" 
                            {...field} 
                            icon={<Wand2 />}
                            onIconClick={handleGenerateCodeForAdd}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addProductForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมวดหมู่</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกหมวดหมู่" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อสินค้า</FormLabel>
                      <FormControl>
                        <Input placeholder="ชื่อสินค้า" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รายละเอียด</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="รายละเอียดสินค้า" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={addProductForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ราคาทุน</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addProductForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ราคาขาย</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addProductForm.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>จำนวนคงเหลือ</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="1" 
                            placeholder="0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="sm:justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึก</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขสินค้า</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลรายละเอียดสินค้า
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editProductForm}>
            <form onSubmit={editProductForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editProductForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสสินค้า</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="รหัสสินค้า" 
                            {...field} 
                            icon={<Wand2 />}
                            onIconClick={handleGenerateCodeForEdit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editProductForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมวดหมู่</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกหมวดหมู่" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อสินค้า</FormLabel>
                      <FormControl>
                        <Input placeholder="ชื่อสินค้า" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editProductForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รายละเอียด</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="รายละเอียดสินค้า" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={editProductForm.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ราคาทุน</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editProductForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ราคาขาย</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editProductForm.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>จำนวนคงเหลือ</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="1" 
                            placeholder="0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="sm:justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึก</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="ยืนยันการลบสินค้า"
        description="คุณต้องการลบสินค้านี้ออกจากระบบหรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        onConfirm={handleDeleteProduct}
        confirmText="ลบสินค้า"
        cancelText="ยกเลิก"
        variant="danger"
      />
    </Layout>
  );
};

export default Products;
