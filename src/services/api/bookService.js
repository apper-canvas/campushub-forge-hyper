import bookData from '@/services/mockData/books.json';

let books = [...bookData];
let nextId = Math.max(...books.map(book => book.Id)) + 1;

export const bookService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...books];
  },

  async getById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    const book = books.find(book => book.Id === id);
    if (!book) {
      throw new Error('Book not found');
    }
    return { ...book };
  },

  async create(bookData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate required fields
    const requiredFields = ['title', 'author', 'isbn', 'genre', 'publicationYear', 'totalCopies'];
    for (const field of requiredFields) {
      if (!bookData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Check for duplicate ISBN
    if (books.some(book => book.isbn === bookData.isbn)) {
      throw new Error('A book with this ISBN already exists');
    }

    const newBook = {
      ...bookData,
      Id: nextId++,
      availableCopies: bookData.totalCopies,
      dateAdded: new Date().toISOString()
    };

    books.push(newBook);
    return { ...newBook };
  },

  async update(id, bookData) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const bookIndex = books.findIndex(book => book.Id === id);
    if (bookIndex === -1) {
      throw new Error('Book not found');
    }

    // Check for duplicate ISBN (excluding current book)
    if (bookData.isbn && books.some(book => book.isbn === bookData.isbn && book.Id !== id)) {
      throw new Error('A book with this ISBN already exists');
    }

    const currentBook = books[bookIndex];
    const updatedBook = {
      ...currentBook,
      ...bookData,
      Id: id, // Ensure ID doesn't change
      // Update available copies if total copies changed
      availableCopies: bookData.totalCopies !== undefined 
        ? Math.max(0, currentBook.availableCopies + (bookData.totalCopies - currentBook.totalCopies))
        : currentBook.availableCopies
    };

    books[bookIndex] = updatedBook;
    return { ...updatedBook };
  },

  async delete(id) {
    if (!Number.isInteger(id)) {
      throw new Error('ID must be an integer');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const bookIndex = books.findIndex(book => book.Id === id);
    if (bookIndex === -1) {
      throw new Error('Book not found');
    }

    books.splice(bookIndex, 1);
    return true;
  },

  // Helper method to update available copies (used by issue service)
  async updateAvailableCopies(id, change) {
    const bookIndex = books.findIndex(book => book.Id === id);
    if (bookIndex === -1) {
      throw new Error('Book not found');
    }

    const book = books[bookIndex];
    const newAvailableCount = book.availableCopies + change;
    
    if (newAvailableCount < 0 || newAvailableCount > book.totalCopies) {
      throw new Error('Invalid copy count');
    }

    books[bookIndex] = {
      ...book,
      availableCopies: newAvailableCount
    };

    return books[bookIndex];
  }
};