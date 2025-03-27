
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto animate-scale">
        <h1 className="text-3xl font-bold mb-6">แดชบอร์ด</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>ยินดีต้อนรับ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">สวัสดี, {user?.name || 'ผู้ใช้'}</p>
              <p>ยินดีต้อนรับเข้าสู่ระบบจัดการร้านค้า คุณสามารถจัดการข้อมูลสินค้า, บิลซื้อ-ขาย และการรับประกันได้จากเมนูด้านบน</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>วิธีการใช้งาน</CardTitle>
            </CardHeader>
            <CardContent>
              <p>คลิกที่เมนูด้านบนเพื่อเข้าสู่ระบบต่างๆ</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>จัดการสินค้า</li>
                <li>จัดการหมวดหมู่</li>
                <li>จัดการบิลซื้อ</li>
                <li>จัดการบิลขาย</li>
                <li>ข้อมูลการรับประกัน</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>การสนับสนุน</CardTitle>
            </CardHeader>
            <CardContent>
              <p>หากพบปัญหาการใช้งาน หรือต้องการความช่วยเหลือ กรุณาติดต่อฝ่ายสนับสนุนได้ที่:</p>
              <p className="mt-2">
                อีเมล: support@example.com<br />
                โทร: 02-XXX-XXXX
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
