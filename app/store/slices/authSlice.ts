import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../lib/axios";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export interface User {
  _id?: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface SigninPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string;
  loading: boolean;
  error: string | null;
}

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

const getStoredToken = (): string => {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("authToken") || "";
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  error: null,
};

// const authRequest = async <T>(path: string, body: unknown): Promise<T> => {
//   const response = await fetch(`${API_URL}${path}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Authentication failed");
//   }

//   return data;
// };
const authRequest = async <T>(path: string, body: unknown): Promise<T> => {
  try {
    const response = await api.post<T>(path, body);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Authentication failed",
      );
    }

    throw new Error("Something went wrong");
  }
};
export const signin = createAsyncThunk<
  AuthResponse,
  SigninPayload,
  { rejectValue: string }
>("auth/signin", async (body, thunkAPI) => {
  try {
    return await authRequest<AuthResponse>("/api/auth/signin", body);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Login failed",
    );
  }
});

export const signup = createAsyncThunk<
  AuthResponse,
  SignupPayload,
  { rejectValue: string }
>("auth/signup", async (body, thunkAPI) => {
  try {
    return await authRequest<AuthResponse>("/api/auth/signup", body);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : "Signup failed",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = "";
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      }
    },

    loadUserFromStorage: (state) => {
      state.user = getStoredUser();
      state.token = getStoredToken();
    },
  },

  extraReducers: (builder) => {
    builder

      // SIGNIN
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        signin.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "authUser",
              JSON.stringify(action.payload.user),
            );

            localStorage.setItem("authToken", action.payload.token);
          }
        },
      )

      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "authUser",
              JSON.stringify(action.payload.user),
            );

            localStorage.setItem("authToken", action.payload.token);
          }
        },
      )

      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;

export default authSlice.reducer;
