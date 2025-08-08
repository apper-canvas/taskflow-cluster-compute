import React from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTabs from "@/components/molecules/FilterTabs";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskHeader = ({ 
  searchQuery, 
  onSearchChange, 
  activeFilter, 
  onFilterChange, 
  taskCounts,
  onCreateTask 
}) => {
  const filters = [
    { value: "all", label: "All Tasks", count: taskCounts?.total || 0 },
    { value: "active", label: "Active", count: taskCounts?.active || 0 },
    { value: "completed", label: "Completed", count: taskCounts?.completed || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            TaskFlow
          </h1>
          <p className="text-gray-600 mt-1">
            Organize your tasks efficiently
          </p>
        </div>

        <Button 
          onClick={onCreateTask}
          className="flex items-center space-x-2 whitespace-nowrap"
        >
          <ApperIcon name="Plus" size={18} />
          <span>New Task</span>
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        <FilterTabs
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
};

export default TaskHeader;