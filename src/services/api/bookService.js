import React from "react";
import Error from "@/components/ui/Error";
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const bookService = {
  async getAll() {
    try {
const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "isbn_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "publication_year_c" } },
          { field: { Name: "total_copies_c" } },
          { field: { Name: "available_copies_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_added_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('book_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching books:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching books:", error);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "isbn_c" } },
          { field: { Name: "genre_c" } },
          { field: { Name: "publication_year_c" } },
          { field: { Name: "total_copies_c" } },
          { field: { Name: "available_copies_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_added_c" } }
        ]
      };

      const response = await apperClient.getRecordById('book_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching book:", error);
        throw error;
      }
    }
  },

  async create(bookData) {
    try {
const recordData = {
        Name: bookData.Name || bookData.title_c,
        title_c: bookData.title_c,
        author_c: bookData.author_c,
        isbn_c: bookData.isbn_c,
        genre_c: bookData.genre_c,
        publication_year_c: bookData.publication_year_c,
        total_copies_c: bookData.total_copies_c,
        available_copies_c: bookData.total_copies_c,
        description_c: bookData.description_c,
        date_added_c: new Date().toISOString()
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('book_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating book:", error);
        throw error;
      }
    }
  },

async update(id, bookData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (bookData.Name !== undefined) updateData.Name = bookData.Name;
      if (bookData.title_c !== undefined) updateData.title_c = bookData.title_c;
      if (bookData.author_c !== undefined) updateData.author_c = bookData.author_c;
      if (bookData.isbn_c !== undefined) updateData.isbn_c = bookData.isbn_c;
      if (bookData.genre_c !== undefined) updateData.genre_c = bookData.genre_c;
      if (bookData.publication_year_c !== undefined) updateData.publication_year_c = bookData.publication_year_c;
      if (bookData.total_copies_c !== undefined) updateData.total_copies_c = bookData.total_copies_c;
      if (bookData.available_copies_c !== undefined) updateData.available_copies_c = bookData.available_copies_c;
      if (bookData.description_c !== undefined) updateData.description_c = bookData.description_c;
      if (bookData.date_added_c !== undefined) updateData.date_added_c = bookData.date_added_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('book_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating book:", error);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

const response = await apperClient.deleteRecord('book_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete book ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting book:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting book:", error);
        throw error;
      }
    }
  },

  // Helper method to update available copies (used by issue service)
  async updateAvailableCopies(id, change) {
    try {
      // Get current book data
const currentBook = await this.getById(id);
      const newAvailableCount = currentBook.available_copies_c + change;
      
      if (newAvailableCount < 0 || newAvailableCount > currentBook.total_copies_c) {
        throw new Error('Invalid copy count');
      }

      const params = {
        records: [{ Id: parseInt(id), available_copies_c: newAvailableCount }]
      };

      const response = await apperClient.updateRecord('book_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update book available copies ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating book available copies:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating book available copies:", error);
        throw error;
      }
    }
  }
};