import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/axios";

export interface CartItem {
  _id?: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  customization?: Record<string, any> | null;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  success: boolean;
  error: string | null;
  message?: string;
}

const initialState: CartState = {
  items: [],
  loading: false,
  success: false,
  error: null,
  message: "",
};

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    payload: {
      productId: string;
      variantId: string;
      quantity: number;
      customization?: Record<string, any>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/api/cart/add", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart",
      );
    }
  },
);

// Get cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    payload: {
      itemId: string;
      quantity: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put("/api/cart/update", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item",
      );
    }
  },
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete("/api/cart/remove", {
        data: { itemId },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart",
      );
    }
  },
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/api/cart/clear");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Item added to cart";
        state.items = action.payload.cart?.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });

    // Get cart
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload.cart?.items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        state.items = [];
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Item updated";
        state.items = action.payload.cart?.items || [];
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Item removed";
        state.items = action.payload.cart?.items || [];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Cart cleared";
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
