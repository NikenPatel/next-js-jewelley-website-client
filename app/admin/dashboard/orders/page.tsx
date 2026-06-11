"use client";

import { Fragment, useEffect, useState } from "react";
import api from "@/app/store/lib/axios";
import { FaSearch, FaSync } from "react-icons/fa";

interface Order {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  product?: {
    _id: string;
    name: string;
    sku: string;
  };
  variantId: string;
  quantity: number;
  selectedRingSize?: number | null;
  engravingText?: string;
  shippingAddress: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  productSnapshot?: {
    name: string;
    sku: string;
    image?: string;
    metal?: string;
    gemstone?: string;
    price: number;
    discountPrice?: number;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "placed"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "return_requested"
    | "returned"
    | "return_rejected"
    | "rto";
  returnReason?: string;
  rtoReason?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/orders");
      if (response.data?.success) {
        setOrders(response.data.orders);
      }
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Failed to fetch orders",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStatusUpdate = async (
    id: string,
    updates: {
      orderStatus?: string;
      paymentStatus?: string;
      rtoReason?: string;
    },
  ) => {
    setUpdatingId(id);
    try {
      const response = await api.put(`/api/admin/orders/${id}/status`, updates);
      if (response.data?.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, ...response.data.order } : order,
          ),
        );
        showNotification("Order status updated successfully", "success");
      }
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Failed to update status",
        "error",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Counters for tabs
  const getCountByStatus = (status: string) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.orderStatus === status).length;
  };

  // Filter orders based on search & active tab
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.orderStatus === activeTab;

    const searchString =
      `${order._id} ${order.shippingAddress?.fullName || ""} ${order.user?.name || ""} ${order.user?.email || ""} ${order.productSnapshot?.name || ""}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-indigo-100 text-indigo-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "return_requested":
        return "bg-orange-100 text-orange-800";
      case "returned":
        return "bg-teal-100 text-teal-800";
      case "return_rejected":
        return "bg-slate-200 text-slate-800";
      case "rto":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const tabs = [
    "all",
    "placed",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "return_requested",
    "returned",
    "rto",
  ];

  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-600">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed right-5 top-5 z-50 rounded-lg px-4 py-3 text-white shadow-lg transition-all ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#323232]">
            Orders Management
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage customer purchases and shipments
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#99775c] px-4 py-2 text-white hover:bg-[#836248] transition disabled:opacity-50"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters & Tabs */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        {/* Search */}
        <div className="relative mb-5 flex max-w-md items-center">
          <input
            type="text"
            placeholder="Search by ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-[#99775c]"
          />
          <FaSearch className="absolute left-3 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => {
            const count = getCountByStatus(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-2 text-sm font-medium capitalize transition-all ${
                  isActive
                    ? "border-[#99775c] text-[#99775c]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "return_requested"
                  ? "Return Req."
                  : tab === "rto"
                    ? "RTO"
                    : tab}{" "}
                <span className="ml-1 text-xs text-gray-400 font-bold">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table/List */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#ddd0c8] text-[#323232]">
              <tr>
                <th className="p-3 text-left">Order Details</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Product & Variant</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <FaSync className="animate-spin text-[#99775c] text-xl" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isExpanded = expandedId === order._id;
                  const formattedDate = new Date(
                    order.createdAt,
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <Fragment key={order._id}>
                      <tr className="border-t hover:bg-[#f3ece7] transition">
                        {/* Order Details */}
                        <td className="p-3">
                          <div className="font-semibold text-gray-800">
                            #
                            {order._id
                              .substring(order._id.length - 8)
                              .toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formattedDate}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="p-3">
                          <div className="font-medium text-gray-800">
                            {order.shippingAddress?.fullName ||
                              "Guest Customer"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {order.user?.email || "No Email"}
                          </div>
                        </td>

                        {/* Product & Variant */}
                        <td className="p-3">
                          <div className="font-medium text-gray-800 line-clamp-1">
                            {order.productSnapshot?.name ||
                              order.product?.name ||
                              "Unknown Product"}
                          </div>
                          <div className="text-xs text-[#99775c]">
                            Variant: {order.variantId} • Qty: {order.quantity}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-3 text-right font-semibold text-gray-800">
                          ₹{order.totalAmount}
                          <div className="text-xs text-gray-400 font-normal">
                            {order.paymentMethod}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center space-y-1">
                          <div>
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${getOrderStatusBadgeClass(
                                order.orderStatus,
                              )}`}
                            >
                              {order.orderStatus === "return_requested"
                                ? "Return Req."
                                : order.orderStatus}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${getPaymentStatusBadgeClass(
                                order.paymentStatus,
                              )}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : order._id)
                              }
                              className="text-sm font-medium text-[#99775c] hover:underline"
                            >
                              {isExpanded ? "Collapse" : "Details"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Panel */}
                      {isExpanded && (
                        <tr className="bg-[#fcfaf9] border-t border-b">
                          <td colSpan={6} className="p-5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                              {/* Shipping Address */}
                              <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h3 className="mb-2 font-bold border-b pb-1 text-xs uppercase tracking-wider text-[#99775c]">
                                  Shipping Address
                                </h3>
                                <div className="text-xs leading-relaxed space-y-1 text-gray-700">
                                  <p className="font-bold text-sm">
                                    {order.shippingAddress.fullName}
                                  </p>
                                  <p>Mobile: {order.shippingAddress.mobile}</p>
                                  <p>{order.shippingAddress.addressLine1}</p>
                                  {order.shippingAddress.addressLine2 && (
                                    <p>{order.shippingAddress.addressLine2}</p>
                                  )}
                                  <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state} -{" "}
                                    {order.shippingAddress.pincode}
                                  </p>
                                  <p className="font-semibold">
                                    {order.shippingAddress.country}
                                  </p>
                                </div>
                              </div>

                              {/* Item & Snapshot Details */}
                              <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h3 className="mb-2 font-bold border-b pb-1 text-xs uppercase tracking-wider text-[#99775c]">
                                  Product & Customization Details
                                </h3>
                                <div className="text-xs space-y-2 text-gray-700">
                                  {order.productSnapshot && (
                                    <div className="flex gap-3">
                                      {order.productSnapshot.image && (
                                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded border">
                                          <img
                                            src={order.productSnapshot.image}
                                            alt={order.productSnapshot.name}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                      )}
                                      <div>
                                        <p className="font-bold">
                                          {order.productSnapshot.name}
                                        </p>
                                        <p className="text-gray-400">
                                          SKU: {order.productSnapshot.sku}
                                        </p>
                                        <p>
                                          Price: ₹
                                          {order.productSnapshot
                                            .discountPrice ||
                                            order.productSnapshot.price}
                                        </p>
                                        {order.productSnapshot.metal && (
                                          <p>
                                            Metal: {order.productSnapshot.metal}
                                          </p>
                                        )}
                                        {order.productSnapshot.gemstone && (
                                          <p>
                                            Gemstone:{" "}
                                            {order.productSnapshot.gemstone}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="border-t pt-2 space-y-1">
                                    {order.selectedRingSize && (
                                      <p>
                                        <strong>Selected Ring Size:</strong>{" "}
                                        {order.selectedRingSize}
                                      </p>
                                    )}
                                    {order.engravingText && (
                                      <p>
                                        <strong>Engraving Inscription:</strong>{" "}
                                        "{order.engravingText}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Admin Management Status Controls */}
                              <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <h3 className="mb-3 font-bold border-b pb-1 text-xs uppercase tracking-wider text-[#99775c]">
                                  Manage Order Status
                                </h3>

                                <div className="space-y-4">
                                  {/* Order Status Select */}
                                  <div>
                                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                                      Order Status
                                    </label>
                                    <select
                                      value={order.orderStatus}
                                      disabled={updatingId === order._id}
                                      onChange={(e) => {
                                        const nextStatus = e.target.value;
                                        if (nextStatus === "rto") {
                                          const reason = prompt(
                                            "Please enter the reason for Return to Origin (RTO):",
                                          );
                                          if (reason === null) return; // Cancelled
                                          handleStatusUpdate(order._id, {
                                            orderStatus: "rto",
                                            rtoReason:
                                              reason || "Package undelivered",
                                          });
                                        } else if (nextStatus === "returned") {
                                          if (
                                            window.confirm(
                                              "Approve this return and restore stock inventory?",
                                            )
                                          ) {
                                            handleStatusUpdate(order._id, {
                                              orderStatus: "returned",
                                            });
                                          }
                                        } else {
                                          handleStatusUpdate(order._id, {
                                            orderStatus: nextStatus,
                                          });
                                        }
                                      }}
                                      className="w-full rounded border border-gray-300 bg-white p-2 text-xs font-medium text-gray-700 outline-none focus:border-[#99775c] disabled:opacity-50"
                                    >
                                      <option value="placed">Placed</option>
                                      <option value="confirmed">
                                        Confirmed
                                      </option>
                                      <option value="processing">
                                        Processing
                                      </option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">
                                        Delivered
                                      </option>
                                      <option value="cancelled">
                                        Cancelled
                                      </option>
                                      <option value="return_requested">
                                        Return Requested
                                      </option>
                                      <option value="returned">
                                        Returned (Approved)
                                      </option>
                                      <option value="return_rejected">
                                        Return Rejected
                                      </option>
                                      <option value="rto">
                                        Return to Origin (RTO)
                                      </option>
                                    </select>
                                  </div>

                                  {/* Payment Status Select */}
                                  <div>
                                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                                      Payment Status
                                    </label>
                                    <select
                                      value={order.paymentStatus}
                                      disabled={updatingId === order._id}
                                      onChange={(e) =>
                                        handleStatusUpdate(order._id, {
                                          paymentStatus: e.target.value,
                                        })
                                      }
                                      className="w-full rounded border border-gray-300 bg-white p-2 text-xs font-medium text-gray-700 outline-none focus:border-[#99775c] disabled:opacity-50"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="paid">Paid</option>
                                      <option value="failed">Failed</option>
                                    </select>
                                  </div>

                                  {/* Return Request Details & Forms */}
                                  {order.orderStatus === "return_requested" && (
                                    <div className="mt-4 rounded bg-orange-50 border border-orange-200 p-3 text-xs text-orange-850">
                                      <p className="font-bold text-orange-900 mb-1">
                                        Return Requested
                                      </p>
                                      <p className="mb-3 text-orange-700 leading-normal">
                                        <strong>Reason:</strong> "
                                        {order.returnReason ||
                                          "No reason provided"}
                                        "
                                      </p>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                "Approve return and restore inventory stock?",
                                              )
                                            ) {
                                              handleStatusUpdate(order._id, {
                                                orderStatus: "returned",
                                              });
                                            }
                                          }}
                                          className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                "Reject this customer return request?",
                                              )
                                            ) {
                                              handleStatusUpdate(order._id, {
                                                orderStatus: "return_rejected",
                                              });
                                            }
                                          }}
                                          className="rounded bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700 transition"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {order.orderStatus === "returned" &&
                                    order.returnReason && (
                                      <div className="mt-2 rounded bg-teal-50 border border-teal-200 p-3 text-xs text-teal-800">
                                        <p className="font-bold">
                                          Return Approved
                                        </p>
                                        <p className="text-[11px] text-[#99775c]">
                                          <strong>Reason:</strong> "
                                          {order.returnReason}"
                                        </p>
                                      </div>
                                    )}

                                  {order.orderStatus === "return_rejected" &&
                                    order.returnReason && (
                                      <div className="mt-2 rounded bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
                                        <p className="font-bold">
                                          Return Rejected
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                          <strong>Reason:</strong> "
                                          {order.returnReason}"
                                        </p>
                                      </div>
                                    )}

                                  {order.orderStatus === "rto" &&
                                    order.rtoReason && (
                                      <div className="mt-2 rounded bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                                        <p className="font-bold">
                                          RTO Status Set
                                        </p>
                                        <p className="text-[11px] text-rose-600">
                                          <strong>Reason:</strong> "
                                          {order.rtoReason}"
                                        </p>
                                      </div>
                                    )}

                                  {updatingId === order._id && (
                                    <div className="flex items-center justify-center text-xs text-[#99775c] font-semibold gap-2 animate-pulse">
                                      <span>Saving changes...</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    No orders found matching the filter criteria.
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
