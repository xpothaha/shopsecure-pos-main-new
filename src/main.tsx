
// เพิ่ม polyfill สำหรับ process ในสภาพแวดล้อมของเบราว์เซอร์
if (typeof window !== 'undefined') {
  if (typeof window.process === 'undefined') {
    window.process = { env: {} } as any;
  }
  // เพิ่ม global เป็น window เพื่อให้ใช้งานได้กับไลบรารีบางตัว
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
