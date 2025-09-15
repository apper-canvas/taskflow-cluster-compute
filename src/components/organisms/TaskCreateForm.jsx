import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { userService } from "@/services/api/userService";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import PrioritySelect from "@/components/molecules/PrioritySelect";
import ApperIcon from "@/components/ApperIcon";
const TaskCreateForm = ({ onTaskCreated, onClose }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  useEffect(() => {
loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, usersData] = await Promise.all([
        categoryService.getAll(),
        userService.getAll()
      ]);
      setCategories(categoriesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load categories and users");
    } finally {
      setLoading(false);
    }
  };

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (value) => {
    setFormData(prev => ({
      ...prev,
      priority: value
    }));
  };

  const handleUserChange = (e) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: e.target.value
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a task title first");
      return;
    }

    try {
      setIsGeneratingDescription(true);
      const generatedDescription = await taskService.generateDescription(formData.title);
      
      setFormData(prev => ({
        ...prev,
        description: generatedDescription
      }));
      
      toast.success("Description generated successfully!");
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error(error.message || "Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return false;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      
      const taskData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      await taskService.create(taskData);
      
      toast.success("Task created successfully!");
      
// Reset form
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });

      if (onTaskCreated) onTaskCreated();
      if (onClose) onClose();

    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Task Title"
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            disabled={isSubmitting}
          />

<div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isSubmitting || isGeneratingDescription || !formData.title.trim()}
                className="text-primary hover:text-primary-dark text-xs"
              >
                <ApperIcon name="Sparkles" size={14} className="mr-1" />
                {isGeneratingDescription ? "Generating..." : "Generate"}
              </Button>
            </div>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description or use the Generate button..."
              rows={3}
              disabled={isSubmitting}
              generating={isGeneratingDescription}
            />
          </div>

          <FormField
            label="Category"
            required
            type="select"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isSubmitting || loading}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name_c || category.name}
              </option>
            ))}
          </FormField>

          <FormField label="Priority">
            <PrioritySelect
              value={formData.priority}
              onChange={handlePriorityChange}
              disabled={isSubmitting}
            />
          </FormField>
<FormField
            label="Assigned To"
            name="assignedTo"
            type="select"
            value={formData.assignedTo}
            onChange={handleUserChange}
            disabled={isSubmitting}
          >
            <option value="">Select teammate...</option>
            {users.map((user) => (
              <option key={user.Id} value={user.Id}>
                {user.Name} ({user.role})
              </option>
            ))}
          </FormField>

          <FormField
            label="Due Date"
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TaskCreateForm;