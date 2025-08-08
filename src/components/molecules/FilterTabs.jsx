import React from "react";
import { cn } from "@/utils/cn";

const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeFilter === filter.value
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className="ml-1 text-xs opacity-60">({filter.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;