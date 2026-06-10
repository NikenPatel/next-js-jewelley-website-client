// store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import type { AuthState } from "./slices/authSlice";
import type { ProductState } from "@/app/admin/types/product";
import type { CategoryState } from "./slices/categorySlice";
// import type { SubcategoryState } from "./slices/subcategorySlice";
import type { CartState } from "./slices/cartSlice";

import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import subcategoryReducer, {
  SubcategoryState,
} from "./slices/subcategorySlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer, { WishlistState } from "./slices/wishlistSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export interface RootState {
  auth: AuthState;
  product: ProductState;
  category: CategoryState;
  subcategory: SubcategoryState;
  cart: CartState;
  wishlist: WishlistState;
}

export type AppDispatch = typeof store.dispatch;

export default store;

// function authReducer(state: unknown, action: any): unknown {
//   throw new Error("Function not implemented.");
// }
