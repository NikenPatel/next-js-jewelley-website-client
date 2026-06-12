import React, { useState, useEffect } from "react";
import { Coupon } from "@/app/types/coupon";
import { createCoupon, updateCoupon } from "@/app/services/couponService";
import { X } from "lucide-react";

interface CouponFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existing?: Coupon;
}

const CouponFormModal: React.FC<CouponFormModalProps> = ({
  visible,
  onClose,
  onSuccess,
  existing,
}) => {
  const isEdit = !!existing;
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed" | "free_shipping">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState<number | "">("");
  const [maxDiscount, setMaxDiscount] = useState<number | "">("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFirstOrderOnly, setIsFirstOrderOnly] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && existing) {
      setCode(existing.code);
      setDescription(existing.description || "");
      setDiscountType(existing.discountType);
      setDiscountValue(existing.discountValue);
      setMinOrderAmount(existing.minOrderAmount || "");
      setMaxDiscount(existing.maxDiscount || "");
      setUsageLimit(existing.usageLimit || "");
      setExpiryDate(existing.expiryDate ? new Date(existing.expiryDate).toISOString().split('T')[0] : "");
      setIsActive(existing.isActive);
      setIsFirstOrderOnly(existing.isFirstOrderOnly || false);
    } else {
      setCode("");
      setDescription("");
      setDiscountType("percentage");
      setDiscountValue(0);
      setMinOrderAmount("");
      setMaxDiscount("");
      setUsageLimit("");
      setExpiryDate("");
      setIsActive(true);
      setIsFirstOrderOnly(false);
    }
  }, [existing, isEdit, visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: Partial<Coupon> = {
      code,
      description,
      discountType,
      discountValue,
      isActive,
      isFirstOrderOnly
    };

    if (minOrderAmount !== "") payload.minOrderAmount = Number(minOrderAmount);
    if (maxDiscount !== "") payload.maxDiscount = Number(maxDiscount);
    if (usageLimit !== "") payload.usageLimit = Number(usageLimit);
    if (expiryDate) payload.expiryDate = new Date(expiryDate).toISOString();

    try {
      if (isEdit && existing && existing._id) {
        await updateCoupon(existing._id, payload);
      } else {
        await createCoupon(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#141414] border border-[#cda567]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-[#141414] z-10">
          <h2 className="text-2xl font-bold text-[#D4AF37]">
            {isEdit ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition uppercase"
                  placeholder="e.g. FESTIVE20"
                  required
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition"
                  placeholder="e.g. 20% off on all items during the festive season"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Discount Type *</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition appearance-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              {/* Discount Value */}
              {discountType !== "free_shipping" && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition"
                    required
                  />
                </div>
              )}

              {/* Minimum Order */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition"
                  placeholder="0"
                />
              </div>

              {/* Maximum Discount */}
              {discountType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition"
                    placeholder="No limit"
                  />
                </div>
              )}

              {/* Usage Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-2.5 text-white outline-none transition"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-[#1a1a1a] border border-gray-800 rounded-xl">
              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </div>
                <span className="text-sm font-medium text-white">Coupon is Active</span>
              </label>

              {/* First Order Only Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isFirstOrderOnly}
                    onChange={(e) => setIsFirstOrderOnly(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </div>
                <span className="text-sm font-medium text-white">First Order Only</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg font-semibold bg-[#D4AF37] text-black hover:bg-[#b8962a] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponFormModal;
