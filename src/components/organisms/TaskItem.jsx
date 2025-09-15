import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import TaskEditForm from "@/components/organisms/TaskEditForm";
import CategoryIndicator from "@/components/molecules/CategoryIndicator";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const TaskItem = ({ task, category, categories, users, onToggleComplete, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due ${format(date, "MMM d")}`;
  };

  const handleToggleComplete = () => {
    onToggleComplete(task.Id, !task.completed);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.Id);
    }
  };

  const handleSaveEdit = (updates) => {
    onUpdate(task.Id, updates);
    setIsEditing(false);
  };

  const dueDateInfo = formatDueDate(task.dueDate);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div 
      className={cn(
        "card p-4 card-hover transition-all duration-200",
        task.completed && "opacity-60"
      )}
      layout
    >
      <div className="flex items-start space-x-3">
        {/* Completion Checkbox */}
        <motion.button
          onClick={handleToggleComplete}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
            task.completed
              ? "bg-success border-success text-white"
              : "border-gray-300 hover:border-primary"
          )}
          whileTap={{ scale: 0.95 }}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="checkmark-animation"
            >
              <ApperIcon name="Check" size={12} />
            </motion.div>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <TaskEditForm
              task={task}
categories={categories}
              users={users}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {/* Task Header */}
              <div 
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={cn(
                    "font-semibold text-gray-900",
                    task.completed && "line-through"
                  )}>
                    {task.title}
                  </h3>
                  <ApperIcon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"}
                    size={16}
                    className="text-gray-400"
                  />
                </div>

                {/* Task Meta Info */}
                <div className="flex items-center space-x-3 text-sm">
                  {category && (
                    <CategoryIndicator category={category} showCount={false} />
                  )}
                  
                  <Badge variant={task.priority}>
                    {task.priority} priority
                  </Badge>

                  {dueDateInfo && (
                    <span className={cn(
                      "text-sm",
                      isOverdue ? "text-red-600 font-medium" : "text-gray-600"
                    )}>
                      {dueDateInfo}
                    </span>
)}
                </div>
                {/* Assigned User */}
                {task.assignedTo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="User" size={14} />
                    <span>
                      {users?.find(u => u.Id === task.assignedTo)?.Name || 'Unknown User'}
                    </span>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {task.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Created {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      {task.completedAt && (
                        <span className="block">
                          Completed {format(new Date(task.completedAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-gray-600 hover:text-primary"
                      >
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;