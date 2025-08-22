const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "studentId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "assignmentId" } },
          { field: { Name: "examType" } },
          { field: { Name: "marks" } },
          { field: { Name: "totalMarks" } },
          { field: { Name: "feedback" } },
          { field: { Name: "gradedDate" } }
        ]
      };

      const response = await apperClient.fetchRecords('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades:", error);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "studentId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "assignmentId" } },
          { field: { Name: "examType" } },
          { field: { Name: "marks" } },
          { field: { Name: "totalMarks" } },
          { field: { Name: "feedback" } },
          { field: { Name: "gradedDate" } }
        ]
      };

      const response = await apperClient.getRecordById('Grades', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grade:", error);
        throw error;
      }
    }
  },

  async getByStudent(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "studentId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "assignmentId" } },
          { field: { Name: "examType" } },
          { field: { Name: "marks" } },
          { field: { Name: "totalMarks" } },
          { field: { Name: "feedback" } },
          { field: { Name: "gradedDate" } }
        ],
        where: [
          {
            FieldName: "studentId",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by student:", error);
        throw error;
      }
    }
  },

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "studentId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "assignmentId" } },
          { field: { Name: "examType" } },
          { field: { Name: "marks" } },
          { field: { Name: "totalMarks" } },
          { field: { Name: "feedback" } },
          { field: { Name: "gradedDate" } }
        ],
        where: [
          {
            FieldName: "courseId",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by course:", error);
        throw error;
      }
    }
  },

  async getByStudentAndCourse(studentId, courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "studentId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "assignmentId" } },
          { field: { Name: "examType" } },
          { field: { Name: "marks" } },
          { field: { Name: "totalMarks" } },
          { field: { Name: "feedback" } },
          { field: { Name: "gradedDate" } }
        ],
        where: [
          {
            FieldName: "studentId",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          },
          {
            FieldName: "courseId",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student and course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by student and course:", error);
        throw error;
      }
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [gradeData]
      };

      const response = await apperClient.createRecord('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating grade:", error);
        throw error;
      }
    }
  },

  async update(id, gradeData) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...gradeData }]
      };

      const response = await apperClient.updateRecord('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating grade:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Grades', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting grade:", error);
        throw error;
      }
    }
  },

  async calculateGPA(studentId) {
    try {
      const studentGrades = await this.getByStudent(studentId);
      
      if (studentGrades.length === 0) return 0;
      
      const totalPoints = studentGrades.reduce((sum, grade) => {
        const percentage = (grade.marks / (grade.totalMarks || 100)) * 100;
        let points = 0;
        
        if (percentage >= 90) points = 4.0;
        else if (percentage >= 80) points = 3.0;
        else if (percentage >= 70) points = 2.0;
        else if (percentage >= 60) points = 1.0;
        
        return sum + points;
      }, 0);
      
      return (totalPoints / studentGrades.length).toFixed(2);
    } catch (error) {
      console.error("Error calculating GPA:", error);
      return 0;
    }
  }
};