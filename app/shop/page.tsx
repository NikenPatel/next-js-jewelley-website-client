"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlidersHorizontal } from "lucide-react";

import { AppDispatch, RootState } from "@/app/store";
import { fetchProducts } from "@/app/store/slices/productSlice";
import ShopNavbar from "../components/user/Home/navbar";
import WishlistButton from "../components/common/WishlistButton";
import FilterSidebar from "../components/user/Shop/FilterSidebar";

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
  slug?: string;
  category: string;
  collection: string;
  status: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  variants: Variant[];
}

export default function ShopPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading } = useSelector(
    (state: RootState) => state.product,
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    collections: [] as string[],
    colors: [] as string[],
    priceRange: [0, 1000000] as [number, number],
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productList: Product[] = Array.isArray(products)
    ? products
    : products?.products || [];

  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      // Category Match
      const catName =
        typeof p.category === "object" ? (p.category as any)?.name : p.category;
      if (
        filters.categories.length > 0 &&
        catName &&
        !filters.categories.includes(catName)
      )
        return false;

      // Collection Match
      const colName =
        typeof p.collection === "object"
          ? (p.collection as any)?.name
          : p.collection;
      if (
        filters.collections.length > 0 &&
        colName &&
        !filters.collections.includes(colName)
      )
        return false;

      // Variant Matches (Price & Color)
      let hasMatchingVariant = false;
      if (p.variants && Array.isArray(p.variants)) {
        for (const v of p.variants) {
          const price = v.discountPrice || v.price;
          const color = v.color?.trim().toLowerCase();

          const matchesPrice =
            price !== undefined &&
            price >= filters.priceRange[0] &&
            price <= filters.priceRange[1];
          const matchesColor =
            filters.colors.length === 0 ||
            (color && filters.colors.includes(color));

          if (matchesPrice && matchesColor) {
            hasMatchingVariant = true;
            break;
          }
        }
      } else {
        // Fallback if no variants but price filter is active
        const price = (p as any).price || 0;
        if (price > filters.priceRange[1]) return false;
        hasMatchingVariant = true;
      }

      // If variants exist but none match filters, exclude product
      if (p.variants?.length > 0 && !hasMatchingVariant) return false;

      return true;
    });
  }, [productList, filters]);

  // console.log("productList", productList[0].variants[0].images[0]);
  return (
    <>
      <ShopNavbar />
      <div className="min-h-screen bg-[#f8f5f2]">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#efe7e1] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[4px] text-[#99775c]">
                Luxury Jewelry Collection
              </p>

              <h1 className="mb-4 text-4xl font-bold leading-tight text-[#2d2d2d] md:text-5xl">
                Timeless Elegance For Every Occasion
              </h1>

              <p className="text-lg text-gray-600">
                Explore our premium handcrafted jewelry collection with elegant
                rings, necklaces, bracelets, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Products & Sidebar Section */}
        <section className="mx-auto max-w-7xl px-6 py-12 flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar
            products={productList}
            filters={filters}
            setFilters={setFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#2d2d2d]">
                  All Products
                </h2>
                <p className="mt-2 text-gray-500">
                  Discover our latest luxury jewelry pieces
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-sm border border-gray-200"
                >
                  <SlidersHorizontal size={18} className="text-[#99775c]" />
                  <span className="text-sm font-medium text-gray-700">
                    Filters
                  </span>
                </button>
                <div className="rounded-full bg-white px-5 py-2 shadow-sm border border-gray-100 hidden md:block">
                  <span className="text-sm font-medium text-[#99775c]">
                    {filteredProducts.length} Products
                  </span>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ddd0c8] border-t-[#99775c]" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const firstVariant = product.variants?.[0];
                  // console.log("firstVariant", product.variants[0].images[0]);
                  const productId =
                    product._id ?? product.sku ?? product.slug ?? null;

                  return (
                    <div
                      key={product._id}
                      className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100"
                    >
                      <div className="relative h-72 overflow-hidden bg-[#f3ece7]">
                        {product &&
                        product.variants &&
                        product.variants[0]?.images ? (
                          <Image
                            src={(product as any).variants[0].images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-gray-400">
                              No Image Available
                            </span>
                          </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-[#99775c] backdrop-blur-sm">
                          {typeof product.category === "object"
                            ? (product.category as any)?.name
                            : product.category}
                        </div>
                        <div className="absolute right-4 top-4 rounded-full bg-white px-2 py-2 text-xs font-medium text-black shadow-sm">
                          <WishlistButton product={product} />
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="line-clamp-1 text-lg font-semibold text-[#2d2d2d]">
                            {product.name}
                          </h3>
                        </div>

                        <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500">
                          {product.description}
                        </p>

                        <div className="mb-5 space-y-1 rounded-2xl bg-[#f8f5f2] p-4 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              Metal:
                            </span>
                            <span>{firstVariant?.metal || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              Gemstone:
                            </span>
                            <span>{firstVariant?.gemstone || "N/A"}</span>
                          </div>
                        </div>

                        <div className="mb-5 flex items-end gap-3">
                          <span className="text-2xl font-bold text-[#99775c]">
                            ₹
                            {firstVariant?.discountPrice ||
                              firstVariant?.price ||
                              0}
                          </span>

                          {firstVariant?.discountPrice &&
                            firstVariant?.discountPrice <
                              firstVariant?.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{firstVariant?.price}
                              </span>
                            )}
                        </div>

                        <div className="flex gap-3 mt-auto">
                          {productId ? (
                            <Link
                              href={`/shop/products/${productId}`}
                              className="flex-1 rounded-xl bg-[#99775c] px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-[#7e6049]"
                            >
                              View Details
                            </Link>
                          ) : (
                            <span className="flex-1 rounded-xl bg-[#ccc] px-4 py-3 text-center text-sm font-medium text-white/80">
                              View Details
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl bg-white shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <SlidersHorizontal size={32} className="text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#2d2d2d]">
                  No Products Found
                </h3>
                <p className="text-gray-500 max-w-sm">
                  We couldn't find any products matching your current filters.
                  Try clearing some filters to see more results.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      categories: [],
                      collections: [],
                      colors: [],
                      priceRange: [0, 1000000],
                    })
                  }
                  className="mt-6 px-6 py-2 bg-[#f8f5f2] text-[#99775c] font-medium rounded-full hover:bg-[#efe7e1] transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
