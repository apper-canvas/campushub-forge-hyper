const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const announcementService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "priority" } },
          { field: { Name: "sender" } },
          { field: { Name: "course" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isRead" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching announcements:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching announcements:", error);
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
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "priority" } },
          { field: { Name: "sender" } },
          { field: { Name: "course" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isRead" } }
        ]
      };

      const response = await apperClient.getRecordById('Announcements', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching announcement:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching announcement:", error);
        throw error;
      }
    }
  },

  async getRecent(limit = 5) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "priority" } },
          { field: { Name: "sender" } },
          { field: { Name: "course" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isRead" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent announcements:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching recent announcements:", error);
        throw error;
      }
    }
  },

  async getByCourse(courseCode) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "priority" } },
          { field: { Name: "sender" } },
          { field: { Name: "course" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isRead" } }
        ],
        where: [
          {
            FieldName: "course",
            Operator: "EqualTo",
            Values: [courseCode]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching announcements by course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching announcements by course:", error);
        throw error;
      }
    }
  },

  async getUnread() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "priority" } },
          { field: { Name: "sender" } },
          { field: { Name: "course" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "isRead" } }
        ],
        where: [
          {
            FieldName: "isRead",
            Operator: "EqualTo",
            Values: [false]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching unread announcements:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching unread announcements:", error);
        throw error;
      }
    }
  },

  async create(announcementData) {
    try {
      const recordData = {
        ...announcementData,
        createdAt: new Date().toISOString(),
        isRead: false
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create announcement ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating announcement:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating announcement:", error);
        throw error;
      }
    }
  },

  async update(id, announcementData) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...announcementData }]
      };

      const response = await apperClient.updateRecord('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update announcement ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating announcement:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating announcement:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete announcement ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting announcement:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting announcement:", error);
        throw error;
      }
    }
  },

  async markAsRead(id) {
    try {
      const params = {
        records: [{ Id: parseInt(id), isRead: true }]
      };

      const response = await apperClient.updateRecord('Announcements', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to mark announcement as read ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking announcement as read:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error marking announcement as read:", error);
        throw error;
      }
    }
  }
};