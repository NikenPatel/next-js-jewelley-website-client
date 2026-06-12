"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchProducts } from "@/app/store/slices/productSlice";
import { Product } from "@/app/admin/types/product";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
  FaEdit,
} from "react-icons/fa";

type TabType = "all" | "active" | "low" | "out";

export default function InventoryManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product,
  );

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productList: Product[] = Array.isArray(products)
    ? products
    : (products as any)?.products || [];

  // Data processing: Calculate total stock per product
  const inventoryData = useMemo(() => {
    return productList.map((product) => {
      const totalStock =
        (product as any).variants?.reduce(
          (sum: number, variant: any) => sum + (variant.stock || 0),
          0,
        ) || 0;

      let status: TabType = "out";
      if (totalStock > 5) status = "active";
      else if (totalStock > 0 && totalStock <= 5) status = "low";

      return {
        ...product,
        totalStock,
        inventoryStatus: status,
      };
    });
  }, [productList]);

  // Tab Filtering and Search
  const filteredInventory = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((item as any).sku?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === "all" || item.inventoryStatus === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [inventoryData, activeTab, searchTerm]);
  //   console.log("filteredInventory", (filteredInventory[0] as any).variants[0].images[0]);

  // Summary counts
  const counts = {
    all: inventoryData.length,
    active: inventoryData.filter((i) => i.inventoryStatus === "active").length,
    low: inventoryData.filter((i) => i.inventoryStatus === "low").length,
    out: inventoryData.filter((i) => i.inventoryStatus === "out").length,
  };

  const getStatusBadge = (status: TabType) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
            <FaCheckCircle /> In Stock
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-200">
            <FaExclamationTriangle /> Low Stock
          </span>
        );
      case "out":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
            <FaTimesCircle /> Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 lg:p-8 font-sans text-gray-800">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#2d2d2d] flex items-center gap-3">
              <FaBoxOpen className="text-[#D4AF37]" /> Inventory Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Track and manage product stock levels across all variations.
            </p>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              id: "all",
              label: "Total Products",
              count: counts.all,
              color: "text-[#2d2d2d]",
              icon: <FaBoxOpen />,
            },
            {
              id: "active",
              label: "In Stock",
              count: counts.active,
              color: "text-green-600",
              icon: <FaCheckCircle />,
            },
            {
              id: "low",
              label: "Low Stock (≤5)",
              count: counts.low,
              color: "text-orange-500",
              icon: <FaExclamationTriangle />,
            },
            {
              id: "out",
              label: "Out of Stock",
              count: counts.out,
              color: "text-red-500",
              icon: <FaTimesCircle />,
            },
          ].map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-xl ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-[#2d2d2d]">
                  {stat.count}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls: Tabs & Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex overflow-x-auto pb-1 md:pb-0 gap-2">
            {[
              { id: "all", label: `All (${counts.all})` },
              { id: "active", label: `In Stock (${counts.active})` },
              { id: "low", label: `Low Stock (${counts.low})` },
              { id: "out", label: `Out of Stock (${counts.out})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center text-center p-6">
              <FaTimesCircle className="text-4xl text-red-300 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center p-6">
              <FaBoxOpen className="text-5xl text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                No products found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">
                      Product
                    </th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">
                      Category
                    </th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">
                      Variants
                    </th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">
                      Total Stock
                    </th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">
                      Status
                    </th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                            {item &&
                            (item as any).variants &&
                            (item as any).variants[0].images[0] ? (
                              <Image
                                src={(item as any).variants[0].images[0]}
                                alt={item.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-400">
                                <FaBoxOpen />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              SKU: {(item as any).sku || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                          {(item as any).category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-600">
                          {(item as any).variants?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold text-lg ${item.totalStock === 0 ? "text-red-500" : item.totalStock <= 5 ? "text-orange-500" : "text-[#2d2d2d]"}`}
                        >
                          {item.totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.inventoryStatus)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/dashboard/products/editproduct/${item._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-[#D4AF37]"
                        >
                          <FaEdit /> Edit Stock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
