import bookIssueData from '@/services/mockData/bookIssues.json';
import { bookService } from './bookService.js';

let bookIssues = [...bookIssueData];
let nextId = Math.max(...bookIssues.map(issue => issue.Id)) + 1;

export const bookIssueService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...bookIssues];
  },

  async getById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    const issue = bookIssues.find(issue => issue.Id === id);
    if (!issue) {
      throw new Error('Book issue not found');
    }
    return { ...issue };
  },

  async create(issueData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate required fields
    const requiredFields = ['bookId', 'studentId', 'dueDate'];
    for (const field of requiredFields) {
      if (!issueData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Check if book is available
    try {
      const book = await bookService.getById(issueData.bookId);
      if (book.availableCopies === 0) {
        throw new Error('Book is not available for issue');
      }
    } catch (err) {
      throw new Error('Invalid book ID');
    }

    const newIssue = {
      ...issueData,
      Id: nextId++,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'issued',
      returnDate: null
    };

    bookIssues.push(newIssue);

    // Update book's available copies
    await bookService.updateAvailableCopies(issueData.bookId, -1);

    return { ...newIssue };
  },

  async returnBook(id) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const issueIndex = bookIssues.findIndex(issue => issue.Id === id);
    if (issueIndex === -1) {
      throw new Error('Book issue not found');
    }

    const issue = bookIssues[issueIndex];
    if (issue.status === 'returned') {
      throw new Error('Book is already returned');
    }

    const updatedIssue = {
      ...issue,
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0]
    };

    bookIssues[issueIndex] = updatedIssue;

    // Update book's available copies
    await bookService.updateAvailableCopies(issue.bookId, 1);

    return { ...updatedIssue };
  },

  async update(id, issueData) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const issueIndex = bookIssues.findIndex(issue => issue.Id === id);
    if (issueIndex === -1) {
      throw new Error('Book issue not found');
    }

    const updatedIssue = {
      ...bookIssues[issueIndex],
      ...issueData,
      Id: id // Ensure ID doesn't change
    };

    bookIssues[issueIndex] = updatedIssue;
    return { ...updatedIssue };
  },

  async delete(id) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const issueIndex = bookIssues.findIndex(issue => issue.Id === id);
    if (issueIndex === -1) {
      throw new Error('Book issue not found');
    }

    const issue = bookIssues[issueIndex];
    
    // If book was issued and not returned, return it first
    if (issue.status === 'issued') {
      await bookService.updateAvailableCopies(issue.bookId, 1);
    }

    bookIssues.splice(issueIndex, 1);
    return true;
  },

  async getByStudent(studentId) {
    if (!Number.isInteger(studentId)) {
      throw new Error('Student ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return bookIssues.filter(issue => issue.studentId === studentId);
  },

  async getByBook(bookId) {
    if (!Number.isInteger(bookId)) {
      throw new Error('Book ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return bookIssues.filter(issue => issue.bookId === bookId);
  },

  async getOverdueBooks() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    return bookIssues.filter(issue => 
      issue.status === 'issued' && issue.dueDate < today
    );
  }
};