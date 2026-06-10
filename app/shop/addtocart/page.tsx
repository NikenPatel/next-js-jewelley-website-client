"use client";

import { useEffect } from "react";
import Image from "next/image";

import {
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/app/store/slices/cartSlice";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const handleIncrease = (itemId: string, quantity: number) => {
    dispatch(
      updateCartItem({
        itemId,
        quantity: quantity + 1,
      }),
    );
  };

  const handleDecrease = (itemId: string, quantity: number) => {
    if (quantity <= 1) return;

    dispatch(
      updateCartItem({
        itemId,
        quantity: quantity - 1,
      }),
    );
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <div className="mx-auto max-w-6xl p-5">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <div>Your cart is empty</div>
      ) : (
        <>
          <div className="space-y-5">
            {items.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  {/* IMAGE */}
                  <div className="relative h-24 w-24 overflow-hidden rounded border">
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
                      alt={item.productId?.name || "Product Image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.productId?.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      SKU: {item.productId?.sku}
                    </p>

                    <p className="text-sm text-gray-500">₹{item.price}</p>

                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  {/* Quantity Buttons */}
                  <div className="flex items-center gap-3 rounded border px-3 py-1">
                    <button
                      onClick={() => handleDecrease(item._id, item.quantity)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(item._id, item.quantity)}
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="w-24 text-right font-bold">
                    ₹{item.price * item.quantity}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="mt-10 rounded-lg border p-5">
            <div className="mb-3 flex justify-between">
              <span>Total Quantity</span>
              <span>{totalQuantity}</span>
            </div>

            <div className="mb-5 flex justify-between text-xl font-bold">
              <span>Total Price</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              onClick={() => dispatch(clearCart())}
              className="rounded bg-red-500 px-5 py-2 text-white"
            >
              Clear Cart
            </button>
            <Link
              href="/shop"
              className="rounded-lg border border-[#99775c] px-4 py-2 text-sm font-medium text-[#99775c] transition hover:bg-[#f3ece7]"
            >
              Back to shop
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
