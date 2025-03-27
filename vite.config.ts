
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API requests to the worker in development
      '/api': {
        target: process.env.WORKER_URL || 'http://localhost:8787',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // เพิ่ม polyfill สำหรับ process.env
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
      WORKER_URL: JSON.stringify(process.env.WORKER_URL || 'http://localhost:8787'),
      CF_PAGES: JSON.stringify(process.env.CF_PAGES || false),
    },
    // จำกัดการใช้งาน Node.js modules ในเบราว์เซอร์
    global: 'window'
  }
}));
