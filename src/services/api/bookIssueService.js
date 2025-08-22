const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const bookIssueService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "bookId" } },
          { field: { Name: "studentId" } },
          { field: { Name: "issueDate" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "returnDate" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.fetchRecords('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching book issues:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching book issues:", error);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "bookId" } },
          { field: { Name: "studentId" } },
          { field: { Name: "issueDate" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "returnDate" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.getRecordById('BookIssues', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching book issue:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching book issue:", error);
        throw error;
      }
    }
  },

  async create(issueData) {
    try {
      const recordData = {
        ...issueData,
        bookId: parseInt(issueData.bookId),
        studentId: parseInt(issueData.studentId),
        issueDate: new Date().toISOString().split('T')[0],
        status: 'issued',
        returnDate: null
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create book issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating book issue:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating book issue:", error);
        throw error;
      }
    }
  },

  async returnBook(id) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status: 'returned',
          returnDate: new Date().toISOString().split('T')[0]
        }]
      };

      const response = await apperClient.updateRecord('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to return book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error returning book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error returning book:", error);
        throw error;
      }
    }
  },

  async update(id, issueData) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...issueData }]
      };

      const response = await apperClient.updateRecord('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update book issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating book issue:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating book issue:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete book issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting book issue:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting book issue:", error);
        throw error;
      }
    }
  },

  async getByStudent(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "bookId" } },
          { field: { Name: "studentId" } },
          { field: { Name: "issueDate" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "returnDate" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "studentId",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching book issues by student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching book issues by student:", error);
        throw error;
      }
    }
  },

  async getByBook(bookId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "bookId" } },
          { field: { Name: "studentId" } },
          { field: { Name: "issueDate" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "returnDate" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "bookId",
            Operator: "EqualTo",
            Values: [parseInt(bookId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching book issues by book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching book issues by book:", error);
        throw error;
      }
    }
  },

  async getOverdueBooks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "bookId" } },
          { field: { Name: "studentId" } },
          { field: { Name: "issueDate" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "returnDate" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["issued"]
          },
          {
            FieldName: "dueDate",
            Operator: "LessThan",
            Values: [today]
          }
        ]
      };

      const response = await apperClient.fetchRecords('BookIssues', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching overdue books:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching overdue books:", error);
        throw error;
      }
    }
  }
};