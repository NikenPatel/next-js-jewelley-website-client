"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchProductById,
  resetProductState,
  updateProduct,
} from "@/app/store/slices/productSlice";
import { fetchCategories } from "@/app/store/slices/categorySlice";
import { fetchSubcategorybyCategoryId } from "@/app/store/slices/subcategorySlice";
import { uploadImage } from "@/app/utils/uploadImage";
import { FaUpload, FaSync, FaTimes } from "react-icons/fa";

interface Variant {
  variantId: string;
  metal: string;
  caratWeight: number;
  gemstone: string;
  clarity: string;
  color: string;
  price: number;
  costPrice: number;
  discountPrice: number;
  stock: number;
  images: string[];
}

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  category: string;
  subCategory: string;
  collection: string;
  brand: string;

  tags: string[];

  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;

  status: string;

  seoTitle: string;
  seoDescription: string;

  variants: Variant[];

  customizationOptions: {
    engraving: {
      allowed: boolean;
      maxChars: number;
      additionalCost: number;
    };
    ringSizes: number[];
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const id = params.id as string;
  const { selectedProduct, loading, success, error } = useSelector(
    (state: RootState) => state.product,
  );
  const { categories: apiCategories } = useSelector(
    (state: RootState) => state.category,
  );
  const { subcategories: apiSubcategories } = useSelector(
    (state: RootState) => state.subcategory,
  );
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    sku: "",
    description: "",
    category: "",
    subCategory: "",
    collection: "",
    brand: "",

    tags: [],

    isFeatured: false,
    isTrending: false,
    isBestSeller: false,

    status: "active",

    seoTitle: "",
    seoDescription: "",

    variants: [],

    customizationOptions: {
      engraving: {
        allowed: false,
        maxChars: 0,
        additionalCost: 0,
      },
      ringSizes: [],
    },
  });
  const [categoryId, setCategoryId] = useState("");
  const [isUploading, setIsUploading] = useState<number | null>(null);

  const categoriesData = Array.isArray(apiCategories)
    ? apiCategories
    : Array.isArray(apiCategories?.data)
    ? apiCategories.data
    : [];

  const categories = categoriesData.map((category: any) => category.name);

  const subCategories = Array.isArray(apiSubcategories)
    ? apiSubcategories.map((subcategory: any) => subcategory.name)
    : Array.isArray(apiSubcategories?.data)
    ? apiSubcategories.data.map((subcategory: any) => subcategory.name)
    : [];

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

  console.log(selectedProduct, "selectedProduct", formData);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct.product);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (formData.category && categoriesData.length > 0) {
      const selected = categoriesData.find(
        (category: any) => category.name === formData.category,
      );
      if (selected && selected._id !== categoryId) {
        setCategoryId(selected._id);
      }
    }
  }, [formData.category, categoriesData, categoryId]);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubcategorybyCategoryId({ categoryId }));
    }
  }, [dispatch, categoryId]);

  //   const getProduct = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/get-product/${id}`,
  //       );

  //       const product = response.data.product;

  //       setFormData(product);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(variantIndex);
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
      
      const updated = [...formData.variants];
      const currentImages = updated[variantIndex].images || [];
      updated[variantIndex] = {
        ...updated[variantIndex],
        images: [...currentImages, ...urls],
      };
      setFormData({ ...formData, variants: updated });
    } catch (error) {
      alert("Failed to upload image(s).");
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        updateProduct({
          productId: id,
          data: formData as any,
        }),
      ).unwrap();
      if (success) {
        alert("Product updated Successfully");
        dispatch(resetProductState());
      }
      if (error) {
        alert(error);
        dispatch(resetProductState());
      }

      router.push("/admin/dashboard/products/allproduct");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading Product...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-600">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>

        {/* Basic Info */}

        <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Product Name"
            className="rounded border p-3"
          />

          <input
            name="sku"
            value={formData.sku || ""}
            onChange={handleChange}
            placeholder="SKU"
            className="rounded border p-3"
          />

          <select
            name="category"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded border p-3 bg-white"
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
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="rounded border p-3 bg-white"
            required
            disabled={!formData.category || subCategories.length === 0}
          >
            <option value="">
              {subCategories.length > 0
                ? "Select Subcategory"
                : "Choose a category first"}
            </option>
            {subCategories.map((subcategory: any) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>

          <input
            name="collection"
            value={formData.collection || ""}
            onChange={handleChange}
            placeholder="Collection"
            className="rounded border p-3"
          />

          <input
            name="brand"
            value={formData.brand || ""}
            onChange={handleChange}
            placeholder="Brand"
            className="rounded border p-3"
          />
        </div>

        <textarea
          rows={5}
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="mt-4 w-full rounded border p-3"
        />

        {/* Tags */}

        <h2 className="mt-8 mb-4 text-xl font-semibold">Tags</h2>

        <input
          value={formData.tags ? formData.tags.join(",") : ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
          placeholder="diamond, ring, engagement"
          className="w-full rounded border p-3"
        />

        {/* Product Flags */}

        <h2 className="mt-8 mb-4 text-xl font-semibold">Product Settings</h2>

        <div className="flex gap-8">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isFeatured: e.target.checked,
                })
              }
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isTrending}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isTrending: e.target.checked,
                })
              }
            />
            Trending
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isBestSeller: e.target.checked,
                })
              }
            />
            Best Seller
          </label>
        </div>

        {/* SEO */}

        <h2 className="mt-8 mb-4 text-xl font-semibold">SEO Information</h2>

        <input
          name="seoTitle"
          value={formData.seoTitle || ""}
          onChange={handleChange}
          placeholder="SEO Title"
          className="mb-4 w-full rounded border p-3"
        />

        <textarea
          rows={3}
          name="seoDescription"
          value={formData.seoDescription || ""}
          onChange={handleChange}
          placeholder="SEO Description"
          className="w-full rounded border p-3"
        />

        {/* Variants */}

        <h2 className="mt-8 mb-4 text-xl font-semibold">Variants</h2>

        {formData.variants.map((variant, index) => (
          <div key={index} className="mb-4 rounded-lg border p-6 bg-white shadow-sm">
            <h3 className="mb-4 font-bold text-gray-700">Variant {index + 1}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Variant ID</label>
                <input
                  value={variant.variantId || ""}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], variantId: e.target.value };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Variant ID"
                  className="rounded border p-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Metal</label>
                <input
                  value={variant.metal || ""}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], metal: e.target.value };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Metal"
                  className="rounded border p-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Gemstone</label>
                <input
                  value={variant.gemstone || ""}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], gemstone: e.target.value };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Gemstone"
                  className="rounded border p-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Cost Price (₹)</label>
                <input
                  type="number"
                  value={variant.costPrice || 0}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], costPrice: Number(e.target.value) };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Cost Price"
                  className="rounded border p-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Price (₹)</label>
                <input
                  type="number"
                  value={variant.price || 0}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], price: Number(e.target.value) };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Price"
                  className="rounded border p-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Discount Price (₹)</label>
                <input
                  type="number"
                  value={variant.discountPrice || 0}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], discountPrice: Number(e.target.value) };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Discount Price"
                  className="rounded border p-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-500">Stock</label>
                <input
                  type="number"
                  value={variant.stock || 0}
                  onChange={(e) => {
                    const updated = [...formData.variants];
                    updated[index] = { ...updated[index], stock: Number(e.target.value) };
                    setFormData({ ...formData, variants: updated });
                  }}
                  placeholder="Stock"
                  className="rounded border p-2"
                />
              </div>

              <div className="md:col-span-3 mt-4">
                <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
                  Variant Images
                </label>
                <div className="flex flex-col gap-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 transition">
                    {isUploading === index ? (
                      <FaSync className="animate-spin text-2xl text-gray-400 mb-2" />
                    ) : (
                      <FaUpload className="text-2xl text-gray-400 mb-2" />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {isUploading === index ? "Uploading..." : "Click to upload images"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, index)}
                      disabled={isUploading === index}
                    />
                  </label>

                  {variant.images && variant.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {variant.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                               const updated = [...formData.variants];
                               updated[index] = {
                                  ...updated[index],
                                  images: updated[index].images.filter((_, i) => i !== idx)
                               };
                               setFormData({ ...formData, variants: updated });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Customization */}

        <h2 className="mt-8 mb-4 text-xl font-semibold">Customization</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.customizationOptions.engraving.allowed}
            onChange={(e) =>
              setFormData({
                ...formData,
                customizationOptions: {
                  ...formData.customizationOptions,
                  engraving: {
                    ...formData.customizationOptions.engraving,
                    allowed: e.target.checked,
                  },
                },
              })
            }
          />
          Engraving Allowed
        </label>

        <input
          type="number"
          value={formData.customizationOptions?.engraving?.maxChars || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              customizationOptions: {
                ...formData.customizationOptions,
                engraving: {
                  ...formData.customizationOptions?.engraving,
                  maxChars: Number(e.target.value),
                },
              },
            })
          }
          placeholder="Max Characters"
          className="mt-4 w-full rounded border p-3"
        />

        <input
          type="number"
          value={formData.customizationOptions?.engraving?.additionalCost || 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              customizationOptions: {
                ...formData.customizationOptions,
                engraving: {
                  ...formData.customizationOptions?.engraving,
                  additionalCost: Number(e.target.value),
                },
              },
            })
          }
          placeholder="Additional Cost"
          className="mt-4 w-full rounded border p-3"
        />

        <input
          value={formData.customizationOptions?.ringSizes?.join(",") || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              customizationOptions: {
                ...formData.customizationOptions,
                ringSizes: e.target.value.split(",").map(Number),
              },
            })
          }
          placeholder="6,7,8,9,10"
          className="mt-4 w-full rounded border p-3"
        />

        {/* Status */}

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-8 w-full rounded border p-3"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>

        <button
          onClick={handleSubmit}
          className="mt-8 rounded bg-[#99775c] px-8 py-3 text-white"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}
