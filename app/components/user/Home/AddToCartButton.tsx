"use client";

import React, { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { useSelector } from "react-redux";
import { addToCart } from "@/app/store/slices/cartSlice";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  variantId: string;
  stock?: number;
  price?: number;
}

export default function AddToCartButton({
  productId,
  variantId,
  stock = 1,
  price = 0,
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const { loading, error, message, success } = useSelector(
    (state: any) => state.cart,
  );
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
  const handleAddToCart = async () => {
    if (quantity > stock) {
      alert(`Only ${stock} items available in stock`);
      return;
    }

    const result = await dispatch(
      addToCart({
        productId,
        variantId,
        quantity,
      }),
    );

    if (result.type === addToCart.fulfilled.type) {
      setShowMessage(true);
      setQuantity(1);
      setTimeout(() => setShowMessage(false), 3000);
    }
    router.push("/shop/addtocart");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100"
            disabled={loading}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-12 text-center border-x border-gray-300 py-2"
            disabled={loading}
          />
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            className="px-3 py-2 hover:bg-gray-100"
            disabled={loading}
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-600">{stock} in stock</span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading || stock === 0}
        className="w-full rounded-lg bg-[#99775c] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7e6049] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding to cart..." : "Add to cart"}
      </button>

      {showMessage && success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          ✓ {message || "Item added to cart successfully!"}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          ✗ {error}
        </div>
      )}
    </div>
  );
}
