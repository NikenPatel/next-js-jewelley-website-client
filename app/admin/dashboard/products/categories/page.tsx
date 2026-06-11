"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
  resetCategoryState,
} from "@/app/store/slices/categorySlice";
import { FaPlus, FaTimes, FaSync } from "react-icons/fa";

interface Category {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

const initialCategory: Category = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  image: "",
  isActive: true,
  displayOrder: 0,
};

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, success, error } = useAppSelector(
    (state) => state.category,
  );
  console.log("categories", categories);

  const [form, setForm] = useState<Category>(initialCategory);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    dispatch(resetCategoryState());
    void dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setMessage("Category created successfully.");
      dispatch(resetCategoryState());
      // Close modal on success after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(null);
      }, 1500);
    }
  }, [success, dispatch]);

  const updateField = (
    field: keyof Category,
    value: string | boolean | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (value: string) => {
    updateField("name", value);
    updateField("slug", generateSlug(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (isEditMode && form._id) {
        await dispatch(updateCategory({ id: form._id, data: form })).unwrap();
        setMessage("Category updated successfully.");
      } else {
        await dispatch(createCategory(form)).unwrap();
        setMessage("Category created successfully.");
      }
      await dispatch(fetchCategories()).unwrap();
      
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(null);
      }, 1500);
    } catch {
      // error state is handled by Redux
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm(category);
    setIsEditMode(true);
    setMessage(null);
    dispatch(resetCategoryState());
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      await dispatch(deleteCategory(id));
      dispatch(fetchCategories());
    }
  };

  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-600">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#323232]">
            Category Management
          </h1>
          <p className="text-sm text-gray-500">
            View, add, and manage product categories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch(fetchCategories())}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => {
              setForm(initialCategory);
              setIsEditMode(false);
              setMessage(null);
              dispatch(resetCategoryState());
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-[#99775c] px-4 py-2 text-white hover:bg-[#836248] transition shadow-md"
          >
            <FaPlus />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            All Categories ({categories.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#ddd0c8] text-[#323232]">
              <tr>
                <th className="p-4 text-left font-semibold">Image/Icon</th>
                <th className="p-4 text-left font-semibold">Name & Slug</th>
                <th className="p-4 text-left font-semibold">Description</th>
                <th className="p-4 text-center font-semibold">Display Order</th>
                <th className="p-4 text-center font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <FaSync className="animate-spin text-[#99775c] text-xl" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.count > 0 ? (
                categories.data.map((category: Category) => (
                  <tr
                    key={category._id ?? category.slug}
                    className="border-t hover:bg-[#f3ece7] transition"
                  >
                    <td className="p-4">
                      {category.image || category.icon ? (
                        <div className="h-10 w-10 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={category.image || category.icon}
                            alt={category.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          None
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {category.name}
                      </div>
                      <div className="text-xs text-[#99775c]">
                        {category.slug}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {category.description || (
                        <span className="text-gray-400 italic">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center font-medium">
                      {category.displayOrder}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800 transition text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => category._id && handleDelete(category._id)}
                          className="text-red-600 hover:text-red-800 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2 mb-5">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Diamond Rings"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                    Slug
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="diamond-rings"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  placeholder="A beautiful category for premium jewelry..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2 mb-5">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                    Icon URL
                  </label>
                  <input
                    value={form.icon}
                    onChange={(e) => updateField("icon", e.target.value)}
                    placeholder="https://example.com/icon.svg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                    Image URL
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) => updateField("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 mb-8">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                    Display Order
                  </label>
                  <input
                    value={form.displayOrder}
                    onChange={(e) =>
                      updateField("displayOrder", Number(e.target.value))
                    }
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        updateField("isActive", e.target.checked)
                      }
                      className="h-5 w-5 rounded border-gray-300 text-[#99775c] focus:ring-[#99775c]"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Category is Active
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#99775c] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#836248] transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
