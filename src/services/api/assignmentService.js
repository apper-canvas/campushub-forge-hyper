import assignmentsData from "@/services/mockData/assignments.json";

export const assignmentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...assignmentsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const assignment = assignmentsData.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return assignmentsData.filter(a => a.courseId === parseInt(courseId))
      .map(assignment => ({ ...assignment }));
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...assignmentsData.map(a => a.Id)) + 1;
    const newAssignment = { Id: newId, ...assignmentData };
    assignmentsData.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = assignmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignmentsData[index] = { ...assignmentsData[index], ...assignmentData };
    return { ...assignmentsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    const deletedAssignment = assignmentsData.splice(index, 1)[0];
    return { ...deletedAssignment };
  },

  async getPendingAssignments() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return assignmentsData.filter(a => a.status === "pending")
      .map(assignment => ({ ...assignment }));
  }
};