"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/app/store/lib/axios";
import { FaSync, FaWallet, FaRegCreditCard, FaExclamationCircle } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

interface Order {
  _id: string;
  user?: { name: string; email: string };
  shippingAddress: { fullName: string };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"month" | "6months" | "year" | "all">("month");
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/orders");
      if (response.data?.success) {
        // Sort newest first
        const sortedOrders = response.data.orders.sort(
          (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders for payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (activeTab === "month") {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (activeTab === "6months") {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        return orderDate >= sixMonthsAgo;
      }
      if (activeTab === "year") {
        return orderDate.getFullYear() === now.getFullYear();
      }
      return true; // "all"
    });
  }, [orders, activeTab]);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingCollections = 0;
    let failedTransactions = 0;
    let successfulCount = 0;

    filteredOrders.forEach(order => {
      if (order.paymentStatus === "paid") {
        totalRevenue += order.totalAmount;
        successfulCount++;
      } else if (order.paymentStatus === "pending") {
        pendingCollections += order.totalAmount;
      } else if (order.paymentStatus === "failed") {
        failedTransactions += order.totalAmount;
      }
    });

    return { totalRevenue, pendingCollections, failedTransactions, successfulCount };
  }, [filteredOrders]);

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-600">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#323232]">Payments Dashboard</h1>
          <p className="text-sm text-gray-500">Systematic showcase of all transaction histories and revenue</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#99775c] px-4 py-2 text-white hover:bg-[#836248] transition disabled:opacity-50"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow flex flex-wrap gap-2">
        <button onClick={() => setActiveTab("month")} className={`px-4 py-2 rounded font-medium text-sm transition ${activeTab === "month" ? "bg-[#99775c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>This Month</button>
        <button onClick={() => setActiveTab("6months")} className={`px-4 py-2 rounded font-medium text-sm transition ${activeTab === "6months" ? "bg-[#99775c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Last 6 Months</button>
        <button onClick={() => setActiveTab("year")} className={`px-4 py-2 rounded font-medium text-sm transition ${activeTab === "year" ? "bg-[#99775c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>This Year</button>
        <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded font-medium text-sm transition ${activeTab === "all" ? "bg-[#99775c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All Time</button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xl">
            <FiTrendingUp />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Collections</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{stats.pendingCollections.toLocaleString("en-IN")}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 text-xl">
            <FaWallet />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Failed Transactions</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{stats.failedTransactions.toLocaleString("en-IN")}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
            <FaExclamationCircle />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-[#99775c] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Successful Payments</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.successfulCount} Transactions</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-[#f3ece7] flex items-center justify-center text-[#99775c] text-xl">
            <FaRegCreditCard />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Transaction History ({filteredOrders.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#ddd0c8] text-[#323232]">
              <tr>
                <th className="p-3 text-left font-semibold">Transaction ID</th>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Customer</th>
                <th className="p-3 text-center font-semibold">Payment Method</th>
                <th className="p-3 text-right font-semibold">Amount</th>
                <th className="p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <FaSync className="animate-spin text-[#99775c] text-xl" />
                      <span>Loading payment data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                   const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                     day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                   });
                   return (
                     <tr key={order._id} className="border-t hover:bg-[#f3ece7] transition">
                       <td className="p-3 font-medium text-gray-800">
                         #{order._id.substring(order._id.length - 8).toUpperCase()}
                       </td>
                       <td className="p-3 text-gray-500 text-xs">
                         {formattedDate}
                       </td>
                       <td className="p-3">
                         <div className="font-medium text-gray-800">{order.shippingAddress?.fullName || order.user?.name || "Guest"}</div>
                         <div className="text-xs text-gray-400">{order.user?.email || "N/A"}</div>
                       </td>
                       <td className="p-3 text-center font-semibold text-gray-700">
                         {order.paymentMethod}
                       </td>
                       <td className="p-3 text-right font-bold text-gray-800">
                         ₹{order.totalAmount.toLocaleString("en-IN")}
                       </td>
                       <td className="p-3 text-center">
                         <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                           {order.paymentStatus}
                         </span>
                       </td>
                     </tr>
                   )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No transactions found for the selected timeframe.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
