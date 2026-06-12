"use client";

import { FaDollarSign, FaShoppingCart, FaUsers, FaGem, FaSpinner } from "react-icons/fa";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchDashboardStats } from "@/app/store/slices/analyticsSlice";
import { fetchOrders } from "@/app/store/slices/orderSlice";
import { fetchProducts } from "@/app/store/slices/productSlice";
import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  
  const { stats, loading: statsLoading } = useSelector((state: RootState) => state.analytics);
  const { orders, loading: ordersLoading } = useSelector((state: RootState) => state.order);
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const dashboardStats: Stat[] = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString("en-IN") || 0}`,
      icon: <FaDollarSign />,
    },
    {
      title: "Orders",
      value: `${stats?.totalOrders || 0}`,
      icon: <FaShoppingCart />,
    },
    {
      title: "Customers",
      value: `${stats?.totalCustomers || 0}`,
      icon: <FaUsers />,
    },
    {
      title: "Products",
      value: `${stats?.totalProducts || 0}`,
      icon: <FaGem />,
    },
  ];

  // Extract recent orders (safely handling nested .data structure if it exists)
  const ordersList = Array.isArray(orders) 
    ? orders 
    : Array.isArray((orders as any)?.data) 
      ? (orders as any).data 
      : [];
  const recentOrders = [...ordersList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Generate chart data locally from orders
  const chartData = useMemo(() => {
    if (!ordersList || ordersList.length === 0) return [];
    
    const monthlyData: Record<string, { month: string; sales: number; orders: number }> = {};
    
    // Sort orders oldest to newest first
    const sortedOrders = [...ordersList].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    sortedOrders.forEach((order: any) => {
      if(order.orderStatus === "cancelled" || order.orderStatus === "returned" || order.orderStatus === "rto") return;
      
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, sales: 0, orders: 0 };
      }
      monthlyData[monthYear].sales += order.totalAmount || 0;
      monthlyData[monthYear].orders += 1;
    });

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }, [ordersList]);

  // Extract top products
  const productsList = Array.isArray(products)
    ? products
    : Array.isArray(products?.data)
      ? products.data
      : [];
  const topProductsList = [...productsList].slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-600";
      case "processing": return "bg-yellow-100 text-yellow-600";
      case "shipped": return "bg-blue-100 text-blue-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (statsLoading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-[#99775c]" />
          <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">{item.title}</h3>

                  <h2 className="mt-2 text-3xl font-bold text-gray-600">
                    {item.value}
                  </h2>
                </div>

                <div className="text-3xl text-yellow-500">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 text-gray-600">
          <div className="h-[400px] rounded-xl bg-white p-6 shadow flex flex-col">
            <h2 className="mb-6 text-xl font-semibold">Sales Overview</h2>

            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#99775c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#99775c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(value) => `₹${value/1000}k`} tick={{fontSize: 12}} />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Area type="monotone" dataKey="sales" stroke="#99775c" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-[400px] rounded-xl bg-white p-6 shadow flex flex-col">
            <h2 className="mb-6 text-xl font-semibold">Orders Overview</h2>

            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#1f2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow text-gray-600 overflow-x-auto">
          <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
          
          {ordersLoading ? (
             <div className="py-8 text-center"><FaSpinner className="animate-spin inline mr-2"/> Loading orders...</div>
          ) : recentOrders.length === 0 ? (
             <div className="py-8 text-center text-gray-400">No orders found.</div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Order ID</th>
                  <th className="py-3 text-left">Customer</th>
                  <th className="py-3 text-left">Amount</th>
                  <th className="py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-mono text-sm">#{order._id.substring(0, 8)}</td>
                    <td>{order.user?.name || order.shippingAddress?.fullName || "Unknown"}</td>
                    <td className="font-medium text-gray-900">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus || "placed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Products */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow text-gray-600">
          <h2 className="mb-4 text-xl font-semibold">Recent Products</h2>

          {productsLoading ? (
             <div className="py-8 text-center"><FaSpinner className="animate-spin inline mr-2"/> Loading products...</div>
          ) : topProductsList.length === 0 ? (
             <div className="py-8 text-center text-gray-400">No products found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topProductsList.map((product: any) => (
                <div key={product._id} className="rounded-lg border p-4 hover:shadow-md transition">
                  <div className="mb-3 h-40 rounded-lg bg-gray-100 relative overflow-hidden">
                    {product.variants?.[0]?.images?.[0] ? (
                      <Image 
                        src={product.variants[0].images[0]} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>

                  <h3 className="font-semibold truncate">{product.name}</h3>

                  <p className="font-bold text-[#99775c]">
                    ₹{product.variants?.[0]?.price?.toLocaleString("en-IN") || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
