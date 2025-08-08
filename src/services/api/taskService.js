import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedTask = { ...tasks[index], ...updates };
    
    // If marking as completed, set completedAt timestamp
    if (updates.completed === true && !tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    }
    
    // If marking as not completed, clear completedAt timestamp
    if (updates.completed === false) {
      updatedTask.completedAt = null;
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    return true;
  },

  async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(task => task.categoryId === parseInt(categoryId));
  },

  async getByStatus(completed) {
    await delay(250);
    return tasks.filter(task => task.completed === completed);
  },

  async getByPriority(priority) {
    await delay(250);
    return tasks.filter(task => task.priority === priority);
  }
};