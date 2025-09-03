import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const QuickAddTask = ({ onTaskCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      loadCategories();
    }
  }, [isExpanded]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setCategoryId(categoriesData[0].Id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const taskData = {
        title: title.trim(),
        categoryId: parseInt(categoryId),
        priority: "medium",
        description: "",
        dueDate: null
      };

      await taskService.create(taskData);
      
      toast.success("Task added!");
      
      // Reset form
      setTitle("");
      setIsExpanded(false);
      
      if (onTaskCreated) onTaskCreated();

    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
        >
          <ApperIcon name="Plus" size={24} />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <div className="bg-white rounded-lg shadow-xl p-4 w-80 border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
          
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isSubmitting || loading}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name_c || category.name}
              </option>
            ))}
          </Select>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              size="sm"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !categoryId}
              size="sm"
              className="flex-1"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default QuickAddTask;