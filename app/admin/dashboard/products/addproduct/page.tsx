"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import { fetchCategories } from "@/app/store/slices/categorySlice";

import { fetchSubcategorybyCategoryId } from "@/app/store/slices/subcategorySlice";

import { createProduct, fetchProducts } from "@/app/store/slices/productSlice";

const initialFormState = {
  name: "",
  sku: "",
  description: "",

  category: "",
  subCategory: "",
  collection: "",

  metal: "",
  gemstone: "",
  caratWeight: "",
  clarity: "",
  color: "",

  price: "",
  discountPrice: "",
  stock: "",

  images: "",

  engravingAllowed: false,
  maxChars: "",
  additionalCost: "",

  ringSizes: "",

  isFeatured: false,
  isTrending: false,
  isBestSeller: false,

  status: "active",

  seoTitle: "",
  seoDescription: "",
};

export default function AddProductPage() {
  const dispatch = useAppDispatch();

  const { products, loading, error } = useAppSelector((state) => state.product);

  const { categories: apiCategories } = useAppSelector(
    (state) => state.category,
  );

  const { subcategories: apiSubcategories } = useAppSelector(
    (state) => state.subcategory,
  );

  const [formData, setFormData] = useState(initialFormState);

  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubcategorybyCategoryId({ categoryId }));
    }
  }, [dispatch, categoryId]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  const categoriesData = Array.isArray(apiCategories?.data)
    ? apiCategories.data
    : [];

  const categories = categoriesData.map((category: any) => category.name);

  const subCategories = Array.isArray(apiSubcategories?.data)
    ? apiSubcategories.data.map((subcategory: any) => subcategory.name)
    : [];

  const collections = Array.from(
    new Set(productList.map((item: any) => item.collection).filter(Boolean)),
  );

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const selected = categoriesData.find(
      (category: any) => category.name === value,
    );

    setCategoryId(selected?._id || "");

    setFormData((prev) => ({
      ...prev,
      category: value,
      subCategory: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(formData.discountPrice) > Number(formData.price)) {
      alert("Discount price cannot be greater than price");
      return;
    }

    const payload = {
      name: formData.name,

      sku: formData.sku,

      description: formData.description,

      category: formData.category,

      subCategory: formData.subCategory,

      collection: formData.collection,

      variants: [
        {
          variantId: crypto.randomUUID(),

          metal: formData.metal,

          caratWeight: Number(formData.caratWeight),

          gemstone: formData.gemstone,

          clarity: formData.clarity,

          color: formData.color,

          price: Number(formData.price),

          discountPrice: Number(formData.discountPrice),

          stock: Number(formData.stock),

          images: formData.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean),
        },
      ],

      customizationOptions: {
        engraving: {
          allowed: formData.engravingAllowed,

          maxChars: Number(formData.maxChars),

          additionalCost: Number(formData.additionalCost),
        },

        ringSizes: formData.ringSizes
          .split(",")
          .map((size) => Number(size.trim()))
          .filter(Boolean),
      },

      isFeatured: formData.isFeatured,

      isTrending: formData.isTrending,

      isBestSeller: formData.isBestSeller,

      status: formData.status,

      seoTitle: formData.seoTitle,

      seoDescription: formData.seoDescription,
    };

    try {
      await dispatch(createProduct(payload)).unwrap();

      alert("Product added successfully");

      setFormData(initialFormState);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700 p-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold">Add Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PRODUCT INFO */}

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="rounded-xl border p-4"
              required
            />

            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              className="rounded-xl border p-4"
              required
            />
          </div>

          <textarea
            placeholder="Description"
            rows={5}
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          {/* CATEGORY */}

          <div className="grid gap-6 md:grid-cols-3">
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-xl border p-4"
              required
            >
              <option value="">Select Category</option>

              {categories.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={formData.subCategory}
              onChange={(e) => updateField("subCategory", e.target.value)}
              className="rounded-xl border p-4"
              required
            >
              <option value="">Select Subcategory</option>

              {subCategories.map((subcategory: any) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Collection"
              value={formData.collection}
              onChange={(e) => updateField("collection", e.target.value)}
              list="collections"
              className="rounded-xl border p-4"
            />

            <datalist id="collections">
              {collections.map((collection: any) => (
                <option key={collection} value={collection} />
              ))}
            </datalist>
          </div>

          {/* VARIANT */}

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Metal"
              value={formData.metal}
              onChange={(e) => updateField("metal", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Gemstone"
              value={formData.gemstone}
              onChange={(e) => updateField("gemstone", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="number"
              placeholder="Carat Weight"
              value={formData.caratWeight}
              onChange={(e) => updateField("caratWeight", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Clarity"
              value={formData.clarity}
              onChange={(e) => updateField("clarity", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Color"
              value={formData.color}
              onChange={(e) => updateField("color", e.target.value)}
              className="rounded-xl border p-4"
            />
          </div>

          {/* PRICE */}

          <div className="grid gap-6 md:grid-cols-3">
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="rounded-xl border p-4"
              required
            />

            <input
              type="number"
              placeholder="Discount Price"
              value={formData.discountPrice}
              onChange={(e) => updateField("discountPrice", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              className="rounded-xl border p-4"
            />
          </div>

          {/* IMAGES */}

          <input
            type="text"
            placeholder="/uploads/ring1.jpg, /uploads/ring2.jpg"
            value={formData.images}
            onChange={(e) => updateField("images", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          {/* CUSTOMIZATION */}

          <div className="grid gap-6 md:grid-cols-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.engravingAllowed}
                onChange={(e) =>
                  updateField("engravingAllowed", e.target.checked)
                }
              />
              Engraving Allowed
            </label>

            <input
              type="number"
              placeholder="Max Chars"
              value={formData.maxChars}
              onChange={(e) => updateField("maxChars", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="number"
              placeholder="Additional Cost"
              value={formData.additionalCost}
              onChange={(e) => updateField("additionalCost", e.target.value)}
              className="rounded-xl border p-4"
            />
          </div>

          {/* RING SIZES */}

          <input
            type="text"
            placeholder="Ring Sizes (6,7,8,9)"
            value={formData.ringSizes}
            onChange={(e) => updateField("ringSizes", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          {/* FLAGS */}

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
              />
              Featured
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => updateField("isTrending", e.target.checked)}
              />
              Trending
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => updateField("isBestSeller", e.target.checked)}
              />
              Best Seller
            </label>
          </div>

          {/* STATUS */}

          <select
            value={formData.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="w-full rounded-xl border p-4"
          >
            <option value="active">Active</option>

            <option value="inactive">Inactive</option>

            <option value="draft">Draft</option>
          </select>

          {/* SEO */}

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="SEO Title"
              value={formData.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="SEO Description"
              value={formData.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              className="rounded-xl border p-4"
            />
          </div>

          {/* ERROR */}

          {error && <p className="text-red-500">{error}</p>}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-8 py-4 text-white"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
