"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import { fetchProductById } from "@/app/store/slices/productSlice";

import AddToCartButton from "@/app/components/user/Home/AddToCartButton";
import ShopNavbar from "@/app/components/user/Home/navbar";

export default function ProductPage() {
  const dispatch = useAppDispatch();

  const params = useParams();

  const id = params.id as string;

  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product as any,
  );

  useEffect(() => {
    if (id) {
      void dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const product = selectedProduct?.product || selectedProduct;

  const firstVariant = Array.isArray(product?.variants)
    ? product.variants[0]
    : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading Product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-xl rounded-xl border bg-white p-8 text-center shadow">
          <h2 className="mb-2 text-2xl font-semibold">Product not found</h2>

          <p className="mb-4 text-sm text-gray-600">
            We couldn't find this product.
          </p>

          <Link
            href="/shop"
            className="text-sm font-medium text-[#D4AF37] hover:underline"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ShopNavbar />
      <main className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow">
          <div className="grid gap-8 md:grid-cols-2">
            {/* IMAGE */}

            <div className="rounded-lg bg-[#f8f5f2] p-4">
              {firstVariant?.images?.length > 0 ? (
                <img
                  src={firstVariant.images[0]}
                  alt={product.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* INFO */}

            <div>
              <h1 className="text-3xl font-bold text-[#2d2d2d]">
                {product.name}
              </h1>

              <p className="mt-2 text-sm text-gray-600">{product.collection}</p>

              <p className="mt-1 text-xs text-gray-500">SKU: {product.sku}</p>

              <div className="mt-6 space-y-4">
                <p className="leading-relaxed text-gray-700">
                  {product.description}
                </p>

                {/* PRICE */}

                <div className="rounded-2xl bg-[#f8f5f2] p-4">
                  <p className="text-lg font-semibold text-[#99775c]">
                    ₹
                    {firstVariant?.discountPrice ||
                      firstVariant?.price ||
                      "Price on request"}
                  </p>

                  {firstVariant?.discountPrice &&
                    firstVariant?.discountPrice < firstVariant?.price && (
                      <p className="text-sm text-gray-400 line-through">
                        ₹{firstVariant?.price}
                      </p>
                    )}
                </div>

                {/* VARIANT DETAILS */}

                {firstVariant && (
                  <div className="space-y-2 rounded-lg bg-[#efe7e1] p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Metal:</strong> {firstVariant.metal || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      <strong>Gemstone:</strong>{" "}
                      {firstVariant.gemstone || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      <strong>Carat Weight:</strong>{" "}
                      {firstVariant.caratWeight || "N/A"}
                    </p>

                    {firstVariant.clarity && (
                      <p className="text-sm text-gray-600">
                        <strong>Clarity:</strong> {firstVariant.clarity}
                      </p>
                    )}

                    {firstVariant.color && (
                      <p className="text-sm text-gray-600">
                        <strong>Color:</strong> {firstVariant.color}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      <strong>Stock:</strong> {firstVariant.stock}
                    </p>
                  </div>
                )}
              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex gap-3">
                <Link
                  href="/shop"
                  className="rounded-lg border border-[#99775c] px-4 py-2 text-sm font-medium text-[#99775c] transition hover:bg-[#f3ece7]"
                >
                  Back to shop
                </Link>

                <div className="flex-1">
                  <AddToCartButton
                    productId={product._id}
                    variantId={
                      firstVariant?.variantId || firstVariant?._id || "default"
                    }
                    stock={firstVariant?.stock || 1}
                    price={
                      firstVariant?.discountPrice || firstVariant?.price || 0
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
