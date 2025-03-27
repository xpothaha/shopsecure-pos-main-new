
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import WarrantyCaptcha from './WarrantyCaptcha';

interface WarrantySearchFormProps {
  productCode: string;
  setProductCode: (code: string) => void;
  handleSearch: () => void;
  loading: boolean;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
}

const WarrantySearchForm: React.FC<WarrantySearchFormProps> = ({
  productCode,
  setProductCode,
  handleSearch,
  loading,
  captchaToken,
  setCaptchaToken
}) => {
  return (
    <>
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="รหัสสินค้า..."
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            className="w-full"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && captchaToken) handleSearch();
            }}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading || !captchaToken}
          className="flex-shrink-0"
        >
          {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
          {!loading && <Search className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      <WarrantyCaptcha 
        onVerify={(token) => setCaptchaToken(token)} 
        onExpire={() => setCaptchaToken(null)}
      />
    </>
  );
};

export default WarrantySearchForm;
