import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryIndicator = ({ category, showCount = true, isActive = false, className }) => {
  if (!category) return null;

  return (
    <div className={cn(
      "flex items-center space-x-2",
      isActive && "text-primary",
      className
    )}>
      <div 
        className="w-3 h-3 rounded-full flex items-center justify-center"
        style={{ backgroundColor: category.color }}
      >
        <ApperIcon 
          name={category.icon} 
          size={8} 
          className="text-white" 
        />
      </div>
      <span className="font-medium">{category.name}</span>
      {showCount && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {category.taskCount}
        </span>
      )}
    </div>
  );
};

export default CategoryIndicator;