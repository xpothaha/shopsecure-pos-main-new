// Global type declarations for the project

// React and React DOM
declare module 'react' {
  export * from 'react/index';
}

declare module 'react-dom' {
  export * from 'react-dom/index';
}

// React Router
declare module 'react-router-dom' {
  export * from 'react-router-dom/index';
}

// Sonner (Toast library)
declare module 'sonner' {
  export function toast(message: string, options?: any): void;
  export function toast(options: { title: string; description?: string; [key: string]: any }): void;
  
  export const Toaster: React.FC<{
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    toastOptions?: any;
    theme?: 'light' | 'dark' | 'system';
    richColors?: boolean;
    expand?: boolean;
    visibleToasts?: number;
    closeButton?: boolean;
    [key: string]: any;
  }>;
}

// Node.js process
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    CF_PAGES?: string;
    WORKER_URL?: string;
    POSTGRES_USER?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_HOST?: string;
    POSTGRES_PORT?: string;
    POSTGRES_DB?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    PORT?: string;
    [key: string]: string | undefined;
  }
}

// Extend Window interface
interface Window {
  ENV?: {
    NODE_ENV: string;
    [key: string]: string;
  };
}
