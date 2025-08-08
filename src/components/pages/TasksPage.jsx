import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { taskService } from "@/services/api/taskService";
import TaskHeader from "@/components/organisms/TaskHeader";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import TaskCreateForm from "@/components/organisms/TaskCreateForm";
import ProgressIndicator from "@/components/organisms/ProgressIndicator";
import QuickAddTask from "@/components/organisms/QuickAddTask";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const tasksData = await taskService.getAll();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = () => {
    loadTasks(); // Refresh tasks when any task is updated
  };

  const handleCreateTask = () => {
    setShowCreateForm(true);
  };

  const handleTaskCreated = () => {
    loadTasks();
    setShowCreateForm(false);
  };

  // Calculate task counts for different filters
  const getTaskCounts = () => {
    const total = tasks.length;
    const active = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;
    
    // Category counts (active tasks only)
    const categoryTasks = {};
    tasks.filter(task => !task.completed).forEach(task => {
      categoryTasks[task.categoryId] = (categoryTasks[task.categoryId] || 0) + 1;
    });
    
    return { total, active, completed, categoryTasks };
  };

  const taskCounts = getTaskCounts();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              <ProgressIndicator
                completedTasks={taskCounts.completed}
                totalTasks={taskCounts.total}
              />
              
              <div className="card p-6">
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  taskCounts={taskCounts.categoryTasks}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9">
            <div className="space-y-8">
              {/* Header */}
              <TaskHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                taskCounts={taskCounts}
                onCreateTask={handleCreateTask}
              />

              {/* Mobile Progress */}
              <div className="lg:hidden">
                <ProgressIndicator
                  completedTasks={taskCounts.completed}
                  totalTasks={taskCounts.total}
                />
              </div>

              {/* Mobile Categories */}
              <div className="lg:hidden card p-4">
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  taskCounts={taskCounts.categoryTasks}
                />
              </div>

              {/* Create Form */}
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TaskCreateForm
                    onTaskCreated={handleTaskCreated}
                    onClose={() => setShowCreateForm(false)}
                  />
                </motion.div>
              )}

              {/* Task List */}
              <div>
                <TaskList
                  activeFilter={activeFilter}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add FAB */}
      <QuickAddTask onTaskCreated={handleTaskUpdate} />
    </div>
  );
};

export default TasksPage;