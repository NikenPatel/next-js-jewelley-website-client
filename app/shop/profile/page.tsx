"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchOrders,
  requestReturn,
  cancelOrder,
} from "@/app/store/slices/orderSlice";
import ShopNavbar from "../../components/user/Home/navbar";
import Footer from "../../components/common/Footer";
import {
  FaBox,
  FaUndo,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaSignOutAlt,
  FaRegListAlt,
  FaChevronRight,
} from "react-icons/fa";
import { logout } from "@/app/store/slices/authSlice";

import { Suspense } from "react";

function UserProfileContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");

  const { orders, loading, error } = useAppSelector((state) => state.order);
  const { user, token } = useAppSelector((state) => state.auth as any);

  const [activeTab, setActiveTab] = useState(
    activeTabParam === "orders" ? "orders" : "dashboard",
  );

  // Return Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    dispatch(fetchOrders());
  }, [dispatch, token, router]);

  useEffect(() => {
    if (activeTabParam === "orders") {
      setActiveTab("orders");
    }
  }, [activeTabParam]);

  // Derived metrics
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter((o) =>
    ["placed", "confirmed", "processing", "shipped"].includes(o.orderStatus),
  ).length;
  const completedReturnsCount = orders.filter((o) =>
    ["delivered", "returned", "return_requested"].includes(o.orderStatus),
  ).length;

  const returnReasonsList = [
    "Size doesn't fit (Too small/large)",
    "Damaged or defective item received",
    "Wrong product or variant delivered",
    "Product looks different from website images",
    "Changed my mind / No longer needed",
    "Other (Please specify below)",
  ];

  const handleOpenReturnModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setReturnReason(returnReasonsList[0]);
    setCustomReason("");
    setIsModalOpen(true);
  };

  const handleCloseReturnModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setReturnReason("");
    setCustomReason("");
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    const finalReason =
      returnReason === "Other (Please specify below)"
        ? customReason.trim()
        : returnReason;

    if (!finalReason) {
      alert("Please specify a reason for your return.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        requestReturn({ orderId: selectedOrderId, returnReason: finalReason }),
      ).unwrap();
      showToast("Your return request has been submitted successfully.");
      handleCloseReturnModal();
    } catch (err: any) {
      alert(err || "Failed to submit return request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this order? This action cannot be undone.",
      )
    )
      return;

    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      showToast("Your order has been cancelled successfully.");
    } catch (err: any) {
      alert(err || "Failed to cancel order.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/signin");
  };

  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case "placed":
        return {
          label: "Placed",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <FaClock className="h-3.5 w-3.5" />,
          step: 1,
        };
      case "confirmed":
        return {
          label: "Confirmed",
          colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: <FaCheckCircle className="h-3.5 w-3.5" />,
          step: 2,
        };
      case "processing":
        return {
          label: "Processing",
          colorClass: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <FaSpinner className="h-3.5 w-3.5 animate-spin" />,
          step: 3,
        };
      case "shipped":
        return {
          label: "Shipped",
          colorClass: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <FaTruck className="h-3.5 w-3.5" />,
          step: 4,
        };
      case "delivered":
        return {
          label: "Delivered",
          colorClass: "bg-green-50 text-green-700 border-green-200",
          icon: <FaCheckCircle className="h-3.5 w-3.5" />,
          step: 5,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          colorClass: "bg-red-50 text-red-700 border-red-200",
          icon: <FaTimesCircle className="h-3.5 w-3.5" />,
          step: -1,
        };
      case "return_requested":
        return {
          label: "Return Requested",
          colorClass: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <FaUndo className="h-3.5 w-3.5 animate-pulse" />,
          step: -2,
        };
      case "returned":
        return {
          label: "Returned",
          colorClass: "bg-teal-50 text-teal-700 border-teal-200",
          icon: <FaUndo className="h-3.5 w-3.5" />,
          step: -2,
        };
      case "return_rejected":
        return {
          label: "Return Rejected",
          colorClass: "bg-slate-100 text-slate-700 border-slate-300",
          icon: <FaInfoCircle className="h-3.5 w-3.5" />,
          step: -2,
        };
      case "rto":
        return {
          label: "Return to Origin",
          colorClass: "bg-rose-50 text-rose-800 border-rose-200",
          icon: <FaUndo className="h-3.5 w-3.5" />,
          step: -2,
        };
      default:
        return {
          label: status,
          colorClass: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <FaInfoCircle className="h-3.5 w-3.5" />,
          step: 0,
        };
    }
  };

  const renderTimeline = (currentStep: number) => {
    if (currentStep < 0) return null; // Do not show standard timeline for cancelled or returned orders

    const steps = ["Placed", "Confirmed", "Processing", "Shipped", "Delivered"];

    return (
      <div className="w-full py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div
                key={step}
                className="flex flex-col items-center relative w-full"
              >
                <div
                  className={`z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCompleted
                      ? "bg-[#99775c] text-white"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-[#99775c]/20" : ""}`}
                >
                  {isCompleted ? <FaCheckCircle /> : stepNumber}
                </div>
                <p
                  className={`mt-2 text-[10px] font-semibold uppercase tracking-wider ${
                    isCompleted ? "text-[#99775c]" : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-[50%] top-3 -z-10 h-0.5 w-full ${
                      stepNumber < currentStep ? "bg-[#99775c]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <>
      <ShopNavbar />

      <div className="min-h-screen bg-[#fcfaf9] py-12 px-4 sm:px-6 lg:px-8 text-gray-700 font-sans">
        <div className="mx-auto max-w-6xl">
          {/* Toast Notification */}
          {successMessage && (
            <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg transition-all flex items-center gap-2">
              <FaCheckCircle />
              {successMessage}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="sticky top-28 overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
                <div className="bg-[#efe7e1]/50 p-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#99775c] to-[#70523b] text-2xl font-serif font-bold text-white shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-[#2d2d2d]">
                    {user?.name || "Customer"}
                  </h2>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#fcfaf9] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#99775c]">
                    Valued Member
                  </div>
                </div>

                <div className="p-4">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                        activeTab === "dashboard"
                          ? "bg-[#99775c] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <FaRegListAlt
                          className={
                            activeTab === "dashboard"
                              ? "text-white/80"
                              : "text-gray-400"
                          }
                        />
                        Dashboard
                      </span>
                      {activeTab === "dashboard" && (
                        <FaChevronRight className="text-[10px]" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                        activeTab === "orders"
                          ? "bg-[#99775c] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <FaBox
                          className={
                            activeTab === "orders"
                              ? "text-white/80"
                              : "text-gray-400"
                          }
                        />
                        My Orders
                      </span>
                      {activeTab === "orders" && (
                        <FaChevronRight className="text-[10px]" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("account")}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                        activeTab === "account"
                          ? "bg-[#99775c] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <FaUser
                          className={
                            activeTab === "account"
                              ? "text-white/80"
                              : "text-gray-400"
                          }
                        />
                        Account Details
                      </span>
                      {activeTab === "account" && (
                        <FaChevronRight className="text-[10px]" />
                      )}
                    </button>
                  </nav>

                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-serif text-[#2d2d2d] mb-2">
                      Welcome back, {user?.name?.split(" ")[0]}!
                    </h1>
                    <p className="text-sm text-gray-500">
                      From here you can view your recent orders and manage your
                      account.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 text-xl">
                        <FaBox />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold text-[#2d2d2d]">
                          {totalOrders}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 text-xl">
                        <FaSpinner />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Active Shipments
                        </p>
                        <p className="text-2xl font-bold text-[#2d2d2d]">
                          {activeOrdersCount}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-500 text-xl">
                        <FaCheckCircle />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Completed & Returns
                        </p>
                        <p className="text-2xl font-bold text-[#2d2d2d]">
                          {completedReturnsCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {orders.length > 0 && (
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[#2d2d2d]">
                          Latest Order
                        </h3>
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="text-xs font-bold text-[#99775c] hover:underline uppercase tracking-wide"
                        >
                          View All
                        </button>
                      </div>

                      {/* Mini order card */}
                      {(() => {
                        const order = orders[0];
                        const statusInfo = getOrderStatusInfo(
                          order.orderStatus,
                        );
                        return (
                          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-[#fcfaf9] border border-gray-100">
                            <div className="flex items-center gap-4">
                              {order.productSnapshot?.image ? (
                                <img
                                  src={order.productSnapshot.image}
                                  alt="Product"
                                  className="h-16 w-16 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                  <FaBox />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-[#2d2d2d]">
                                  Order #
                                  {order._id
                                    .substring(order._id.length - 8)
                                    .toUpperCase()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Placed on{" "}
                                  {new Date(
                                    order.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.colorClass}`}
                            >
                              {statusInfo.icon}
                              {statusInfo.label}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  {/* Loading state */}
                  {loading && orders.length === 0 ? (
                    <div className="flex h-60 items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ddd0c8] border-t-[#99775c]" />
                    </div>
                  ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                      <FaInfoCircle className="mx-auto mb-2 text-2xl" />
                      <p className="font-semibold">{error}</p>
                      <button
                        onClick={() => dispatch(fetchOrders())}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Retry Fetching
                      </button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-gray-100">
                      <FaBox className="mx-auto mb-4 text-4xl text-gray-300" />
                      <h3 className="text-xl font-semibold text-[#2d2d2d]">
                        No Orders Yet
                      </h3>
                      <p className="mt-2 text-gray-500">
                        You haven't placed any orders yet. Start exploring our
                        collections.
                      </p>
                      <Link
                        href="/shop"
                        className="mt-6 inline-block rounded-full bg-[#99775c] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#836248] transition"
                      >
                        Go to Shop
                      </Link>
                    </div>
                  ) : (
                    /* Orders List */
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const statusInfo = getOrderStatusInfo(
                          order.orderStatus,
                        );
                        const orderDate = new Date(
                          order.createdAt,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={order._id}
                            className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm"
                          >
                            {/* Order Meta Header */}
                            <div className="flex flex-col gap-3 border-b border-gray-100 bg-[#fcfaf9] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-8">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Order ID
                                  </p>
                                  <p className="text-xs font-mono font-bold text-gray-800 uppercase">
                                    #{order._id.substring(order._id.length - 8)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Placed On
                                  </p>
                                  <p className="text-xs font-semibold text-gray-800">
                                    {orderDate}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Total
                                  </p>
                                  <p className="text-xs font-bold text-[#99775c]">
                                    ₹{order.totalAmount}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusInfo.colorClass}`}
                                >
                                  {statusInfo.icon}
                                  {statusInfo.label}
                                </span>
                              </div>
                            </div>

                            {/* Timeline Stepper for Active Orders */}
                            {statusInfo.step > 0 && (
                              <div className="border-b border-gray-50 px-6 py-2 bg-white hidden md:block">
                                {renderTimeline(statusInfo.step)}
                              </div>
                            )}

                            {/* Product Details Section */}
                            <div className="p-6">
                              <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                                <div className="flex gap-4">
                                  {order.productSnapshot?.image && (
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-[#fbf9f8]">
                                      <img
                                        src={order.productSnapshot.image}
                                        alt={order.productSnapshot.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex flex-col justify-center">
                                    <h4 className="text-base font-bold text-gray-900 leading-snug">
                                      {order.productSnapshot?.name ||
                                        "Premium Fine Jewelry"}
                                    </h4>

                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                      {order.productSnapshot?.sku && (
                                        <p>
                                          <span className="font-semibold text-gray-700">
                                            SKU:
                                          </span>{" "}
                                          {order.productSnapshot.sku}
                                        </p>
                                      )}
                                      {order.productSnapshot?.metal && (
                                        <p>
                                          <span className="font-semibold text-gray-700">
                                            Metal:
                                          </span>{" "}
                                          {order.productSnapshot.metal}
                                        </p>
                                      )}
                                      {order.productSnapshot?.gemstone && (
                                        <p>
                                          <span className="font-semibold text-gray-700">
                                            Gem:
                                          </span>{" "}
                                          {order.productSnapshot.gemstone}
                                        </p>
                                      )}
                                      {order.selectedRingSize && (
                                        <p>
                                          <span className="font-semibold text-gray-700">
                                            Size:
                                          </span>{" "}
                                          {order.selectedRingSize}
                                        </p>
                                      )}
                                      <p>
                                        <span className="font-semibold text-gray-700">
                                          Qty:
                                        </span>{" "}
                                        {order.quantity}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Actions */}
                                <div className="flex flex-col justify-center gap-3 md:items-end">
                                  {(order.orderStatus === "placed" ||
                                    order.orderStatus === "confirmed") && (
                                    <button
                                      onClick={() =>
                                        handleCancelOrder(order._id)
                                      }
                                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-red-600 shadow-sm transition hover:bg-red-50 active:bg-red-100"
                                    >
                                      <FaTimesCircle className="h-3 w-3" />
                                      Cancel Order
                                    </button>
                                  )}

                                  {order.orderStatus === "delivered" && (
                                    <button
                                      onClick={() =>
                                        handleOpenReturnModal(order._id)
                                      }
                                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100"
                                    >
                                      <FaUndo className="h-3 w-3 text-[#99775c]" />
                                      Return Item
                                    </button>
                                  )}

                                  {order.orderStatus === "return_requested" && (
                                    <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-xs text-orange-800 max-w-sm">
                                      <p className="font-bold mb-1 flex items-center gap-1.5">
                                        <FaSpinner className="animate-spin" />{" "}
                                        Return Pending Approval
                                      </p>
                                      <p className="text-[11px] leading-relaxed text-orange-700 mt-1.5 pt-1.5 border-t border-orange-200">
                                        <strong>Reason:</strong> "
                                        {order.returnReason}"
                                      </p>
                                    </div>
                                  )}

                                  {order.orderStatus === "returned" && (
                                    <div className="rounded-xl bg-teal-50 border border-teal-100 p-3 text-xs text-teal-800 max-w-sm">
                                      <p className="font-bold mb-1 flex items-center gap-1.5">
                                        <FaCheckCircle /> Return Accepted
                                      </p>
                                      <p className="text-[11px] text-teal-700 mt-1.5 pt-1.5 border-t border-teal-200">
                                        Refund is processed or item has been
                                        returned back.
                                      </p>
                                    </div>
                                  )}

                                  {order.orderStatus === "return_rejected" && (
                                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 max-w-sm">
                                      <p className="font-bold mb-1 text-slate-800 flex items-center gap-1.5">
                                        <FaInfoCircle /> Return Declined
                                      </p>
                                      <p className="text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200">
                                        Please contact customer support for
                                        further information.
                                      </p>
                                    </div>
                                  )}

                                  {order.orderStatus === "rto" && (
                                    <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-800 max-w-sm">
                                      <p className="font-bold mb-1 flex items-center gap-1.5">
                                        <FaUndo /> Returned to Origin
                                      </p>
                                      {order.rtoReason && (
                                        <p className="text-[11px] text-rose-600 mt-1.5 pt-1.5 border-t border-rose-200">
                                          <strong>Reason:</strong> "
                                          {order.rtoReason}"
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "account" && (
                <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 max-w-2xl">
                  <h3 className="text-xl font-bold text-[#2d2d2d] mb-6">
                    Account Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Full Name
                      </label>
                      <div className="w-full rounded-xl border border-gray-200 bg-[#fcfaf9] px-4 py-3 text-sm text-gray-800 font-medium">
                        {user?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Email Address
                      </label>
                      <div className="w-full rounded-xl border border-gray-200 bg-[#fcfaf9] px-4 py-3 text-sm text-gray-800 font-medium">
                        {user?.email}
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 italic">
                        Account details are currently managed centrally. Please
                        contact support to change your email or password.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Return Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            {/* Modal Header */}
            <div className="bg-[#fcfaf9] border-b border-gray-100 px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2d2d2d]">
                Request Return
              </h3>
              <button
                onClick={handleCloseReturnModal}
                className="text-gray-400 hover:text-gray-600 transition text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitReturn} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Select Return Reason
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfaf9] px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                  required
                >
                  {returnReasonsList.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {returnReason === "Other (Please specify below)" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Specify Reason
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Please type your reason for return here..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-[#fcfaf9] px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c] resize-none"
                    required
                  ></textarea>
                </div>
              )}

              <div className="rounded-xl bg-[#efe7e1]/30 p-4 text-[11px] leading-relaxed text-gray-500 border border-[#efe7e1]/70">
                <p className="font-bold text-[#99775c] mb-1 uppercase tracking-wider">
                  Return Policy Notice:
                </p>
                Our team will review your return request. The item must be
                unused, in its original packaging, and with all tags intact to
                be eligible for approval.
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseReturnModal}
                  className="flex-1 rounded-full border border-gray-200 bg-white py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-[#99775c] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#836248] active:bg-[#70523b] transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Submitting
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin text-[#D4AF37] text-4xl">Loading...</div>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}
