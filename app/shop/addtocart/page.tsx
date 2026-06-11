"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/app/store/slices/cartSlice";

import { placeOrder } from "@/app/store/slices/orderSlice";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

export default function CartPage() {
  const dispatch = useAppDispatch();

  const [showModal, setShowModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const { items, loading } = useAppSelector((state) => state.cart);

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

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

  const handlePlaceOrder = () => {
    // Validate required address fields
    const requiredFields = [
      "fullName",
      "mobile",
      "addressLine1",
      "city",
      "state",
      "country",
      "pincode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !address[field as keyof typeof address]?.trim(),
    );

    if (missingFields.length > 0) {
      alert(
        `Please fill in all required shipping address fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    dispatch(
      placeOrder({
        address,
        paymentMethod,
      }),
    )
      .unwrap()
      .then((order) => {
        setOrderInfo(order);
        setShowModal(true);

        // Refresh cart after order
        dispatch(getCart());
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="mx-auto w-screen h-screen p-5n text-gray-700 bg-[#f8f5f2] ">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <>
          <div>Your cart is empty</div>
          <Link
            href="/shop"
            className="rounded-lg border border-[#99775c] px-4 py-2 text-sm font-medium text-[#99775c] transition hover:bg-[#f3ece7]"
          >
            Back to Shop
          </Link>
        </>
      ) : (
        <>
          {/* CART ITEMS */}
          <div className="space-y-5">
            {items.map((item: any) => {
              const itemVariant = item.productId?.variants?.find(
                (v: any) => v.variantId === item.variantId,
              );
              const itemImage =
                itemVariant?.images?.[0] ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80";

              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* IMAGE */}
                    <div className="relative h-24 w-24 overflow-hidden rounded border">
                      <img
                        src={itemImage}
                        alt={item.productId?.name || "Product Image"}
                        className="h-full w-full object-cover"
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
                    {/* Quantity */}
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

                    {/* TOTAL */}
                    <div className="w-24 text-right font-bold">
                      ₹{item.price * item.quantity}
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="mt-10 rounded-lg border p-5">
            {/* ADDRESS FORM */}
            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>

            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    fullName: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="Mobile"
                value={address.mobile}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    mobile: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="Address Line 1"
                value={address.addressLine1}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    addressLine1: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="Address Line 2"
                value={address.addressLine2}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    addressLine2: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    city: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    state: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    country: e.target.value,
                  })
                }
                className="rounded border p-2"
              />

              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    pincode: e.target.value,
                  })
                }
                className="rounded border p-2"
              />
            </div>

            {/* PAYMENT METHOD */}
            <div className="mb-5">
              <label className="mb-2 block font-medium">Payment Method</label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="rounded border p-2"
              >
                <option value="COD">Cash on Delivery</option>

                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            {/* TOTALS */}
            <div className="mb-3 flex justify-between">
              <span>Total Quantity</span>
              <span>{totalQuantity}</span>
            </div>

            <div className="mb-5 flex justify-between text-xl font-bold">
              <span>Total Price</span>
              <span>₹{totalPrice}</span>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => dispatch(clearCart())}
                className="rounded bg-red-500 px-5 py-2 text-white"
              >
                Clear Cart
              </button>

              <button
                onClick={handlePlaceOrder}
                className="rounded bg-green-600 px-5 py-2 text-white"
              >
                Buy Now
              </button>

              <Link
                href="/shop"
                className="rounded-lg border border-[#99775c] px-4 py-2 text-sm font-medium text-[#99775c] transition hover:bg-[#f3ece7]"
              >
                Back to Shop
              </Link>
            </div>
          </div>

          {/* ORDER SUCCESS MODAL */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-lg bg-white p-6">
                <h2 className="mb-4 text-2xl font-bold text-green-600">
                  Order Placed Successfully 🎉
                </h2>

                <p className="mb-2">Your order has been placed successfully.</p>

                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 rounded bg-black px-5 py-2 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
