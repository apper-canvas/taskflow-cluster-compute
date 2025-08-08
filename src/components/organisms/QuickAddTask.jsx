import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const QuickAddTask = ({ onTaskCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    priority: "medium"
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
      
      // Auto-select first category if none selected
      if (categoriesData.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: categoriesData[0].Id }));
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.categoryId) {
      toast.error("Title and category are required");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        description: "",
        dueDate: null
      };

      await taskService.create(taskData);
      
      toast.success("Task created successfully!");
      
      // Reset form and close
      setFormData({ title: "", categoryId: categories[0]?.Id || "", priority: "medium" });
      setIsOpen(false);
      
      if (onTaskCreated) onTaskCreated();
      
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary-dark flex items-center justify-center"
            >
              <ApperIcon name="Plus" size={24} />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="card p-4 shadow-xl min-w-[300px] max-w-[400px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Quick Add Task</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                onKeyDown={handleKeyDown}
                autoFocus
                className="text-sm"
              />

              <div className="flex space-x-2">
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="flex-1 text-sm"
                >
                  {categories.map(category => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </Select>

                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Add Task"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickAddTask;