"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/app/store";
import { fetchProducts } from "@/app/store/slices/productSlice";
import ShopNavbar from "../components/user/Home/navbar";
import WishlistButton from "../components/ui/WishlistButton";

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

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productList: Product[] = Array.isArray(products)
    ? products
    : products?.products || [];

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

        {/* Products Section */}
        <section className="mx-auto max-w-7xl px-6 py-12">
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

            <div className="rounded-full bg-white px-5 py-2 shadow-sm">
              <span className="text-sm font-medium text-[#99775c]">
                {productList.length} Products
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-75 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ddd0c8] border-t-[#99775c]" />
            </div>
          ) : productList.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productList.map((product) => {
                const firstVariant = product.variants?.[0];
                // console.log("firstVariant", product.variants[0].images[0]);
                const productId =
                  product._id ?? product.sku ?? product.slug ?? null;

                return (
                  <div
                    key={product._id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative h-80 overflow-hidden bg-[#f3ece7]">
                      {product ? (
                        <Image
                          src={product.variants[0].images[0]}
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
                        {product.category}
                      </div>
                      <div className="absolute right-4 top-4 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-black">
                        <WishlistButton product={product} />
                        {/* {product.status} */}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="line-clamp-1 text-lg font-semibold text-[#2d2d2d]">
                          {product.name}
                        </h3>

                        <span className="text-xs text-gray-400">
                          {product.collection}
                        </span>
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {product.description}
                      </p>

                      <div className="mb-5 space-y-1 rounded-2xl bg-[#f8f5f2] p-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Metal:</span>{" "}
                          {firstVariant?.metal || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Gemstone:</span>{" "}
                          {firstVariant?.gemstone || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Carat:</span>{" "}
                          {firstVariant?.caratWeight || "N/A"}
                        </p>
                      </div>

                      <div className="mb-5 flex items-end gap-3">
                        <span className="text-2xl font-bold text-[#99775c]">
                          ₹{firstVariant?.discountPrice || firstVariant?.price}
                        </span>

                        {firstVariant?.discountPrice &&
                          firstVariant?.discountPrice < firstVariant?.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{firstVariant?.price}
                            </span>
                          )}
                      </div>

                      {product.tags?.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-2">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[#efe7e1] px-3 py-1 text-xs text-[#99775c]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3">
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

                        {/* <Link
                          href={`/shop/wishlist`}
                          className="rounded-xl border border-[#ddd0c8] px-4 py-3 text-sm font-medium text-[#99775c] transition hover:bg-[#f3ece7]"
                        >
                          Wishlist
                        </Link> */}
                        {/* <WishlistButton product={product} /> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-3xl bg-white shadow-sm">
              <h3 className="mb-2 text-2xl font-semibold text-[#2d2d2d]">
                No Products Found
              </h3>
              <p className="text-gray-500">
                Products will appear here once added.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
