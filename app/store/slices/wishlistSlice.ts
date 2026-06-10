import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../lib/axios";

export interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    category: string;
    variants?: {
      images?: string[];
      price?: number;
    }[];
  };
  variantId?: string;
  createdAt?: string;
}

export interface WishlistState {
  wishlist: WishlistItem[];
  items: any;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const wishlistRequest = async <T>(
  method: "get" | "post" | "delete",
  path: string,
  body?: unknown,
): Promise<T> => {
  try {
    let response;

    switch (method) {
      case "post":
        response = await api.post<T>(path, body);
        break;

      case "get":
        response = await api.get<T>(path);
        break;

      case "delete":
        response = await api.delete<T>(path);
        break;

      default:
        throw new Error("Invalid request method");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || error.message || "Request failed",
      );
    }

    throw new Error("Something went wrong");
  }
};

// =========================
// ADD TO WISHLIST
// =========================

export const addToWishlist = createAsyncThunk<
  any,
  { productId: string; variantId?: string },
  { rejectValue: string }
>("wishlist/addToWishlist", async ({ productId, variantId }, thunkAPI) => {
  try {
    return await wishlistRequest("post", "/api/wishlist", {
      productId,
      variantId,
    });
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to add product to wishlist",
    );
  }
});

// =========================
// GET WISHLIST
// =========================

export const fetchWishlist = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("wishlist/fetchWishlist", async (_, thunkAPI) => {
  try {
    return await wishlistRequest("get", "/api/wishlist");
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch wishlist",
    );
  }
});

// =========================
// REMOVE FROM WISHLIST
// =========================

export const removeFromWishlist = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("wishlist/removeFromWishlist", async (productId, thunkAPI) => {
  try {
    await wishlistRequest("delete", `/api/wishlist/${productId}`);

    return productId;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to remove wishlist item",
    );
  }
});

// =========================
// INITIAL STATE
// =========================

const initialState: WishlistState = {
  wishlist: [],
  items: [],
  loading: false,
  success: false,
  error: null,
};

// =========================
// SLICE
// =========================

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    resetWishlistState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ADD TO WISHLIST
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload?.data) {
          const exists = state.wishlist.find(
            (item) => item.product._id === action.payload.data.product._id,
          );

          if (!exists) {
            state.wishlist.unshift(action.payload.data);
          }
        }
      })

      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      // FETCH WISHLIST
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      // REMOVE FROM WISHLIST
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.wishlist = state.wishlist.filter(
          (item) => item.product._id !== action.payload,
        );
      })

      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

// =========================
// ACTIONS
// =========================

export const { resetWishlistState } = wishlistSlice.actions;

// =========================

// SELECTORS
// =========================

export const selectWishlistItems = (state: any) => state.wishlist.wishlist;

export const selectWishlistCount = (state: any) =>
  state.wishlist.wishlist.length;

export const selectIsWishlisted = (productId: string) => (state: any) =>
  state.wishlist.wishlist.some(
    (item: WishlistItem) => item.product._id === productId,
  );

// =========================
// REDUCER
// =========================

export default wishlistSlice.reducer;
