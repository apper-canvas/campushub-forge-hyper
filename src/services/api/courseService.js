import coursesData from "@/services/mockData/courses.json";

export const courseService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...coursesData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const course = coursesData.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...coursesData.map(c => c.Id)) + 1;
    const newCourse = { Id: newId, ...courseData };
    coursesData.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = coursesData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    coursesData[index] = { ...coursesData[index], ...courseData };
    return { ...coursesData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = coursesData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    const deletedCourse = coursesData.splice(index, 1)[0];
    return { ...deletedCourse };
  },

  async getEnrolledCourses(studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...coursesData];
  }
};