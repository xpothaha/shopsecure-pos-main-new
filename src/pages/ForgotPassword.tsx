
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Password reset logic would go here
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dot-pattern">
      <div className="w-full max-w-md animate-scale">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">ลืมรหัสผ่าน</CardTitle>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="กรอกอีเมลของคุณ"
                    className="w-full border-gray-300 focus:border-blue-500"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-6 bg-primary text-white hover:bg-primary/90 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'กำลังดำเนินการ...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-green-600">
                  ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมล {email} แล้ว
                </p>
                <p className="text-sm text-gray-600">
                  โปรดตรวจสอบกล่องข้อความอีเมลของคุณและทำตามคำแนะนำเพื่อรีเซ็ตรหัสผ่าน
                </p>
              </div>
            )}
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                <Link to="/login" className="text-primary hover:underline">
                  กลับไปยังหน้าเข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
