import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../lib/axios";

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryState {
  categories: Category[] | any;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const categoryRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
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
      case "put":
        response = await api.put<T>(path, body);
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

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("category/fetchCategories", async (_, thunkAPI) => {
  try {
    return await categoryRequest<Category[]>("get", "/api/categories");
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch categories",
    );
  }
});

export const createCategory = createAsyncThunk<
  Category,
  Category,
  { rejectValue: string }
>("category/createCategory", async (body, thunkAPI) => {
  try {
    return await categoryRequest<Category>("post", "/api/categories", body);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Category creation failed",
    );
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: Partial<Category> },
  { rejectValue: string }
>("category/updateCategory", async ({ id, data }, thunkAPI) => {
  try {
    return await categoryRequest<Category>("put", `/api/categories/${id}`, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Category update failed",
    );
  }
});

export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("category/deleteCategory", async (id, thunkAPI) => {
  try {
    await categoryRequest("delete", `/api/categories/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Category deletion failed",
    );
  }
});

const initialState: CategoryState = {
  categories: {
    data: [],
  },
  loading: false,
  success: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.success = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;

export default categorySlice.reducer;
