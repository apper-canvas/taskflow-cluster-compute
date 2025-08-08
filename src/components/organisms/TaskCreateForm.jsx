import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import PrioritySelect from "@/components/molecules/PrioritySelect";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const TaskCreateForm = ({ onTaskCreated, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePriorityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      priority: e.target.value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      await taskService.create(taskData);
      
      toast.success("Task created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        priority: "medium",
        dueDate: "",
      });
      
      if (onTaskCreated) onTaskCreated();
      if (onClose) onClose();
      
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <ApperIcon name="X" size={16} />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="Enter task title..."
          autoFocus
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add task description..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            name="categoryId"
            error={errors.categoryId}
            required
          >
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Priority"
            name="priority"
          >
            <PrioritySelect
              value={formData.priority}
              onChange={handlePriorityChange}
            />
          </FormField>
        </div>

        <FormField
          label="Due Date"
          name="dueDate"
          type="datetime-local"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <div className="flex items-center justify-end space-x-3 pt-4">
          {onClose && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskCreateForm;