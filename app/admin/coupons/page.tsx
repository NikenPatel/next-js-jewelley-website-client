"use client";
import React, { useEffect, useState } from "react";
import CouponTable from "./components/CouponTable";
import CouponFormModal from "./components/CouponFormModal";
import CouponAnalytics from "./components/CouponAnalytics";
import { Coupon } from "../../types/coupon";
import { getCoupons, deleteCoupon, updateCoupon } from "../../services/couponService";

export default function CouponsAdminPage() {
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | undefined>(undefined);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = () => {
    setEditCoupon(undefined);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    const coupon = coupons.find(c => c._id === id);
    if (coupon) {
      setEditCoupon(coupon);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        fetchCoupons();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateCoupon(id, { isActive });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-[#D4AF37]">
        Coupon Management
      </h1>
      
      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <>
          <CouponAnalytics coupons={coupons} />
          <div className="flex justify-end mb-4 mt-6">
            <button
              className="px-5 py-2.5 bg-[#D4AF37] text-[#000] font-semibold rounded-lg hover:bg-[#b8962a] transition"
              onClick={handleCreate}
            >
              + Create Coupon
            </button>
          </div>
          <CouponTable 
            coupons={coupons} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onToggleActive={handleToggleActive} 
          />
        </>
      )}
      
      <CouponFormModal
        visible={showModal}
        onClose={closeModal}
        onSuccess={fetchCoupons}
        existing={editCoupon}
      />
    </div>
  );
}
