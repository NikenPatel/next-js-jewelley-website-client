import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Product,
  ProductState,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/app/admin/types/product";
import axios from "axios";
import api from "../lib/axios";

const productRequest = async <T>(
  method: "get" | "post" | "put",
  path: string,
  body?: unknown,
): Promise<T> => {
  try {
    let response;

    switch (method) {
      case "post":
        response = await api.post<T>(path, body);
        break;

      case "put":
        response = await api.put<T>(path, body);
        break;

      case "get":
        response = await api.get<T>(path);
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
/* CREATE PRODUCT */

export const createProduct = createAsyncThunk<
  Product,
  CreateProductPayload,
  { rejectValue: string }
>("product/createProduct", async (body, thunkAPI) => {
  try {
    return await productRequest<Product>(
      "post",
      "/api/products/add-product",
      body,
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Product creation failed",
    );
  }
});

/* UPDATE PRODUCT */

export const updateProduct = createAsyncThunk<
  Product,
  UpdateProductPayload,
  { rejectValue: string }
>("product/updateProduct", async ({ productId, data }, thunkAPI) => {
  try {
    return await productRequest<Product>(
      "put",
      `/api/products/update-product/${productId}`,
      data,
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Product update failed",
    );
  }
});

/* GET PRODUCTS */

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("product/fetchProducts", async (_, thunkAPI) => {
  try {
    return await productRequest<Product[]>("get", "/api/products/get-products");
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch products",
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("product/fetchProductById", async (productId, thunkAPI) => {
  try {
    return await productRequest<Product>(
      "get",
      `/api/products/get-product/${productId}`,
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch product",
    );
  }
});

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  success: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* CREATE */

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      /* UPDATE */

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      /* FETCH */

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const { resetProductState } = productSlice.actions;

export default productSlice.reducer;
