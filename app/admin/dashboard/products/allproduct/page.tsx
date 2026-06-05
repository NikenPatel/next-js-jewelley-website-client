"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchProducts,
  resetProductState,
} from "@/app/store/slices/productSlice";
// import { RootState } from "@reduxjs/toolkit/query";
// import type { AppDispatch, RootState } from "@/store/store";

interface Variant {
  _id: string;
  variantId: string;
  metal: string;
  gemstone: string;
  caratWeight: string;
  clarity: string;
  color: string;
  price: number;
  discountPrice: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  collection: string;
  status: string;
  description: string;
  tags: string[];
  variants: Variant[];
  customizationOptions?: {
    engraving?: {
      allowed: boolean;
      additionalCost: number;
    };
    ringSizes?: string[];
  };
}

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { products, loading, success, error } = useSelector(
    (state: RootState) => state.product,
  );
  console.log("Products from Redux:", products);
  console.log(Array.isArray(products));
  console.log(products?.products);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // const productList: Product[] = products.length > 0 ? products : [];
  const productList = products?.products || [];

  const redirectAddproductPage = () => {
    router.push("/admin/dashboard/products/addproduct");
    if (success) {
      dispatch(resetProductState());
    }
  };
  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-600">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#323232]">All Products</h1>

        <button
          onClick={redirectAddproductPage}
          className="rounded-lg bg-[#99775c] px-5 py-2 text-white"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-[#ddd0c8] text-[#323232]">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Collection</th>
              <th className="p-3">Status</th>
              <th className="p-3">Variants</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading products...
                </td>
              </tr>
            ) : products?.products?.length > 0 ? (
              productList.map((product: any, key: any) => (
                <Fragment key={product._id}>
                  <tr key={product._id} className="border-t hover:bg-[#f3ece7]">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{product.name}</p>

                        <p className="text-xs text-[#99775c]">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </td>

                    <td className="p-3 text-center">{product.category}</td>

                    <td className="p-3 text-center">{product.collection}</td>

                    <td className="p-3 text-center">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {product.variants?.length || 0}
                    </td>

                    <td className="flex justify-center gap-2 p-3">
                      <button
                        onClick={() =>
                          setExpanded(
                            expanded === product._id ? null : product._id,
                          )
                        }
                        className="text-[#99775c]"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/products/editproduct/${product._id}`,
                          )
                        }
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expanded === product._id && (
                    <tr className="bg-[#f3ece7]">
                      <td colSpan={6} className="p-4">
                        <p className="mb-2 text-sm">
                          <strong>Description:</strong> {product.description}
                        </p>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                          <div className="mb-3">
                            <strong className="text-sm">Tags:</strong>

                            {product.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="ml-2 rounded bg-[#ddd0c8] px-2 py-1 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Variants */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {product.variants?.map((variant: any) => (
                            <div
                              key={variant._id}
                              className="rounded-lg border bg-white p-4"
                            >
                              <p className="mb-1 font-semibold">
                                Variant: {variant.variantId}
                              </p>

                              <p className="text-sm">Metal: {variant.metal}</p>

                              <p className="text-sm">
                                Gemstone: {variant.gemstone}
                              </p>

                              <p className="text-sm">
                                Carat: {variant.caratWeight}
                              </p>

                              <p className="text-sm">
                                Clarity: {variant.clarity}
                              </p>

                              <p className="text-sm">Color: {variant.color}</p>

                              <p className="text-sm">Price: ₹{variant.price}</p>

                              <p className="text-sm">
                                Discount: ₹{variant.discountPrice}
                              </p>

                              <p className="text-sm">Stock: {variant.stock}</p>
                            </div>
                          ))}
                        </div>

                        {/* Customization */}
                        <div className="mt-4 text-sm">
                          <strong>Engraving:</strong>{" "}
                          {product.customizationOptions?.engraving?.allowed
                            ? `Yes (₹${product.customizationOptions.engraving.additionalCost})`
                            : "No"}
                        </div>

                        <div className="text-sm">
                          <strong>Ring Sizes:</strong>{" "}
                          {product.customizationOptions?.ringSizes?.join(
                            ", ",
                          ) || "N/A"}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
