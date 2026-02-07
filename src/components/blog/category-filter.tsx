"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/blog?${params.toString()}`);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <label htmlFor="category-filter" className="block text-sm text-white/60 mb-3 font-sans">
        Filter by category:
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="bg-white/10 border border-white/20 text-white rounded-sm px-4 py-2 text-sm font-sans focus:outline-none focus:border-white/40 transition-colors cursor-pointer"
      >
        <option value="all" className="bg-[#18181b] text-white">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category} className="bg-[#18181b] text-white">
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
