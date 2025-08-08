import categoriesData from "@/services/mockData/categories.json";
import { taskService } from "./taskService";

let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(200);
    // Update task counts dynamically
    const tasks = await taskService.getAll();
    const updatedCategories = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.Id && !task.completed).length
    }));
    return [...updatedCategories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(cat => cat.Id === parseInt(id));
    if (!category) return null;
    
    // Update task count dynamically
    const tasks = await taskService.getAll();
    const taskCount = tasks.filter(task => task.categoryId === parseInt(id) && !task.completed).length;
    
    return { ...category, taskCount };
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updates) {
    await delay(250);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedCategory = { ...categories[index], ...updates };
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) return false;
    
    categories.splice(index, 1);
    return true;
  }
};