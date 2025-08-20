import studentsData from "@/services/mockData/students.json";

export const studentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...studentsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const student = studentsData.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...studentsData.map(s => s.Id)) + 1;
    const newStudent = { Id: newId, ...studentData };
    studentsData.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = studentsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    studentsData[index] = { ...studentsData[index], ...studentData };
    return { ...studentsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = studentsData.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    const deletedStudent = studentsData.splice(index, 1)[0];
    return { ...deletedStudent };
  }
};