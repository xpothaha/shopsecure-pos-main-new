
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SettingsModel } from '@/models';
import { Settings as SettingsIcon, UserPlus, Shield, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Settings: React.FC = () => {
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const isEnabled = await SettingsModel.isRegistrationEnabled();
        setRegistrationEnabled(isEnabled);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: 'ไม่สามารถโหลดการตั้งค่าได้',
          description: 'กรุณาลองใหม่อีกครั้ง',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await SettingsModel.toggleRegistration(registrationEnabled);
      toast({
        title: 'บันทึกการตั้งค่าสำเร็จ',
        description: 'การตั้งค่าของคุณถูกบันทึกเรียบร้อยแล้ว',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'ไม่สามารถบันทึกการตั้งค่าได้',
        description: 'กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">กำลังโหลด...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 animate-fade">
        <div className="flex items-center mb-6">
          <SettingsIcon className="mr-2 h-5 w-5" />
          <h1 className="text-2xl font-bold">ตั้งค่าระบบ</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              ตั้งค่าการสมัครสมาชิก
            </CardTitle>
            <CardDescription>
              ตั้งค่าระบบการสมัครสมาชิกสำหรับผู้ใช้ใหม่
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registration-toggle">เปิดใช้งานการสมัครสมาชิก</Label>
                  <p className="text-sm text-muted-foreground">
                    {registrationEnabled
                      ? 'ผู้ใช้ใหม่สามารถสมัครเข้าใช้งานระบบได้'
                      : 'ปิดการสมัครสมาชิก ผู้ใช้ใหม่ไม่สามารถสมัครได้'}
                  </p>
                </div>
                <Switch
                  id="registration-toggle"
                  checked={registrationEnabled}
                  onCheckedChange={setRegistrationEnabled}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              การตั้งค่าความปลอดภัย
            </CardTitle>
            <CardDescription>
              ตั้งค่าความปลอดภัยสำหรับระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              การตั้งค่าความปลอดภัยเพิ่มเติมจะมาในอัปเดตถัดไป
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
