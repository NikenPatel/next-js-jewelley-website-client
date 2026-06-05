"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  createSubcategory,
  resetSubcategoryState,
} from "@/app/store/slices/subcategorySlice";
import { fetchCategories } from "@/app/store/slices/categorySlice";

export default function SubcategoryAddPage() {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector(
    (state) => state.subcategory,
  );
  const { categories } = useAppSelector((state) => state.category);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  console.log(categories);
  useEffect(() => {
    dispatch(resetSubcategoryState());
    void dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setStatusMessage("Subcategory created successfully.");
    }
  }, [success]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      await dispatch(
        createSubcategory({
          name: subCategoryName,
          categoryId,
        }),
      ).unwrap();
      setSubCategoryName("");
      setCategoryId("");
    } catch {
      setStatusMessage("");
    }
  };

  const categoryOptionsSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 text-gray-600">
        <h1 className="text-2xl font-semibold mb-4">Add Subcategory</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="subcategoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Subcategory Name
            </label>
            <input
              id="subcategoryName"
              name="subcategoryName"
              type="text"
              required
              value={subCategoryName}
              onChange={(event) => setSubCategoryName(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="parentCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Parent Category
            </label>
            <select
              id="parentCategory"
              name="parentCategory"
              required
              value={categoryId}
              onChange={categoryOptionsSelected}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select parent category</option>
              {categories &&
                categories.count > 0 &&
                categories.data.map((category: any) => (
                  <option
                    key={category._id ?? category.slug}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Loading categories or no categories found.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Create Subcategory"}
            </button>
          </div>

          {statusMessage && (
            <p className="text-sm text-green-600">{statusMessage}</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </main>
  );
}
