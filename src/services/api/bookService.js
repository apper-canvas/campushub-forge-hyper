const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const bookService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "author" } },
          { field: { Name: "isbn" } },
          { field: { Name: "genre" } },
          { field: { Name: "publicationYear" } },
          { field: { Name: "totalCopies" } },
          { field: { Name: "availableCopies" } },
          { field: { Name: "description" } },
          { field: { Name: "dateAdded" } }
        ]
      };

      const response = await apperClient.fetchRecords('Books', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching books:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching books:", error);
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
          { field: { Name: "author" } },
          { field: { Name: "isbn" } },
          { field: { Name: "genre" } },
          { field: { Name: "publicationYear" } },
          { field: { Name: "totalCopies" } },
          { field: { Name: "availableCopies" } },
          { field: { Name: "description" } },
          { field: { Name: "dateAdded" } }
        ]
      };

      const response = await apperClient.getRecordById('Books', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching book:", error);
        throw error;
      }
    }
  },

  async create(bookData) {
    try {
      const recordData = {
        ...bookData,
        availableCopies: bookData.totalCopies,
        dateAdded: new Date().toISOString().split('T')[0]
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('Books', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating book:", error);
        throw error;
      }
    }
  },

  async update(id, bookData) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...bookData }]
      };

      const response = await apperClient.updateRecord('Books', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating book:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Books', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting book:", error);
        throw error;
      }
    }
  },

  // Helper method to update available copies (used by issue service)
  async updateAvailableCopies(id, change) {
    try {
      // Get current book data
      const currentBook = await this.getById(id);
      const newAvailableCount = currentBook.availableCopies + change;
      
      if (newAvailableCount < 0 || newAvailableCount > currentBook.totalCopies) {
        throw new Error('Invalid copy count');
      }

      const params = {
        records: [{ Id: parseInt(id), availableCopies: newAvailableCount }]
      };

      const response = await apperClient.updateRecord('Books', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update book available copies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating book available copies:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating book available copies:", error);
        throw error;
      }
    }
  }
};