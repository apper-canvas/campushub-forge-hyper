import attendanceData from "@/services/mockData/attendance.json";

export const attendanceService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...attendanceData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const record = attendanceData.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentAndCourse(studentId, courseId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return attendanceData.filter(a => 
      a.studentId === parseInt(studentId) && a.courseId === parseInt(courseId)
    ).map(record => ({ ...record }));
  },

  async getByStudent(studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return attendanceData.filter(a => a.studentId === parseInt(studentId))
      .map(record => ({ ...record }));
  },

  async create(attendanceRecord) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...attendanceData.map(a => a.Id)) + 1;
    const newRecord = { Id: newId, ...attendanceRecord };
    attendanceData.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceRecord) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = attendanceData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendanceData[index] = { ...attendanceData[index], ...attendanceRecord };
    return { ...attendanceData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = attendanceData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deletedRecord = attendanceData.splice(index, 1)[0];
    return { ...deletedRecord };
  },

  async calculateAttendancePercentage(studentId, courseId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const records = attendanceData.filter(a => 
      a.studentId === parseInt(studentId) && a.courseId === parseInt(courseId)
    );
    
    if (records.length === 0) return 0;
    
    const presentCount = records.filter(r => r.status === "present" || r.status === "late").length;
    return Math.round((presentCount / records.length) * 100);
  }
};