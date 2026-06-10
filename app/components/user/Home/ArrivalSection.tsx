"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchProducts } from "@/app/store/slices/productSlice";
import QuickViewModal from "./QuickViewModal";
import SectionTitle from "./SectionTitle";
import AddToCartButton from "./AddToCartButton";

const ArrivalSection = ({ quickView, setQuickView }: any) => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.product as any,
  );

  useEffect(() => {
    void dispatch(fetchProducts());
  }, [dispatch]);

  const latestProducts = useMemo(() => {
    if (!Array.isArray(products.products)) return [];

    const sorted = [...products.products].sort((a: any, b: any) => {
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

    return sorted.slice(0, 4);
  }, [products]);
  console.log(latestProducts, "latestProducts");
  return (
    <>
      <section id="new-arrivals" className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="New Arrivals" title="Fresh From The Atelier" />

          {loading && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 mt-12">
              Loading latest arrivals...
            </div>
          )}

          {error && !loading && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700 mt-12">
              {error}
            </div>
          )}

          {!loading && !error && latestProducts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 mt-12">
              No new arrivals available.
            </div>
          )}

          {!loading && !error && latestProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {latestProducts.map((product: any) => {
                const firstVariant = Array.isArray(product.variants)
                  ? product.variants[0]
                  : null;

                return (
                  <article
                    key={product._id ?? product.name}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/500x500?text=No+Image"
                        }
                        alt={product.name || "New arrival"}
                        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                      />

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <button
                          onClick={() => setQuickView(product)}
                          className="px-5 py-2 bg-white text-black rounded-lg font-medium"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name || "Untitled"}
                      </h3>

                      <p className="mt-2 text-xl font-bold text-[#D4AF37]">
                        {typeof product.price === "number"
                          ? `Rs. ${product.price}`
                          : product.price || "Price on request"}
                      </p>

                      <div className="flex-1">
                        <AddToCartButton
                          productId={product._id}
                          variantId={
                            firstVariant?.variantId ||
                            firstVariant?._id ||
                            product._id
                          }
                          stock={firstVariant?.stock ?? 1}
                          price={
                            firstVariant?.discountPrice ||
                            firstVariant?.price ||
                            product.price
                          }
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {quickView && (
        <QuickViewModal
          product={quickView}
          onClose={() => setQuickView(null)}
        />
      )}
    </>
  );
};

export default ArrivalSection;
