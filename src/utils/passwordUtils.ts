
import * as crypto from 'crypto';

/**
 * เข้ารหัสรหัสผ่านโดยใช้ SHA-256 ร่วมกับ salt
 * @param password รหัสผ่านที่ต้องการเข้ารหัส
 * @param salt salt ที่ใช้ในการเข้ารหัส (ถ้าไม่ระบุจะสร้างใหม่)
 * @returns object ที่มี hash และ salt
 */
export const hashPassword = (password: string, existingSalt?: string): { hash: string, salt: string } => {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  
  return { hash, salt };
};

/**
 * ตรวจสอบว่ารหัสผ่านตรงกับ hash ที่เก็บไว้หรือไม่
 * @param password รหัสผ่านที่ต้องการตรวจสอบ
 * @param storedHash hash ที่เก็บไว้ในฐานข้อมูล
 * @param salt salt ที่ใช้ในการเข้ารหัส
 * @returns true ถ้าตรงกัน, false ถ้าไม่ตรงกัน
 */
export const verifyPassword = (password: string, storedHash: string, salt: string): boolean => {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
};

/**
 * สร้าง hash สำหรับรหัสผ่านแบบง่ายๆ (ใช้ในตอนเปลี่ยนระบบ)
 * @param password รหัสผ่านที่ต้องการเข้ารหัส
 * @returns string ในรูปแบบ hash:salt
 */
export const createHashedPassword = (password: string): string => {
  const { hash, salt } = hashPassword(password);
  return `${hash}:${salt}`;
};
