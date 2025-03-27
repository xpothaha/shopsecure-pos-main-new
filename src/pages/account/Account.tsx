
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

const Account: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        ...user,
        name,
        email
      });
      setIsUpdating(false);
    }, 800);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    
    if (currentPassword !== 'admin123') {
      toast.error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      return;
    }
    
    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }, 800);
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl animate-fade">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium">
                    Role
                  </label>
                  <Input
                    id="role"
                    value={user?.role || ''}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-sm font-medium">
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
