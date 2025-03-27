
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Turnstile } from '@/components/ui/turnstile';
import { toast } from 'sonner';

// The Turnstile site key should ideally come from an environment variable
// For now, we'll use a placeholder - replace with your actual site key
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

const Login: React.FC = () => {
  const { isAuthenticated, loading, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }
    
    if (!turnstileToken) {
      toast.error('กรุณายืนยันว่าคุณไม่ใช่โปรแกรมอัตโนมัติ');
      return;
    }
    
    setIsSubmitting(true);
    await login(username, password, turnstileToken);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dot-pattern">
      <div className="w-full max-w-md animate-scale">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">เข้าสู่ระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  ชื่อผู้ใช้
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="กรอกชื่อผู้ใช้"
                  className="w-full border-gray-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  รหัสผ่าน
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full border-gray-300 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-center my-4">
                <Turnstile 
                  siteKey={TURNSTILE_SITE_KEY}
                  onVerify={setTurnstileToken}
                  className="mx-auto"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full py-6 bg-primary text-white hover:bg-primary/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    กำลังดำเนินการ...
                  </>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
