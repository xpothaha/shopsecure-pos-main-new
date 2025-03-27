declare module 'react-router-dom' {
  import * as React from 'react';

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
  }

  export const BrowserRouter: React.ComponentType<{
    children?: React.ReactNode;
    basename?: string;
  }>;
  
  export const Routes: React.ComponentType<{
    children?: React.ReactNode;
  }>;
  
  export const Route: React.ComponentType<RouteProps>;
  
  export const Link: React.ComponentType<{
    to: string;
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }>;
  
  export const NavLink: React.ComponentType<{
    to: string;
    children?: React.ReactNode;
    className?: string | ((props: { isActive: boolean }) => string);
    [key: string]: any;
  }>;
  
  export const Navigate: React.ComponentType<{
    to: string;
    replace?: boolean;
  }>;
  
  export const Outlet: React.ComponentType;
  
  export function useNavigate(): (to: string, options?: { replace?: boolean }) => void;
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
}
