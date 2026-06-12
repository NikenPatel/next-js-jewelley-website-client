import React from "react";
import { Coupon } from "@/app/types/coupon";
import { Edit2, Trash2 } from "lucide-react";

interface CouponTableProps {
  coupons: Coupon[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="bg-[#141414] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs uppercase bg-gray-900/50 text-gray-500 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Code</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Discount</th>
              <th className="px-6 py-4 font-semibold">Usage</th>
              <th className="px-6 py-4 font-semibold">Expiry</th>
              <th className="px-6 py-4 font-semibold text-center">Active</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="inline-block bg-[#cda567]/10 text-[#cda567] border border-[#cda567]/20 px-3 py-1 rounded-md font-bold tracking-wider">
                    {c.code}
                  </span>
                  {c.isFirstOrderOnly && (
                    <span className="block text-[10px] text-[#D4AF37] mt-1 uppercase tracking-wider font-semibold">
                      First Order Only
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-white max-w-xs truncate" title={c.description}>
                  {c.description || "-"}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">
                    {c.discountType === "percentage"
                      ? `${c.discountValue}% OFF`
                      : c.discountType === "fixed"
                        ? `₹${c.discountValue} OFF`
                        : "Free Shipping"}
                  </div>
                  {c.minOrderAmount ? <div className="text-[10px] mt-1">Min: ₹{c.minOrderAmount}</div> : null}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="font-semibold">{c.usedCount || 0}</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-400">{c.usageLimit || "∞"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {c.expiryDate ? (
                    <span className={new Date(c.expiryDate) < new Date() ? "text-red-400 font-medium" : "text-gray-300"}>
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </span>
                  ) : (
                    "No Expiry"
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={c.isActive}
                      onChange={(e) => onToggleActive(c._id!, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={() => onEdit(c._id!)}
                      title="Edit Coupon"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      onClick={() => onDelete(c._id!)}
                      title="Delete Coupon"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No coupons found. Create your first promotion!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponTable;
