"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WishlistCard from "@/app/components/common/WishlistCard";

import { AppDispatch, RootState } from "@/app/store";

import {
  fetchWishlist,
  removeFromWishlist,
} from "@/app/store/slices/wishlistSlice";

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error } = useSelector(
    (state: RootState) => state.wishlist,
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

      {items.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {items.map((item: any) => (
            <WishlistCard key={item._id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
