import { Coupon } from "../types/coupon";
import api from "../store/lib/axios";

export async function getCoupons(): Promise<Coupon[]> {
  try {
    const res = await api.get("/api/coupons");
    return res.data.coupons || res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch coupons");
  }
}

export async function createCoupon(data: Partial<Coupon>): Promise<Coupon> {
  try {
    const res = await api.post("/api/coupons", data);
    return res.data.coupon || res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create coupon");
  }
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon> {
  try {
    const res = await api.put(`/api/coupons/${id}`, data);
    return res.data.coupon || res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update coupon");
  }
}

export async function deleteCoupon(id: string): Promise<void> {
  try {
    await api.delete(`/api/coupons/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete coupon");
  }
}
