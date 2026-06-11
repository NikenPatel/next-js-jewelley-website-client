"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  fetchSubcategories,
  resetSubcategoryState,
} from "@/app/store/slices/subcategorySlice";
import { fetchCategories } from "@/app/store/slices/categorySlice";
import { FaPlus, FaTimes, FaSync } from "react-icons/fa";

export default function SubcategoryPage() {
  const dispatch = useAppDispatch();
  const {
    subcategories,
    loading: subLoading,
    success,
    error,
  } = useAppSelector((state) => state.subcategory);
  const { categories, loading: catLoading } = useAppSelector(
    (state) => state.category,
  );
  console.log("subcategories", subcategories);
  console.log("categories", categories);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(resetSubcategoryState());
    void dispatch(fetchCategories());
    void dispatch(fetchSubcategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setStatusMessage("Subcategory created successfully.");
      dispatch(resetSubcategoryState());
      // Refresh the list after successful creation
      void dispatch(fetchSubcategories());

      // Close modal on success after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMessage(null);
      }, 1500);
    }
  }, [success, dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    try {
      if (isEditMode && editId) {
        await dispatch(
          updateSubcategory({
            id: editId,
            data: { name: subCategoryName, categoryId },
          }),
        ).unwrap();
      } else {
        await dispatch(
          createSubcategory({
            name: subCategoryName,
            categoryId,
          }),
        ).unwrap();
      }
      setSubCategoryName("");
      setCategoryId("");
      setEditId(null);
    } catch {
      // Redux handles error state
    }
  };

  const handleEdit = (sub: any) => {
    setSubCategoryName(sub.name);
    setCategoryId(sub.parentCategory || sub.category || "");
    setEditId(sub._id);
    setIsEditMode(true);
    setStatusMessage(null);
    dispatch(resetSubcategoryState());
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this subcategory? This action cannot be undone.",
      )
    ) {
      await dispatch(deleteSubcategory(id));
      dispatch(fetchSubcategories());
    }
  };

  // The API might return subcategories wrapped in an object or array, handle both safely
  const subList = Array.isArray(subcategories)
    ? subcategories
    : subcategories?.data || [];
  const catList = Array.isArray(categories)
    ? categories
    : categories?.data || [];

  const getParentCategoryName = (parentField: any) => {
    if (!parentField) return "Unknown";

    // If the backend already populated the object
    if (typeof parentField === "object" && parentField.name) {
      return parentField.name;
    }

    // If it's just an ID string, look it up in catList
    if (!catList || !catList.length) return parentField;
    const parent = catList.find((c: any) => c._id === parentField);
    return parent ? parent.name : parentField;
  };

  const isLoading = subLoading || catLoading;

  return (
    <div className="min-h-screen bg-[#f3ece7] p-6 text-gray-600">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#323232]">
            Subcategory Management
          </h1>
          <p className="text-sm text-gray-500">
            View, add, and manage product subcategories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              dispatch(fetchCategories());
              dispatch(fetchSubcategories());
            }}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FaSync className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => {
              setSubCategoryName("");
              setCategoryId("");
              setEditId(null);
              setIsEditMode(false);
              setStatusMessage(null);
              dispatch(resetSubcategoryState());
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-[#99775c] px-4 py-2 text-white hover:bg-[#836248] transition shadow-md"
          >
            <FaPlus />
            Add Subcategory
          </button>
        </div>
      </div>

      {/* Subcategories Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            All Subcategories ({subList.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#ddd0c8] text-[#323232]">
              <tr>
                <th className="p-4 text-left font-semibold">
                  Subcategory Name
                </th>

                <th className="p-4 text-left font-semibold">Parent Category</th>
                <th className="p-4 text-right font-semibold">Created Date</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <FaSync className="animate-spin text-[#99775c] text-xl" />
                      <span>Loading subcategories...</span>
                    </div>
                  </td>
                </tr>
              ) : subList.length > 0 ? (
                subList.map((sub: any) => (
                  <tr
                    key={sub._id || sub.name}
                    className="border-t hover:bg-[#f3ece7] transition"
                  >
                    <td className="p-4 font-semibold text-gray-800">
                      {sub.name}
                    </td>
                    <td className="p-4 text-[#99775c] font-medium">
                      {getParentCategoryName(
                        sub.parentCategory || sub.category,
                      )}
                    </td>
                    <td className="p-4 text-right text-gray-500">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="text-blue-600 hover:text-blue-800 transition text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => sub._id && handleDelete(sub._id)}
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
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    No subcategories found. Click "Add Subcategory" to create
                    one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subcategory Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Edit Subcategory" : "Add New Subcategory"}
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
              {statusMessage && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {statusMessage}
                </div>
              )}

              <div className="mb-5">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Subcategory Name
                </label>
                <input
                  required
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  placeholder="e.g. Engagement Rings"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c]"
                />
              </div>

              <div className="mb-8">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Parent Category
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none transition focus:border-[#99775c] focus:ring-1 focus:ring-[#99775c] bg-white"
                >
                  <option value="">Select parent category</option>
                  {catList.map((category: any) => (
                    <option
                      key={category._id ?? category.slug}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {catList.length === 0 && (
                  <p className="mt-2 text-xs text-orange-500">
                    No categories found. You must create a category first.
                  </p>
                )}
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
                  disabled={subLoading}
                  className="rounded-lg bg-[#99775c] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#836248] transition disabled:opacity-50"
                >
                  {subLoading
                    ? "Saving..."
                    : isEditMode
                      ? "Update Subcategory"
                      : "Create Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
