import React from "react";
import Error from "@/components/ui/Error";
const tableName = 'category_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Field mapping helper - converts UI field names to database field names
const mapToDatabase = (data) => {
  return {
    ...(data.name !== undefined && { name_c: data.name }),
    ...(data.color !== undefined && { color_c: data.color }),
    ...(data.icon !== undefined && { icon_c: data.icon }),
    ...(data.taskCount !== undefined && { task_count_c: data.taskCount })
  };
};

// Field mapping helper - converts database field names to UI field names
const mapFromDatabase = (data) => {
  return {
    Id: data.Id,
    name: data.name_c,
    color: data.color_c,
    icon: data.icon_c,
    taskCount: data.task_count_c || 0
  };
};

// Helper to get task count for a category
const getTaskCountForCategory = async (categoryId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [{"field": {"Name": "Id"}}],
      where: [
        {"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]},
        {"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]}
      ]
    };

    const response = await apperClient.fetchRecords('task_c', params);
    
    if (!response.success) {
      console.error('Error fetching task count:', response.message);
      return 0;
    }

    return response.data ? response.data.length : 0;
  } catch (error) {
    console.error('Error fetching task count:', error);
    return 0;
  }
};

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Update task counts dynamically for each category
      const categories = response.data.map(mapFromDatabase);
      
      // Get current task counts for all categories
      for (const category of categories) {
        category.taskCount = await getTaskCountForCategory(category.Id);
      }

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const category = mapFromDatabase(response.data);
      
      // Update task count dynamically
      category.taskCount = await getTaskCountForCategory(parseInt(id));
      
      return category;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      const dbData = mapToDatabase({
        ...categoryData,
        taskCount: 0
      });

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          return mapFromDatabase(successful[0].data);
        }
      }

      throw new Error("Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const dbData = {
        Id: parseInt(id),
        ...mapToDatabase(updates)
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          return mapFromDatabase(successful[0].data);
        }
      }

      throw new Error("Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete category:`, failed);
          return false;
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
}
  }
};