import React from "react";
import { Coupon } from "@/app/types/coupon";
import { Ticket, Activity, CheckCircle } from "lucide-react";

interface CouponAnalyticsProps {
  coupons: Coupon[];
}

export const CouponAnalytics: React.FC<CouponAnalyticsProps> = ({ coupons }) => {
  const total = coupons?.length || 0;
  const active = coupons?.filter((c) => c.isActive).length || 0;
  const used = coupons?.reduce((sum, c) => sum + (c.usedCount || 0), 0) || 0;

  const stats = [
    { label: "Total Coupons", value: total, icon: Ticket, color: "text-blue-400" },
    { label: "Active Coupons", value: active, icon: Activity, color: "text-green-400" },
    { label: "Total Redemptions", value: used, icon: CheckCircle, color: "text-[#D4AF37]" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-[#141414] border border-gray-800 rounded-2xl p-6 flex items-center shadow-lg">
          <div className={`p-4 rounded-full bg-gray-900/50 border border-gray-800 ${s.color} mr-4`}>
            <s.icon size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">{s.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CouponAnalytics;
