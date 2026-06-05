"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  createProduct,
  fetchProducts,
  resetProductState,
} from "@/app/store/slices/productSlice";
import type { CreateProductPayload } from "@/app/admin/types/product";

const initialFormState = {
  name: "",
  sku: "",
  price: "",
  discountPrice: "",
  stock: "",
  category: "",
  subCategory: "",
  collection: "",
  status: "active",
  tags: "",
  image: "",
  description: "",
  metal: "",
  gemstone: "",
  caratWeight: "",
  clarity: "",
  color: "",
};

export default function AddProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, loading, success, error } = useSelector(
    (state: RootState) => state.product,
  );
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  //   useEffect(() => {
  //     if (success) {
  //       dispatch(resetProductState());
  //       router.push("/admin/dashboard/products/allproduct");
  //     }
  //   }, [success, dispatch, router]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];
  const categories = Array.from(
    new Set(productList.map((item: any) => item.category).filter(Boolean)),
  );
  const collections = Array.from(
    new Set(productList.map((item: any) => item.collection).filter(Boolean)),
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateProductPayload = {
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      stock: Number(formData.stock),
      category: formData.category,
      subCategory: formData.subCategory,
      collection: formData.collection,
      status: formData.status,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: formData.description,
      image: formData.image,
      metal: formData.metal,
      gemstone: formData.gemstone,
      caratWeight: formData.caratWeight,
      clarity: formData.clarity,
      color: formData.color,
    };

    await dispatch(createProduct(payload))
      .unwrap()
      .catch(() => {});
  };

  return (
    <div className="min-h-screen bg-narvik px-6 py-8 text-gray-600">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[32px] border border-beige bg-white/90 p-6 shadow-xl shadow-sorrell/10 backdrop-blur-sm">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-beige p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-dark/70">
                Admin product panel
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-dark">
                Add new jewellery product
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-dark/70">
                Create a new product entry with all details, then submit it to
                the API.
              </p>
            </div>

            <div className="rounded-3xl bg-sorrell px-5 py-4 text-white shadow-lg shadow-sorrell/20">
              <p className="text-xs uppercase tracking-[0.2em] text-beige/90">
                Loaded products
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {productList.length}
              </p>
              <p className="mt-1 text-sm text-beige/90">
                fetched from API for suggestions
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.55fr_0.95fr]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-[28px] border border-beige bg-narvik p-6 shadow-sm"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Product name
                  </span>
                  <input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Seraphina Pearl Drop"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    SKU
                  </span>
                  <input
                    value={formData.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                    placeholder="JN-401"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Price
                  </span>
                  <input
                    value={formData.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    type="number"
                    min="0"
                    placeholder="21400"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Discount price
                  </span>
                  <input
                    value={formData.discountPrice}
                    onChange={(e) =>
                      updateField("discountPrice", e.target.value)
                    }
                    type="number"
                    min="0"
                    placeholder="19000"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Stock
                  </span>
                  <input
                    value={formData.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                    type="number"
                    min="0"
                    placeholder="12"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Category
                  </span>
                  <input
                    value={formData.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    list="category-list"
                    placeholder="Necklaces"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                    required
                  />
                  {categories.length > 0 && (
                    <datalist id="category-list">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Sub category
                  </span>
                  <input
                    value={formData.subCategory}
                    onChange={(e) => updateField("subCategory", e.target.value)}
                    placeholder="Pendant"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Collection
                  </span>
                  <input
                    value={formData.collection}
                    onChange={(e) => updateField("collection", e.target.value)}
                    list="collection-list"
                    placeholder="Bridal"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                  {collections.length > 0 && (
                    <datalist id="collection-list">
                      {collections.map((collection) => (
                        <option key={collection} value={collection} />
                      ))}
                    </datalist>
                  )}
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Metal
                  </span>
                  <input
                    value={formData.metal}
                    onChange={(e) => updateField("metal", e.target.value)}
                    placeholder="Gold"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Gemstone
                  </span>
                  <input
                    value={formData.gemstone}
                    onChange={(e) => updateField("gemstone", e.target.value)}
                    placeholder="Diamond"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Carat weight
                  </span>
                  <input
                    value={formData.caratWeight}
                    onChange={(e) => updateField("caratWeight", e.target.value)}
                    placeholder="1.2"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Clarity
                  </span>
                  <input
                    value={formData.clarity}
                    onChange={(e) => updateField("clarity", e.target.value)}
                    placeholder="VS1"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Color
                  </span>
                  <input
                    value={formData.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    placeholder="Champagne"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-dark">
                  Product tags
                </span>
                <input
                  value={formData.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="diamond, bridal, premium"
                  className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-dark">
                  Product image URL
                </span>
                <input
                  value={formData.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="https://example.com/product.jpg"
                  className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-dark">
                  Description
                </span>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={6}
                  placeholder="Write a short description for the product..."
                  className="w-full rounded-[28px] border border-beige bg-white px-4 py-4 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                />
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-dark/70">
                  {error
                    ? `Error: ${error}`
                    : "Fill in all required fields and submit to add the product."}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-3xl bg-sorrell px-6 py-3 text-sm font-semibold text-white transition hover:bg-dark disabled:cursor-not-allowed disabled:bg-beige/60"
                >
                  {loading ? "Saving..." : "Add Product"}
                </button>
              </div>
            </form>

            <aside className="space-y-6 rounded-[28px] border border-beige bg-narvik p-6 shadow-sm">
              <div className="rounded-3xl bg-sorrell p-5 text-white shadow-lg shadow-sorrell/20">
                <p className="text-sm uppercase tracking-[0.2em] text-beige/90">
                  Product insight
                </p>
                <p className="mt-4 text-xl font-semibold">
                  {productList.length} items
                </p>
                <p className="mt-2 text-sm leading-6 text-beige/90">
                  Loaded from the API for category and collection suggestions.
                </p>
              </div>

              <div className="space-y-4 rounded-3xl border border-beige bg-white p-5">
                <div>
                  <p className="text-sm font-medium text-dark">
                    Suggested categories
                  </p>
                  <p className="mt-3 text-sm leading-6 text-dark/70">
                    {categories.length > 0
                      ? categories.join(", ")
                      : "No categories available yet."}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-dark">
                    Suggested collections
                  </p>
                  <p className="mt-3 text-sm leading-6 text-dark/70">
                    {collections.length > 0
                      ? collections.join(", ")
                      : "No collections available yet."}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-beige bg-beige p-5 text-dark">
                <p className="text-sm font-semibold">Quick tips</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-dark/75">
                  <li>Use meaningful SKU codes.</li>
                  <li>Keep the title elegant and descriptive.</li>
                  <li>Provide a clear image URL for product preview.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
