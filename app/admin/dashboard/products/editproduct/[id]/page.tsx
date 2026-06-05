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
import { log } from "console";

interface Variant {
  variantId: string;
  metal: string;
  caratWeight: number;
  gemstone: string;
  clarity: string;
  color: string;
  price: number;
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
  console.log(selectedProduct, "selectedProduct", formData);

  //   useEffect(() => {
  //     if (id) {
  //       getProduct();
  //     }
  //   }, [id]);
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct.product);
    }
  }, [selectedProduct]);

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

  const handleSubmit = async () => {
    try {
      await dispatch(
        updateProduct({
          productId: id,
          data: formData,
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
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="rounded border p-3"
          />

          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="rounded border p-3"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="rounded border p-3"
          />

          <input
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            placeholder="Sub Category"
            className="rounded border p-3"
          />

          <input
            name="collection"
            value={formData.collection}
            onChange={handleChange}
            placeholder="Collection"
            className="rounded border p-3"
          />

          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="rounded border p-3"
          />
        </div>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
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
          value={formData.seoTitle}
          onChange={handleChange}
          placeholder="SEO Title"
          className="mb-4 w-full rounded border p-3"
        />

        <textarea
          rows={3}
          name="seoDescription"
          value={formData.seoDescription}
          onChange={handleChange}
          placeholder="SEO Description"
          className="w-full rounded border p-3"
        />

        {/* Variants */}

        <h2 className="mt-8 mb-4 text-xl font-semibold">Variants</h2>

        {formData.variants.map((variant, index) => (
          <div key={index} className="mb-4 rounded-lg border p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                value={variant.variantId}
                onChange={(e) => {
                  const updated = [...formData.variants];
                  updated[index].variantId = e.target.value;

                  setFormData({
                    ...formData,
                    variants: updated,
                  });
                }}
                placeholder="Variant ID"
                className="rounded border p-2"
              />

              <input
                value={variant.metal}
                onChange={(e) => {
                  const updated = [...formData.variants];
                  updated[index].metal = e.target.value;

                  setFormData({
                    ...formData,
                    variants: updated,
                  });
                }}
                placeholder="Metal"
                className="rounded border p-2"
              />

              <input
                value={variant.gemstone}
                onChange={(e) => {
                  const updated = [...formData.variants];
                  updated[index].gemstone = e.target.value;

                  setFormData({
                    ...formData,
                    variants: updated,
                  });
                }}
                placeholder="Gemstone"
                className="rounded border p-2"
              />

              <input
                type="number"
                value={variant.price}
                onChange={(e) => {
                  const updated = [...formData.variants];
                  updated[index].price = Number(e.target.value);

                  setFormData({
                    ...formData,
                    variants: updated,
                  });
                }}
                placeholder="Price"
                className="rounded border p-2"
              />

              <input
                type="number"
                value={variant.discountPrice}
                onChange={(e) => {
                  const updated = [...formData.variants];
                  updated[index].discountPrice = Number(e.target.value);

                  setFormData({
                    ...formData,
                    variants: updated,
                  });
                }}
                placeholder="Discount Price"
                className="rounded border p-2"
              />

              <input
                type="number"
                value={variant.stock}
                onChange={(e) => {
                  const updated = [...formData.variants];
                  updated[index].stock = Number(e.target.value);

                  setFormData({
                    ...formData,
                    variants: updated,
                  });
                }}
                placeholder="Stock"
                className="rounded border p-2"
              />
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
          value={formData.customizationOptions.engraving.maxChars}
          onChange={(e) =>
            setFormData({
              ...formData,
              customizationOptions: {
                ...formData.customizationOptions,
                engraving: {
                  ...formData.customizationOptions.engraving,
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
          value={formData.customizationOptions.engraving.additionalCost}
          onChange={(e) =>
            setFormData({
              ...formData,
              customizationOptions: {
                ...formData.customizationOptions,
                engraving: {
                  ...formData.customizationOptions.engraving,
                  additionalCost: Number(e.target.value),
                },
              },
            })
          }
          placeholder="Additional Cost"
          className="mt-4 w-full rounded border p-3"
        />

        <input
          value={formData.customizationOptions.ringSizes.join(",")}
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
