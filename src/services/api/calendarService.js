import calendarData from "@/services/mockData/calendar.json";

export const calendarService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...calendarData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const event = calendarData.find(e => e.Id === parseInt(id));
    if (!event) {
      throw new Error("Calendar event not found");
    }
    return { ...event };
  },

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return calendarData.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    }).map(event => ({ ...event }));
  },

  async getByMonth(year, month) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return calendarData.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
    }).map(event => ({ ...event }));
  },

  async getUpcoming(days = 7) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return calendarData.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= futureDate;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(event => ({ ...event }));
  },

  async create(eventData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...calendarData.map(e => e.Id)) + 1;
    const newEvent = { Id: newId, ...eventData };
    calendarData.push(newEvent);
    return { ...newEvent };
  },

  async update(id, eventData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = calendarData.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Calendar event not found");
    }
    calendarData[index] = { ...calendarData[index], ...eventData };
    return { ...calendarData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = calendarData.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Calendar event not found");
    }
    const deletedEvent = calendarData.splice(index, 1)[0];
    return { ...deletedEvent };
  }
};