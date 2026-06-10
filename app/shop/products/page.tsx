"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchProductById,
  fetchProducts,
} from "@/app/store/slices/productSlice";
import ProductCard from "../../components/user/Home/ProductCard";
import { useParams } from "next/navigation";
import ShopNavbar from "@/app/components/user/Home/navbar";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.product as any,
  );
  const params = useParams();
  const id = params.id as string;
  console.log(id, "params");

  useEffect(() => {
    void dispatch(fetchProductById(id));
  }, [dispatch]);

  return (
    <>
      <ShopNavbar />
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Shop Collection
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">
                Discover Our Finest Jewelry
              </h1>
            </div>

            <div className="rounded-3xl bg-white px-4 py-3 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Products loaded</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {products?.length ?? 0}
              </p>
            </div>
          </div>
          {loading && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Loading products...
            </div>
          )}
          {error && !loading && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && (!products || products.length === 0) && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No products available at the moment.
            </div>
          )}
          {!loading && !error && products && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: any) => (
                <ProductCard
                  key={product._id ?? product.sku ?? product.name}
                  product={product}
                />
              ))}
              ----
            </div>
          )}
          --====
        </div>
      </main>
    </>
  );
};

export default ProductsPage;
