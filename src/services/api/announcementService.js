import announcementsData from "@/services/mockData/announcements.json";

export const announcementService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...announcementsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const announcement = announcementsData.find(a => a.Id === parseInt(id));
    if (!announcement) {
      throw new Error("Announcement not found");
    }
    return { ...announcement };
  },

  async getRecent(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return announcementsData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(announcement => ({ ...announcement }));
  },

  async getByCourse(courseCode) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return announcementsData.filter(a => a.course === courseCode)
      .map(announcement => ({ ...announcement }));
  },

  async getUnread() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return announcementsData.filter(a => !a.isRead)
      .map(announcement => ({ ...announcement }));
  },

  async create(announcementData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...announcementsData.map(a => a.Id)) + 1;
    const newAnnouncement = { 
      Id: newId, 
      ...announcementData,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    announcementsData.push(newAnnouncement);
    return { ...newAnnouncement };
  },

  async update(id, announcementData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = announcementsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    announcementsData[index] = { ...announcementsData[index], ...announcementData };
    return { ...announcementsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = announcementsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    const deletedAnnouncement = announcementsData.splice(index, 1)[0];
    return { ...deletedAnnouncement };
  },

  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = announcementsData.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      announcementsData[index].isRead = true;
      return { ...announcementsData[index] };
    }
    throw new Error("Announcement not found");
  }
};