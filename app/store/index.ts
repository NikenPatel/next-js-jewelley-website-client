// store/index.ts

import { configureStore } from "@reduxjs/toolkit";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import subcategoryReducer from "./slices/subcategorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
  },
});

export default store;

// function authReducer(state: unknown, action: any): unknown {
//   throw new Error("Function not implemented.");
// }
