"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchOrders } from "@/app/store/slices/orderSlice";
import { fetchProducts } from "@/app/store/slices/productSlice";
import {
  FaChartLine,
  FaBoxOpen,
  FaUndo,
  FaTruckLoading,
  FaSpinner,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnalyticsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading: ordersLoading } = useSelector(
    (state: RootState) => state.order,
  );
  const { products, loading: productsLoading } = useSelector(
    (state: RootState) => state.product,
  );
  console.log("products", products);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Safely extract arrays
  const ordersList = Array.isArray(orders)
    ? orders
    : Array.isArray(orders?.data)
      ? orders.data
      : [];
  console.log("ordersList", ordersList);
  const productsList = Array.isArray(products)
    ? products
    : Array.isArray(products?.products)
      ? products.products
      : [];
  console.log("productsList", productsList);

  const analytics = useMemo(() => {
    let totalRevenue = 0;
    let totalExpense = 0;
    let totalOrdersCount = ordersList.length;
    let totalReturns = 0;
    let totalRto = 0;

    const productMap: Record<string, any> = {};
    console.log("productMap", productMap);

    // Initialize products
    productsList.forEach((product: any) => {
      const pId = product._id?.toString();
      if (!pId) return;

      // Find the lowest cost price across variants (or just use the first variant)
      const defaultVariant = product.variants?.[0] || {};
      const costPrice = defaultVariant.costPrice || 0;

      productMap[pId] = {
        id: pId,
        name: product.name,
        sku: product.sku,
        costPrice: costPrice,
        unitsSold: 0,
        revenue: 0,
        expense: 0,
        profit: 0,
        ordersCount: 0,
        returns: 0,
        rto: 0,
      };
    });

    // Process orders
    ordersList.forEach((order: any) => {
      const pId = order.product?._id?.toString() || order.product?.toString();
      const status = order.orderStatus?.toLowerCase() || "placed";
      const quantity = order.quantity || 1;

      const isReturn = status === "returned";
      const isRto = status === "rto";
      const isCancelled = status === "cancelled";

      if (isReturn) totalReturns++;
      if (isRto) totalRto++;

      if (pId && productMap[pId]) {
        productMap[pId].ordersCount++;
        if (isReturn) productMap[pId].returns++;
        if (isRto) productMap[pId].rto++;

        // Only count revenue/expense for non-cancelled, non-returned, non-rto orders
        if (!isCancelled && !isReturn && !isRto) {
          const revenue = order.totalAmount || 0;
          const expense = productMap[pId].costPrice * quantity;

          productMap[pId].unitsSold += quantity;
          productMap[pId].revenue += revenue;
          productMap[pId].expense += expense;
          productMap[pId].profit += revenue - expense;

          totalRevenue += revenue;
          totalExpense += expense;
        }
      }
    });

    const totalProfit = totalRevenue - totalExpense;
    const globalReturnRate =
      totalOrdersCount > 0
        ? ((totalReturns / totalOrdersCount) * 100).toFixed(2)
        : "0.00";
    const globalRtoRate =
      totalOrdersCount > 0
        ? ((totalRto / totalOrdersCount) * 100).toFixed(2)
        : "0.00";

    const productAnalytics = Object.values(productMap).map((p: any) => {
      return {
        ...p,
        returnRate:
          p.ordersCount > 0
            ? ((p.returns / p.ordersCount) * 100).toFixed(2)
            : "0.00",
        rtoRate:
          p.ordersCount > 0
            ? ((p.rto / p.ordersCount) * 100).toFixed(2)
            : "0.00",
      };
    });

    // Sort by profit descending
    productAnalytics.sort((a: any, b: any) => b.profit - a.profit);

    return {
      totalRevenue,
      totalExpense,
      totalProfit,
      globalReturnRate,
      globalRtoRate,
      productAnalytics,
      topProductsChart: productAnalytics.slice(0, 10), // Top 10 for chart
    };
  }, [ordersList, productsList]);

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3ece7]">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-[#99775c]" />
          <p className="text-gray-500 font-medium">Crunching Numbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-700">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Financial & Product Analytics
        </h1>
      </div>

      {/* Global Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5 mb-8">
        <div className="rounded-xl bg-white p-6 shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Total Revenue
          </h3>
          <p className="mt-2 text-2xl font-black text-gray-800">
            ₹{analytics.totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow border-l-4 border-red-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Total Expense (Cost)
          </h3>
          <p className="mt-2 text-2xl font-black text-red-600">
            ₹{analytics.totalExpense.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow border-l-4 border-green-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Net Profit
          </h3>
          <p className="mt-2 text-2xl font-black text-green-600">
            ₹{analytics.totalProfit.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow border-l-4 border-orange-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Global Return Rate
          </h3>
          <p className="mt-2 text-2xl font-black text-orange-600">
            {analytics.globalReturnRate}%
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Global RTO Rate
          </h3>
          <p className="mt-2 text-2xl font-black text-purple-600">
            {analytics.globalRtoRate}%
          </p>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="mb-8 h-[400px] rounded-xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-semibold">
          Top 10 Products by Profit
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.topProductsChart}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tickFormatter={(val) => `₹${val / 1000}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) =>
                  `₹${value.toLocaleString("en-IN")}`
                }
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Cost/Expense"
                fill="#ff7300"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="profit"
                name="Profit"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="rounded-xl bg-white p-6 shadow overflow-x-auto">
        <h2 className="mb-6 text-xl font-semibold">
          Product-Wise Detailed Analytics
        </h2>
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">Product Name</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4 text-right">Units Sold</th>
              <th className="py-3 px-4 text-right">Revenue</th>
              <th className="py-3 px-4 text-right text-red-500">Expense</th>
              <th className="py-3 px-4 text-right text-green-600">Profit</th>
              <th className="py-3 px-4 text-center text-orange-500">
                Return %
              </th>
              <th className="py-3 px-4 text-center text-purple-600 rounded-tr-lg">
                RTO %
              </th>
            </tr>
          </thead>
          <tbody>
            {analytics.productAnalytics.map((p: any) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td
                  className="py-3 px-4 font-medium text-gray-900 max-w-[200px] truncate"
                  title={p.name}
                >
                  {p.name}
                </td>
                <td className="py-3 px-4 font-mono text-gray-500">{p.sku}</td>
                <td className="py-3 px-4 text-right font-bold">
                  {p.unitsSold}
                </td>
                <td className="py-3 px-4 text-right">
                  ₹{p.revenue.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4 text-right text-red-500">
                  ₹{p.expense.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4 text-right text-green-600 font-bold">
                  ₹{p.profit.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${Number(p.returnRate) > 10 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {p.returnRate}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${Number(p.rtoRate) > 10 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {p.rtoRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
