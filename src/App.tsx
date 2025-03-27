import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/products/Products';
import Customers from './pages/Customers';
import Sales from './pages/sales/Sales';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import WarrantyCheck from './pages/check-warranty/WarrantyCheck';
import Warranties from './pages/warranties/Warranties';
import AccountSettings from './pages/account/AccountSettings';
import Account from './pages/account/Account';
import Categories from './pages/categories/Categories';
import Purchases from './pages/purchases/Purchases';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-warranty" element={<WarrantyCheck />} />
          <Route path="/warranties" element={<Warranties />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/settings" element={<AccountSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
