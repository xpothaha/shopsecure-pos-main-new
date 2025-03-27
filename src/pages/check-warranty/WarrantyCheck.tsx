
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Warranty } from '@/types';
import { WarrantyModel } from '@/models';
import WarrantySearchForm from '@/components/check-warranty/WarrantySearchForm';
import WarrantyDetails from '@/components/check-warranty/WarrantyDetails';
import WarrantyNotFound from '@/components/check-warranty/WarrantyNotFound';

const WarrantyCheck: React.FC = () => {
  const [productCode, setProductCode] = useState('');
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const calculateFromStartDays = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const handleSearch = async () => {
    if (!productCode.trim() || !captchaToken) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const foundWarranty = await WarrantyModel.findByProductCode(productCode);
      
      setWarranty(foundWarranty);
      setLoading(false);
      setCaptchaToken(null);
    } catch (error) {
      console.error('Error searching warranty:', error);
      setWarranty(null);
      setLoading(false);
      setCaptchaToken(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold">ตรวจสอบการรับประกัน</h2>
          <p className="mt-2 text-gray-600">
            กรอกรหัสสินค้าเพื่อตรวจสอบข้อมูลการรับประกัน
          </p>
        </div>
        
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>ตรวจสอบการรับประกัน</CardTitle>
            <CardDescription>
              กรุณากรอกรหัสสินค้าที่ต้องการตรวจสอบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WarrantySearchForm
              productCode={productCode}
              setProductCode={setProductCode}
              handleSearch={handleSearch}
              loading={loading}
              captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken}
            />
            
            {searched && (
              <div className="mt-6">
                {warranty ? (
                  <WarrantyDetails 
                    warranty={warranty}
                    calculateFromStartDays={calculateFromStartDays}
                  />
                ) : (
                  <WarrantyNotFound productCode={productCode} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Powered by LNWCPU.COM</p>
        </div>
      </div>
    </div>
  );
};

export default WarrantyCheck;
