import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { userService } from "@/services/api/userService";
import TaskItem from "@/components/organisms/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const TaskList = ({ activeFilter, selectedCategory, searchQuery, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
const [tasksData, categoriesData, usersData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (onTaskUpdate) onTaskUpdate();
      
      toast.success(completed ? "Task completed! 🎉" : "Task reopened");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      
      if (onTaskUpdate) onTaskUpdate();
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (onTaskUpdate) onTaskUpdate();
      toast.success("Task updated");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Filter by status
    if (activeFilter === "active") {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeFilter === "completed") {
      filtered = filtered.filter(task => task.completed);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory.Id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Finally by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    return <Empty 
      title="No tasks found" 
      description="No tasks match your current filters. Try adjusting your search or filters." 
    />;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => {
const taskCategory = categories.find(cat => cat.Id === task.categoryId);
          const assignedUser = users.find(user => user.Id === task.assignedTo);
          return (
            <motion.div
              key={task.Id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
            >
              <TaskItem
                task={task}
                category={taskCategory}
                categories={categories}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;