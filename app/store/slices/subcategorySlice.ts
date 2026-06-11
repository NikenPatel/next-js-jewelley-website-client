import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../lib/axios";

export interface Subcategory {
  _id?: string;
  name: string;
  parentCategory: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubcategoryState {
  subcategories: Subcategory[] | any;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const subcategoryRequest = async <T>(
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

export const createSubcategory = createAsyncThunk<
  Subcategory,
  { name: string; categoryId: string },
  { rejectValue: string }
>("subcategory/createSubcategory", async (payload, thunkAPI) => {
  try {
    return await subcategoryRequest<Subcategory>(
      "post",
      "/api/categories/subcategories",
      payload,
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Subcategory creation failed",
    );
  }
});

export const updateSubcategory = createAsyncThunk<
  Subcategory,
  { id: string; data: { name: string; categoryId: string } },
  { rejectValue: string }
>("subcategory/updateSubcategory", async ({ id, data }, thunkAPI) => {
  try {
    return await subcategoryRequest<Subcategory>(
      "put",
      `/api/categories/subcategories/${id}`,
      data,
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Subcategory update failed",
    );
  }
});

export const deleteSubcategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("subcategory/deleteSubcategory", async (id, thunkAPI) => {
  try {
    await subcategoryRequest("delete", `/api/categories/subcategories/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Subcategory deletion failed",
    );
  }
});

export const fetchSubcategories = createAsyncThunk<
  Subcategory[],
  void,
  { rejectValue: string }
>("subcategory/fetchSubcategories", async (_, thunkAPI) => {
  try {
    return await subcategoryRequest<Subcategory[]>(
      "get",
      "/api/categories/subcategories",
    );
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch subcategories",
    );
  }
});
// fetch subcatagorybycatagoryid
// http://localhost:8000/api/categories/:categoryId/subcategories

export const fetchSubcategorybyCategoryId = createAsyncThunk<
  Subcategory[],
  { categoryId: string },
  { rejectValue: string }
>(
  "subcategory/fetchSubcategorybyCategoryId",
  async ({ categoryId }, thunkAPI) => {
    try {
      return await subcategoryRequest<Subcategory[]>(
        "get",
        `/api/categories/${categoryId}/subcategories`,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch subcategories",
      );
    }
  },
);
const initialState: SubcategoryState = {
  subcategories: [],
  loading: false,
  success: false,
  error: null,
};

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {
    resetSubcategoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchSubcategorybyCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategorybyCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategorybyCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const { resetSubcategoryState } = subcategorySlice.actions;

export default subcategorySlice.reducer;
