"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import { fetchCategories } from "@/app/store/slices/categorySlice";

import { fetchSubcategorybyCategoryId } from "@/app/store/slices/subcategorySlice";

import { createProduct, fetchProducts } from "@/app/store/slices/productSlice";
import { uploadImage } from "@/app/utils/uploadImage";
import { FaUpload, FaSync, FaTimes } from "react-icons/fa";

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
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
          alert(`File ${files[i].name} exceeds 5MB limit.`);
          continue;
        }
        const url = await uploadImage(files[i]);
        urls.push(url);
      }
      
      const currentImages = formData.images ? formData.images.split(",").map(i => i.trim()).filter(Boolean) : [];
      const newImages = [...currentImages, ...urls].join(", ");
      updateField("images", newImages);
    } catch (error) {
      alert("Failed to upload image(s).");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const currentImages = formData.images.split(",").map(i => i.trim()).filter(Boolean);
    const newImages = currentImages.filter((_, idx) => idx !== indexToRemove).join(", ");
    updateField("images", newImages);
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
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Metal
              </label>
              <input
                type="text"
                placeholder="Metal"
                value={formData.metal}
                onChange={(e) => updateField("metal", e.target.value)}
                className="rounded-xl border p-4 m-4"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Gemstone
              </label>
              <input
                type="text"
                placeholder="Gemstone"
                value={formData.gemstone}
                onChange={(e) => updateField("gemstone", e.target.value)}
                className="rounded-xl border p-4"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Carat Weight
              </label>
              <input
                type="number"
                placeholder="Carat Weight"
                value={formData.caratWeight}
                onChange={(e) => updateField("caratWeight", e.target.value)}
                className="rounded-xl border p-4"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Clarity
              </label>
              <input
                type="text"
                placeholder="Clarity"
                value={formData.clarity}
                onChange={(e) => updateField("clarity", e.target.value)}
                className="rounded-xl border p-4"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Color
              </label>
              <input
                type="text"
                placeholder="Color"
                value={formData.color}
                onChange={(e) => updateField("color", e.target.value)}
                className="rounded-xl border p-4"
              />
            </div>
          </div>

          {/* PRICE */}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="rounded-xl border p-4"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Discount Price (₹)
              </label>
              <input
                type="number"
                placeholder="Discount Price"
                value={formData.discountPrice}
                onChange={(e) => updateField("discountPrice", e.target.value)}
                className="rounded-xl border p-4"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">
                Stock
              </label>
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className="rounded-xl border p-4"
              />
            </div>
          </div>

          {/* IMAGES */}

          <div>
            <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
              Product Images
            </label>
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 hover:bg-gray-100 transition">
                {isUploading ? (
                  <FaSync className="animate-spin text-3xl text-gray-400 mb-2" />
                ) : (
                  <FaUpload className="text-3xl text-gray-400 mb-2" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {isUploading ? "Uploading..." : "Click to upload images"}
                </span>
                <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>

              {formData.images && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {formData.images.split(",").map(i => i.trim()).filter(Boolean).map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="h-24 w-24 rounded-lg object-cover border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
            disabled={loading || isUploading}
            className="rounded-xl bg-black px-8 py-4 text-white disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
