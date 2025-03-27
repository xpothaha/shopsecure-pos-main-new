
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "sonner";
import { AuthState, User } from '@/types';
import { UserModel } from '@/models';

interface AuthContextType extends AuthState {
  login: (username: string, password: string, turnstileToken?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for existing auth in localStorage
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData) as User;
          setState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
          setState({ ...initialState, loading: false });
        }
      } else {
        setState({ ...initialState, loading: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string, turnstileToken?: string): Promise<boolean> => {
    setState({ ...state, loading: true, error: null });
    
    try {
      // Get user from database with CAPTCHA verification
      const user = await UserModel.findByCredentials(username, password, turnstileToken);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        
        setState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
        
        toast.success("เข้าสู่ระบบสำเร็จ");
        return true;
      } else {
        setState({
          ...state,
          loading: false,
          error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        });
        
        toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setState({
        ...state,
        loading: false,
        error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      });
      
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
    toast.success("ออกจากระบบสำเร็จ");
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      ...state,
      user
    });
    toast.success("อัปเดตข้อมูลสำเร็จ");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
