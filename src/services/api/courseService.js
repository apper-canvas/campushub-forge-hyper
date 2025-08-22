const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const courseService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name" } },
          { field: { Name: "code" } },
          { field: { Name: "facultyId" } },
          { field: { Name: "facultyName" } },
          { field: { Name: "credits" } },
          { field: { Name: "schedule" } },
          { field: { Name: "syllabus" } },
          { field: { Name: "progress" } },
          { field: { Name: "attendance" } },
          { field: { Name: "assignments" } },
          { field: { Name: "grade" } }
        ]
      };

      const response = await apperClient.fetchRecords('Courses', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching courses:", error);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name" } },
          { field: { Name: "code" } },
          { field: { Name: "facultyId" } },
          { field: { Name: "facultyName" } },
          { field: { Name: "credits" } },
          { field: { Name: "schedule" } },
          { field: { Name: "syllabus" } },
          { field: { Name: "progress" } },
          { field: { Name: "attendance" } },
          { field: { Name: "assignments" } },
          { field: { Name: "grade" } }
        ]
      };

      const response = await apperClient.getRecordById('Courses', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching course:", error);
        throw error;
      }
    }
  },

  async create(courseData) {
    try {
      const params = {
        records: [courseData]
      };

      const response = await apperClient.createRecord('Courses', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating course:", error);
        throw error;
      }
    }
  },

  async update(id, courseData) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...courseData }]
      };

      const response = await apperClient.updateRecord('Courses', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating course:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Courses', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting course:", error);
        throw error;
      }
    }
  },

  async getEnrolledCourses(studentId) {
    return this.getAll(); // For now, return all courses
  }
};