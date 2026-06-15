import React, { useMemo } from "react";
import { X, Check } from "lucide-react";

interface FilterSidebarProps {
  products: any[];
  filters: {
    categories: string[];
    subcategories: string[];
    collections: string[];
    colors: string[];
    priceRange: [number, number];
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  products,
  filters,
  setFilters,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const collections = new Set<string>();
    const colors = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((p) => {
      const catName =
        typeof p.category === "object" ? p.category?.name : p.category;
      if (catName) categories.add(catName);

      const colName =
        typeof p.collection === "object" ? p.collection?.name : p.collection;
      if (colName) collections.add(colName);

      if (p.variants && Array.isArray(p.variants)) {
        p.variants.forEach((v: any) => {
          if (v.color) colors.add(v.color.trim().toLowerCase());
          const price = v.discountPrice || v.price;
          if (price !== undefined) {
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;
          }
        });
      }
    });

    return {
      categories: Array.from(categories),
      collections: Array.from(collections),
      colors: Array.from(colors),
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice,
    };
  }, [products]);

  const handleToggleArrayFilter = (
    type: "categories" | "collections" | "colors" | "subcategories",
    value: string,
  ) => {
    setFilters((prev: any) => {
      const current: string[] = prev[type] || [];
      const updated = current.includes(value)
        ? current.filter((item: string) => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const handleClearAll = () => {
    setFilters((prev: any) => ({
      ...prev,
      categories: [],
      subcategories: [],
      collections: [],
      colors: [],
      priceRange: [
        filterOptions.minPrice || 0,
        filterOptions.maxPrice || 1000000,
      ],
    }));
  };

  const handlePriceChange = (value: number) => {
    setFilters((prev: any) => ({
      ...prev,
      priceRange: [prev.priceRange[0], value],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:w-64 lg:z-0 lg:block flex flex-col h-full overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 lg:hidden">
          <h2 className="text-xl font-serif font-semibold text-[#2d2d2d]">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {filterOptions.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {filterOptions.categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() =>
                        handleToggleArrayFilter("categories", cat)
                      }
                      className="form-checkbox h-4 w-4 text-[#99775c] border-gray-300 rounded"
                    />
                    <span
                      className={`text-sm ${
                        filters.categories.includes(cat)
                          ? "text-[#99775c] font-medium"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <hr className="border-gray-100" />

          {filterOptions.collections.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                Collections
              </h3>
              <div className="space-y-2">
                {filterOptions.collections.map((col) => (
                  <label
                    key={col}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.collections.includes(col)}
                      onChange={() =>
                        handleToggleArrayFilter("collections", col)
                      }
                      className="form-checkbox h-4 w-4 text-[#99775c] border-gray-300 rounded"
                    />
                    <span
                      className={`text-sm ${
                        filters.collections.includes(col)
                          ? "text-[#99775c] font-medium"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {col}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <hr className="border-gray-100" />

          {filterOptions.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.map((color) => {
                  const isSelected = filters.colors.includes(color);
                  let bgColor = color;
                  if (color.includes("rose")) bgColor = "#b76e79";
                  if (color.includes("white")) bgColor = "#f8f9fa";
                  if (color.includes("yellow") || color.includes("gold"))
                    bgColor = "#FFD700";

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleToggleArrayFilter("colors", color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-[#99775c] scale-110"
                          : "border-gray-200 hover:scale-110"
                      }`}
                      style={{ backgroundColor: bgColor }}
                      title={color}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className={
                            color.includes("white")
                              ? "text-black"
                              : "text-white"
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Price Range
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min={filterOptions.minPrice}
                max={filterOptions.maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handlePriceChange(parseInt(e.target.value, 10))
                }
                className="w-full accent-[#99775c]"
              />
              <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                <span>₹{filterOptions.minPrice.toLocaleString()}</span>
                <span>₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex-1 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm font-medium text-white bg-[#99775c] rounded-xl hover:bg-[#7e6049] transition lg:hidden"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}
