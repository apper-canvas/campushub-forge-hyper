const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const calendarService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "courseId" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.fetchRecords('Calendar', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching calendar events:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching calendar events:", error);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "courseId" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById('Calendar', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching calendar event:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching calendar event:", error);
        throw error;
      }
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "courseId" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "date",
            Operator: "LessThanOrEqualTo", 
            Values: [endDate]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Calendar', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching calendar events by date range:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching calendar events by date range:", error);
        throw error;
      }
    }
  },

  async getByMonth(year, month) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    return this.getByDateRange(startDate, endDate);
  },

  async getUpcoming(days = 7) {
    try {
      const now = new Date();
      const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "courseId" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [now.toISOString().split('T')[0]]
          },
          {
            FieldName: "date",
            Operator: "LessThanOrEqualTo",
            Values: [futureDate.toISOString().split('T')[0]]
          }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('Calendar', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming events:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching upcoming events:", error);
        throw error;
      }
    }
  },

  async create(eventData) {
    try {
      const params = {
        records: [eventData]
      };

      const response = await apperClient.createRecord('Calendar', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create calendar event ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating calendar event:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating calendar event:", error);
        throw error;
      }
    }
  },

  async update(id, eventData) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...eventData }]
      };

      const response = await apperClient.updateRecord('Calendar', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update calendar event ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating calendar event:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating calendar event:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Calendar', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete calendar event ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting calendar event:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting calendar event:", error);
        throw error;
      }
    }
  }
};