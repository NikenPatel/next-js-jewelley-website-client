import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/store/lib/axios";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  todaySales: number;
  monthlySales: number;
  timestamp: string;
}

export interface AnalyticsState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "analytics/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/dashboard/stats");
      if (response.data?.status === "ok") {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch dashboard stats");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats",
      );
    }
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default analyticsSlice.reducer;
