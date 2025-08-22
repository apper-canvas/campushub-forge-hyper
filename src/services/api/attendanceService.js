const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const attendanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "studentId" } },
          { field: { Name: "courseId" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "checkInTime" } }
        ]
      };

      const response = await apperClient.fetchRecords('Attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance records:", error);
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
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "checkInTime" } }
        ]
      };

      const response = await apperClient.getRecordById('Attendance', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance record:", error);
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
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "checkInTime" } }
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

      const response = await apperClient.fetchRecords('Attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student and course:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by student and course:", error);
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
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "checkInTime" } }
        ],
        where: [
          {
            FieldName: "studentId",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('Attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by student:", error);
        throw error;
      }
    }
  },

  async create(attendanceRecord) {
    try {
      const params = {
        records: [attendanceRecord]
      };

      const response = await apperClient.createRecord('Attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating attendance record:", error);
        throw error;
      }
    }
  },

  async update(id, attendanceRecord) {
    try {
      const params = {
        records: [{ Id: parseInt(id), ...attendanceRecord }]
      };

      const response = await apperClient.updateRecord('Attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update attendance record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating attendance record:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('Attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete attendance record ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting attendance record:", error);
        throw error;
      }
    }
  },

  async calculateAttendancePercentage(studentId, courseId) {
    try {
      const records = await this.getByStudentAndCourse(studentId, courseId);
      
      if (records.length === 0) return 0;
      
      const presentCount = records.filter(r => r.status === "present" || r.status === "late").length;
      return Math.round((presentCount / records.length) * 100);
    } catch (error) {
      console.error("Error calculating attendance percentage:", error);
      return 0;
    }
  }
};