import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { categoryService } from "@/services/api/categoryService";
import CategoryIndicator from "@/components/molecules/CategoryIndicator";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategorySidebar = ({ selectedCategory, onCategorySelect, taskCounts }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setError(null);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory && selectedCategory.Id === category.Id) {
      onCategorySelect(null); // Deselect if already selected
    } else {
      onCategorySelect(category);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        <p className="text-sm">Failed to load categories</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadCategories}
          className="mt-2"
        >
          <ApperIcon name="RefreshCw" size={14} />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCategorySelect(null)}
          className={cn(
            "text-xs",
            !selectedCategory ? "text-primary font-medium" : "text-gray-500"
          )}
        >
          All Tasks
        </Button>
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory && selectedCategory.Id === category.Id;
          const displayCount = taskCounts ? taskCounts[category.Id] || 0 : category.taskCount;
          
          return (
            <motion.button
              key={category.Id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between",
                isSelected
                  ? "bg-primary/10 border-primary/20 border"
                  : "bg-white hover:bg-gray-50 border border-transparent"
              )}
              whileTap={{ scale: 0.98 }}
            >
              <CategoryIndicator 
                category={{...category, taskCount: displayCount}} 
                showCount={false}
                isActive={isSelected}
              />
              
              {displayCount > 0 && (
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  isSelected 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-600"
                )}>
                  {displayCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySidebar;