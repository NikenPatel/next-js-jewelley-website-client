// app/store/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Order, OrderItem } from "../../types/order";
import api from "../lib/axios";

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// Place order async thunk
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (
    data: {
      address: {
        fullName: string;
        mobile: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
      };
      paymentMethod: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/api/orders/checkout", data);

      return response.data.orders || response.data.order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to place order",
      );
    }
  },
);

// Get orders async thunk (for user order history)
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders/my-orders");
      return (response.data.orders || response.data.order) as Order[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.orders.push(...action.payload);
        } else if (action.payload) {
          state.orders.push(action.payload);
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
