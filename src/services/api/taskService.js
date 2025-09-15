const tableName = 'task_c';

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
    ...(data.title !== undefined && { title_c: data.title }),
    ...(data.description !== undefined && { description_c: data.description }),
    ...(data.generatedDescription !== undefined && { generated_description_c: data.generatedDescription }),
    ...(data.priority !== undefined && { priority_c: data.priority }),
    ...(data.dueDate !== undefined && { due_date_c: data.dueDate }),
    ...(data.completed !== undefined && { completed_c: data.completed }),
    ...(data.createdAt !== undefined && { created_at_c: data.createdAt }),
    ...(data.completedAt !== undefined && { completed_at_c: data.completedAt }),
...(data.categoryId !== undefined && { category_id_c: parseInt(data.categoryId) }),
    ...(data.assignedTo !== undefined && { assignedTo: parseInt(data.assignedTo) })
  };
};

// Field mapping helper - converts database field names to UI field names
const mapFromDatabase = (data) => {
  return {
    Id: data.Id,
    title: data.title_c,
    description: data.description_c,
    generatedDescription: data.generated_description_c,
    priority: data.priority_c,
    dueDate: data.due_date_c,
    completed: data.completed_c,
    createdAt: data.created_at_c,
    completedAt: data.completed_at_c,
categoryId: data.category_id_c?.Id || data.category_id_c,
    assignedTo: data.assignedTo?.Id || data.assignedTo
  };
};

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "generated_description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
{"field": {"Name": "category_id_c"}},
          {"field": {"Name": "assignedTo"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data ? response.data.map(mapFromDatabase) : [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
{"field": {"Name": "category_id_c"}},
          {"field": {"Name": "assignedTo"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      return mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      const dbData = mapToDatabase({
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
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
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          return mapFromDatabase(successful[0].data);
        }
      }

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      // Handle completion timestamp logic
      let finalUpdates = { ...updates };
      if (updates.completed === true) {
        finalUpdates.completedAt = new Date().toISOString();
      } else if (updates.completed === false) {
        finalUpdates.completedAt = null;
      }

      const dbData = {
        Id: parseInt(id),
        ...mapToDatabase(finalUpdates)
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
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          return mapFromDatabase(successful[0].data);
        }
      }

      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete task:`, failed);
          return false;
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByCategory(categoryId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
{"field": {"Name": "category_id_c"}},
          {"field": {"Name": "assignedTo"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data ? response.data.map(mapFromDatabase) : [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStatus(completed) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
{"field": {"Name": "category_id_c"}},
          {"field": {"Name": "assignedTo"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [completed]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data ? response.data.map(mapFromDatabase) : [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByPriority(priority) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
{"field": {"Name": "category_id_c"}},
          {"field": {"Name": "assignedTo"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data ? response.data.map(mapFromDatabase) : [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error?.response?.data?.message || error);
      return [];
    }
},

  async generateDescription(title) {
    try {
      const response = await fetch(`https://test-api.apper.io/fn/${import.meta.env.VITE_GENERATE_TASK_DESCRIPTION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate description');
      }

      return data.description;
    } catch (error) {
      console.error("Error generating description:", error?.message || error);
      throw error;
    }
  }
};