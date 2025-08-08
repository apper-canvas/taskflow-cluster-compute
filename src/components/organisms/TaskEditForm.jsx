import React, { useState } from "react";
import { format } from "date-fns";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import PrioritySelect from "@/components/molecules/PrioritySelect";

const TaskEditForm = ({ task, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    categoryId: task.categoryId || "",
    priority: task.priority || "medium",
    dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : "",
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updates = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    onSave(updates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="Enter task title..."
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

      <div className="flex items-center space-x-3 pt-2">
        <Button type="submit" size="sm">
          Save Changes
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskEditForm;