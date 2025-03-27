
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SettingsModel, UserModel } from '@/models';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if registration is enabled
    const checkRegistrationStatus = async () => {
      try {
        const isEnabled = await SettingsModel.isRegistrationEnabled();
        setRegistrationEnabled(isEnabled);
      } catch (error) {
        console.error('Failed to check registration status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationEnabled) {
      toast({
        title: "การลงทะเบียนถูกปิดใช้งาน",
        description: "ไม่สามารถลงทะเบียนได้ในขณะนี้",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านของคุณ",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = await UserModel.register({
        username,
        password,
        name,
        email
      });
      
      if (user) {
        toast({
          title: "ลงทะเบียนสำเร็จ",
          description: "กรุณาเข้าสู่ระบบด้วยบัญชีใหม่ของคุณ"
        });
        navigate('/login');
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลงทะเบียนได้ โปรดลองอีกครั้ง",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถลงทะเบียนได้ โปรดลองอีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dot-pattern">
        <div className="text-center">
          <h2 className="text-xl font-semibold">กำลังโหลด...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dot-pattern">
      <div className="w-full max-w-md animate-scale">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">ลงทะเบียน</CardTitle>
          </CardHeader>
          
          {!registrationEnabled ? (
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>ระบบปิดการลงทะเบียน</AlertTitle>
                <AlertDescription>
                  ขณะนี้ระบบปิดสมัครสมาชิก กรุณาติดต่อผู้ดูแลระบบหากต้องการสมัคร
                </AlertDescription>
              </Alert>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  มีบัญชีอยู่แล้ว?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </div>
            </CardContent>
          ) : (
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
                  <label htmlFor="name" className="text-sm font-medium">
                    ชื่อ-นามสกุล
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="กรอกชื่อ-นามสกุล"
                    className="w-full border-gray-300 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    อีเมล
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="กรอกอีเมล"
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
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    ยืนยันรหัสผ่าน
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    className="w-full border-gray-300 focus:border-blue-500"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-6 bg-primary text-white hover:bg-primary/90 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'กำลังดำเนินการ...' : 'ลงทะเบียน'}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    มีบัญชีอยู่แล้ว?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      เข้าสู่ระบบ
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Register;
