
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  User, 
  LockKeyhole, 
  LogOut, 
  Save, 
  ShieldAlert, 
  Mail, 
  Phone, 
  Store, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      name: 'แอดมิน',
      email: 'admin@example.com',
      phone: '098-765-4321',
      company: 'บริษัท ตัวอย่าง จำกัด',
    },
  });
  
  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Handle profile update
  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log('Profile data:', data);
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตแล้ว",
    });
  };
  
  // Handle password update
  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log('Password data:', data);
    
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', {
        type: 'manual',
        message: 'รหัสผ่านใหม่ไม่ตรงกัน',
      });
      return;
    }
    
    toast({
      title: "เปลี่ยนรหัสผ่านสำเร็จ",
      description: "รหัสผ่านของคุณถูกเปลี่ยนแล้ว",
    });
    
    passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  // Handle logout
  const handleLogout = () => {
    // Here you would typically clear your auth state/tokens
    console.log('Logging out...');
    setIsLogoutDialogOpen(false);
    
    toast({
      title: "ออกจากระบบสำเร็จ",
      description: "คุณได้ออกจากระบบแล้ว",
    });
    
    // Redirect to login page
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 animate-fade">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <User className="mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold">ตั้งค่าบัญชี</h1>
          </div>
          <Button 
            variant="outline" 
            className="text-red-500 hover:text-red-700" 
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile" className="text-base">
              <User className="mr-2 h-4 w-4" /> ข้อมูลส่วนตัว
            </TabsTrigger>
            <TabsTrigger value="security" className="text-base">
              <LockKeyhole className="mr-2 h-4 w-4" /> รหัสผ่านและความปลอดภัย
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลส่วนตัว</CardTitle>
                <CardDescription>
                  จัดการข้อมูลส่วนตัวและการติดต่อของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อ</FormLabel>
                          <FormControl>
                            <Input {...field} icon={<User className="h-4 w-4" />} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>อีเมล</FormLabel>
                          <FormControl>
                            <Input {...field} icon={<Mail className="h-4 w-4" />} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>เบอร์โทรศัพท์</FormLabel>
                          <FormControl>
                            <Input {...field} icon={<Phone className="h-4 w-4" />} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>บริษัท / ร้านค้า</FormLabel>
                          <FormControl>
                            <Input {...field} icon={<Store className="h-4 w-4" />} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" /> บันทึกข้อมูล
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>ความปลอดภัย</CardTitle>
                <CardDescription>
                  จัดการรหัสผ่านและการตั้งค่าความปลอดภัยของบัญชี
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รหัสผ่านปัจจุบัน</FormLabel>
                          <FormControl>
                            <Input 
                              type={showCurrentPassword ? "text" : "password"} 
                              {...field} 
                              icon={
                                showCurrentPassword ? 
                                  <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowCurrentPassword(!showCurrentPassword)} /> : 
                                  <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                              }
                              onIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รหัสผ่านใหม่</FormLabel>
                          <FormControl>
                            <Input 
                              type={showNewPassword ? "text" : "password"} 
                              {...field} 
                              icon={
                                showNewPassword ? 
                                  <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)} /> : 
                                  <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)} />
                              }
                              onIconClick={() => setShowNewPassword(!showNewPassword)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ยืนยันรหัสผ่านใหม่</FormLabel>
                          <FormControl>
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              {...field} 
                              icon={
                                showConfirmPassword ? 
                                  <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : 
                                  <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                              }
                              onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <ShieldAlert className="mr-2 h-4 w-4" /> เปลี่ยนรหัสผ่าน
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        title="ยืนยันการออกจากระบบ"
        description="คุณต้องการออกจากระบบใช่หรือไม่?"
        onConfirm={handleLogout}
        confirmText="ออกจากระบบ"
        cancelText="ยกเลิก"
        variant="danger"
      />
    </Layout>
  );
};

export default AccountSettings;
