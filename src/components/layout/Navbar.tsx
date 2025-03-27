
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Receipt, 
  Shield, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium transition-colors",
        "hover:bg-primary hover:text-white rounded-lg",
        active
          ? "bg-primary/90 text-white"
          : "text-gray-200 hover:text-white"
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/products", icon: <Package size={18} />, label: "สินค้า" },
    { to: "/categories", icon: <FolderTree size={18} />, label: "หมวดหมู่" },
    { to: "/purchases", icon: <ShoppingCart size={18} />, label: "บิลซื้อ" },
    { to: "/sales", icon: <Receipt size={18} />, label: "บิลขาย" },
    { to: "/warranties", icon: <Shield size={18} />, label: "การรับประกัน" },
  ];

  const closeMenu = () => setIsOpen(false);
  
  // Mobile Menu
  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-white">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] bg-gray-900 text-white p-0">
        <div className="flex flex-col h-full py-6">
          <div className="px-6 mb-6 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold" onClick={closeMenu}>
              POS System
            </Link>
            <button onClick={closeMenu} className="text-gray-400">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col px-3 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
                onClick={closeMenu}
              />
            ))}
          </div>
          
          <div className="px-3 mt-4 space-y-2">
            <Link 
              to="/account" 
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-gray-700 rounded-lg",
                location.pathname === "/account" 
                  ? "bg-gray-700" 
                  : "text-gray-200 hover:text-white"
              )}
              onClick={closeMenu}
            >
              <User size={18} className="mr-2" />
              My Account
            </Link>
            
            <button 
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors hover:bg-gray-700 rounded-lg"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  // Desktop Navigation
  const DesktopNavigation = () => (
    <>
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold">
          POS System
        </Link>
      </div>
      
      <div className="flex space-x-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <Link 
          to="/account" 
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium transition-colors",
            "hover:bg-gray-700 rounded-lg",
            location.pathname === "/account" 
              ? "bg-gray-700" 
              : "text-gray-200 hover:text-white"
          )}
        >
          <User size={18} className="mr-2" />
          My Account
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors hover:bg-gray-700 rounded-lg"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </>
  );
  
  return (
    <nav className="flex justify-between items-center bg-gray-900 py-4 px-4 md:px-6 text-white">
      {isMobile ? (
        <>
          <MobileMenu />
          <Link to="/" className="text-xl font-bold">
            POS System
          </Link>
          <div className="w-10"></div> {/* Empty div for flex spacing */}
        </>
      ) : (
        <DesktopNavigation />
      )}
    </nav>
  );
};

export default Navbar;
