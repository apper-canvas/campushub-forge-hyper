import gradesData from "@/services/mockData/grades.json";

export const gradeService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...gradesData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const grade = gradesData.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByStudent(studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return gradesData.filter(g => g.studentId === parseInt(studentId))
      .map(grade => ({ ...grade }));
  },

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return gradesData.filter(g => g.courseId === parseInt(courseId))
      .map(grade => ({ ...grade }));
  },

  async getByStudentAndCourse(studentId, courseId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return gradesData.filter(g => 
      g.studentId === parseInt(studentId) && g.courseId === parseInt(courseId)
    ).map(grade => ({ ...grade }));
  },

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...gradesData.map(g => g.Id)) + 1;
    const newGrade = { Id: newId, ...gradeData };
    gradesData.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = gradesData.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    gradesData[index] = { ...gradesData[index], ...gradeData };
    return { ...gradesData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = gradesData.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = gradesData.splice(index, 1)[0];
    return { ...deletedGrade };
  },

  async calculateGPA(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const studentGrades = gradesData.filter(g => g.studentId === parseInt(studentId));
    
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
  }
};