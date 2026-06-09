"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchProducts } from "@/app/store/slices/productSlice";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";

const BestSellerSection = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.product as any,
  );

  console.log(products, "products");

  useEffect(() => {
    void dispatch(fetchProducts());
  }, [dispatch]);

  const bestSellers = useMemo(() => {
    if (!Array.isArray(products.products) || products.length === 0) {
      return [];
    }

    const filtered = products.products.filter(
      (product: any) =>
        product.isBestSeller ||
        product.isPopular ||
        product.featured ||
        product.rating >= 4.5,
    );

    return filtered.length > 0 ? filtered.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  return (
    <section id="shop" className="py-20 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Best Sellers"
          title="Beloved Pieces, Beautifully Made"
        />

        {loading && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 mt-12">
            Loading bestselling products...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700 mt-12">
            {error}
          </div>
        )}

        {!loading && !error && bestSellers.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 mt-12">
            No bestseller products found.
          </div>
        )}

        {!loading && !error && bestSellers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {bestSellers.map((product: any) => (
              <ProductCard
                key={product._id ?? product.sku ?? product.name}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellerSection;
