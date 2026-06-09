"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import type { Category, CategoryState } from "@/app/store/slices/categorySlice";
import { fetchCategories } from "@/app/store/slices/categorySlice";
import SectionTitle from "./SectionTitle";

const CategoriesSection = () => {
  const dispatch = useAppDispatch();
  const categoryState = useAppSelector(
    (state) => state.category as CategoryState,
  );
  const categories = categoryState.categories.data as Category[];
  const { loading, error } = categoryState;
  console.log(categories, "categories");

  useEffect(() => {
    void dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section id="collections" className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Featured Categories"
          title="Curated for Every Moment"
        />

        <div className="mt-6">
          {loading && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              Loading categories...
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && categories && categories.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              No categories available right now.
            </div>
          )}

          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
              {categories.map((category) => (
                <a
                  key={category._id ?? category.name}
                  href="#shop"
                  className="group relative overflow-hidden rounded-2xl shadow-lg"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-semibold">
                      {category.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
