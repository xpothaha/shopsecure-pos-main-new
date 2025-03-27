
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Check, Copy, Server, Info } from 'lucide-react';
import { generateDatabaseSetupScripts } from '@/services/databaseService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';

const DatabaseSetup: React.FC = () => {
  const [showScript, setShowScript] = useState(false);
  
  const handleCopyScript = () => {
    const script = generateDatabaseSetupScripts();
    navigator.clipboard.writeText(script);
    toast.success('คัดลอกสคริปต์เรียบร้อยแล้ว');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Database className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 text-3xl font-extrabold">ตั้งค่าฐานข้อมูล PostgreSQL</h1>
          <p className="mt-2 text-gray-600">
            คำแนะนำในการตั้งค่าฐานข้อมูลสำหรับระบบ Shop Secure
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>ขั้นตอนการตั้งค่าฐานข้อมูล</CardTitle>
            <CardDescription>
              ทำตามขั้นตอนด้านล่างเพื่อตั้งค่าฐานข้อมูล PostgreSQL สำหรับแอปพลิเคชัน
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>ข้อควรทราบ</AlertTitle>
              <AlertDescription>
                คุณจำเป็นต้องมี PostgreSQL ติดตั้งบนเซิร์ฟเวอร์หรือเครื่องคอมพิวเตอร์ของคุณก่อนดำเนินการต่อ
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium flex items-center">
                  <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                  สร้างฐานข้อมูลใหม่
                </h3>
                <p className="text-gray-600 mt-2">เปิด PostgreSQL command line และรันคำสั่งต่อไปนี้:</p>
                <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm overflow-x-auto">
                  <pre>CREATE DATABASE shopsecure;</pre>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium flex items-center">
                  <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                  สร้างตารางในฐานข้อมูล
                </h3>
                <p className="text-gray-600 mt-2">เชื่อมต่อกับฐานข้อมูลที่สร้างไว้:</p>
                <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm overflow-x-auto">
                  <pre>\c shopsecure</pre>
                </div>
                <p className="text-gray-600 mt-2">จากนั้นรันสคริปต์ SQL ด้านล่างเพื่อสร้างตารางทั้งหมด:</p>
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowScript(!showScript)}
                  >
                    {showScript ? 'ซ่อนสคริปต์' : 'แสดงสคริปต์'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-2"
                    onClick={handleCopyScript}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    คัดลอกสคริปต์
                  </Button>
                </div>
                
                {showScript && (
                  <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm overflow-x-auto h-64 overflow-y-auto">
                    <pre>{generateDatabaseSetupScripts()}</pre>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium flex items-center">
                  <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                  ตั้งค่าการเชื่อมต่อในแอปพลิเคชัน
                </h3>
                <p className="text-gray-600 mt-2">ตั้งค่าตัวแปรสภาพแวดล้อมต่อไปนี้ในเซิร์ฟเวอร์ของคุณ:</p>
                <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm overflow-x-auto">
                  <pre>
{`VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=shopsecure
VITE_DB_USER=postgres
VITE_DB_PASSWORD=your_password`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-sm text-gray-500">
              <Server className="h-4 w-4 inline mr-1" />
              หากมีปัญหาในการตั้งค่า โปรดติดต่อทีมสนับสนุน
            </div>
            <Button 
              className="flex items-center" 
              onClick={() => window.location.href = '/'}
            >
              <Check className="h-4 w-4 mr-1" />
              กลับสู่หน้าหลัก
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Powered by LNWCPU.COM</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetup;
