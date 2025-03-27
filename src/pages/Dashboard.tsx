
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSalesSummary, getLowStockProducts } from '@/utils/mockData';
import { SalesSummary, LowStockProduct } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { AreaChart, Area } from 'recharts';
import { Edit } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [salesSummary, setSalesSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalProducts: 0,
    lowStockCount: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock sales data for chart
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 8000 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 3500 },
    { name: 'Jul', sales: 7000 },
    { name: 'Aug', sales: 9000 },
    { name: 'Sep', sales: 11000 },
    { name: 'Oct', sales: 10000 },
    { name: 'Nov', sales: 8500 },
    { name: 'Dec', sales: 12000 },
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setSalesSummary(getSalesSummary());
      setLowStockProducts(getLowStockProducts());
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto animate-fade">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Sales Card */}
          <Card className="glass-effect card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-bold text-primary">฿{formatCurrency(salesSummary.totalSales)}</h2>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={salesData}>
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#4f46e5" 
                      fill="rgba(79, 70, 229, 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Products Card */}
          <Card className="glass-effect card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-bold text-green-600">{salesSummary.totalProducts}</h2>
              <p className="text-gray-500 mt-2">Products in inventory</p>
              <div className="mt-2">
                <Link to="/products">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Low Stock Alert Card */}
          <Card className="glass-effect card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-600">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-bold text-red-500">{salesSummary.lowStockCount}</h2>
              <p className="text-gray-500 mt-2">Products with low inventory</p>
              <div className="mt-2">
                <Link to="/products">
                  <Button variant="outline" size="sm" className="mt-2">
                    Check Inventory
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sales Chart */}
        <Card className="mb-8 glass-effect">
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Sales performance over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`฿${value}`, 'Sales']} />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Low Stock Products Table */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products that need reordering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-sm font-medium text-gray-500 tracking-wider">PRODUCT CODE</th>
                    <th className="py-3 text-left text-sm font-medium text-gray-500 tracking-wider">NAME</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500 tracking-wider">CURRENT STOCK</th>
                    <th className="py-3 text-center text-sm font-medium text-gray-500 tracking-wider">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-gray-900">{product.code}</td>
                      <td className="py-4 text-sm text-gray-900">{product.name}</td>
                      <td className="py-4 text-sm text-red-500 font-medium text-right">{product.stock}</td>
                      <td className="py-4 text-center">
                        <Link to={`/products/edit/${product.id}`}>
                          <Button size="sm" variant="ghost" className="text-blue-600">
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
