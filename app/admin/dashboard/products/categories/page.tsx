"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  createCategory,
  fetchCategories,
  resetCategoryState,
} from "@/app/store/slices/categorySlice";

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
  console.log("Categories from Redux:", categories);
  const [form, setForm] = useState<Category>(initialCategory);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(resetCategoryState());
    void dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setMessage("Category created successfully.");
      dispatch(resetCategoryState());
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
      await dispatch(createCategory(form)).unwrap();
      setForm(initialCategory);
      await dispatch(fetchCategories()).unwrap();
    } catch {
      // error state is handled by Redux
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-narvik px-6 py-8 text-gray-600">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-4xl border border-beige bg-white/90 p-6 shadow-xl shadow-sorrell/10 backdrop-blur-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-dark/70">
                Category management
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-dark">
                Add new category
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-dark/70">
                Use the form below to create a new category with full schema
                support.
              </p>
            </div>

            <div className="rounded-3xl bg-sorrell px-5 py-4 text-white shadow-lg shadow-sorrell/20">
              <p className="text-xs uppercase tracking-[0.2em] text-beige/90">
                Categories
              </p>
              <p className="mt-3 text-3xl font-semibold">{categories.length}</p>
              <p className="mt-1 text-sm text-beige/90">loaded from API</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl border border-beige bg-narvik p-6 shadow-sm"
            >
              {error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Name
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Diamond Rings"
                    required
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Slug
                  </span>
                  <input
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="diamond-rings"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-dark">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  placeholder="A beautiful category for premium diamond jewelry."
                  className="w-full rounded-3xl border border-beige bg-white px-4 py-4 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Icon URL
                  </span>
                  <input
                    value={form.icon}
                    onChange={(e) => updateField("icon", e.target.value)}
                    placeholder="https://example.com/icon.svg"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Image URL
                  </span>
                  <input
                    value={form.image}
                    onChange={(e) => updateField("image", e.target.value)}
                    placeholder="https://example.com/category.jpg"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-dark">
                    Display order
                  </span>
                  <input
                    value={form.displayOrder}
                    onChange={(e) =>
                      updateField("displayOrder", Number(e.target.value))
                    }
                    type="number"
                    min="0"
                    className="w-full rounded-3xl border border-beige bg-white px-4 py-3 text-dark outline-none transition focus:border-sorrell focus:ring-4 focus:ring-sorrell/15"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-3xl border border-beige bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateField("isActive", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-sorrell focus:ring-sorrell"
                  />
                  <span className="text-sm font-medium text-dark">Active</span>
                </label>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-3xl bg-sorrell px-6 py-3 text-sm font-semibold text-white transition hover:bg-dark disabled:cursor-not-allowed disabled:bg-beige/60"
                >
                  {saving ? "Saving..." : "Create category"}
                </button>
              </div>
            </form>

            <aside className="space-y-6 rounded-3xl border border-beige bg-narvik p-6 shadow-sm">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-dark">
                  Existing categories
                </p>
                <p className="mt-2 text-sm leading-6 text-dark/70">
                  {loading
                    ? "Loading categories..."
                    : `${categories.length} categories found`}
                </p>
              </div>

              <div className="space-y-3 rounded-3xl border border-beige bg-white p-5">
                {categories.length === 0 ? (
                  <p className="text-sm text-dark/70">No categories yet.</p>
                ) : (
                  categories.length > 0 &&
                  categories.map((category) => (
                    <div
                      key={category._id ?? category.slug}
                      className="rounded-3xl border border-beige p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-dark">
                            {category.name}
                          </p>
                          <p className="text-sm text-dark/60">
                            {category.slug}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.isActive
                              ? "bg-sorrell/10 text-sorrell"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-dark/70">
                        {category.description || "No description"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-dark/60">
                        <span>Order: {category.displayOrder}</span>
                        {category.icon && <span>Icon set</span>}
                        {category.image && <span>Image set</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
