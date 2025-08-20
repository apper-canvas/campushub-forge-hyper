import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { bookService } from '@/services/api/bookService';

function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publicationYear: '',
    totalCopies: 1,
    description: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAll();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'available' && book.availableCopies > 0) ||
                         (selectedStatus === 'unavailable' && book.availableCopies === 0);
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const genres = [...new Set(books.map(book => book.genre))];

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCopies' || name === 'publicationYear' ? parseInt(value) || '' : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.update(editingBook.Id, formData);
        toast.success('Book updated successfully');
      } else {
        await bookService.create(formData);
        toast.success('Book added successfully');
      }
      await loadBooks();
      resetForm();
    } catch (err) {
      toast.error(editingBook ? 'Failed to update book' : 'Failed to add book');
    }
  }

  async function handleDelete(book) {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await bookService.delete(book.Id);
        toast.success('Book deleted successfully');
        await loadBooks();
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  }

  function handleEdit(book) {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      description: book.description || ''
    });
    setShowAddForm(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publicationYear: '',
      totalCopies: 1,
      description: ''
    });
    setEditingBook(null);
    setShowAddForm(false);
  }

  function getStatusColor(availableCopies) {
    if (availableCopies === 0) return 'bg-red-100 text-red-800';
    if (availableCopies <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  function getStatusText(availableCopies) {
    if (availableCopies === 0) return 'Unavailable';
    if (availableCopies <= 2) return 'Limited';
    return 'Available';
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Library Catalog</h1>
          <p className="text-gray-600">Manage your book collection</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" size={16} />
          Add Book
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="title"
                  placeholder="Book Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="author"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="isbn"
                  placeholder="ISBN"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="genre"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="publicationYear"
                  type="number"
                  placeholder="Publication Year"
                  value={formData.publicationYear}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="totalCopies"
                  type="number"
                  placeholder="Total Copies"
                  value={formData.totalCopies}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button type="submit">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Empty message="No books found matching your criteria" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <Card key={book.Id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                  <Badge className={getStatusColor(book.availableCopies)}>
                    {getStatusText(book.availableCopies)}
                  </Badge>
                </div>
                <p className="text-gray-600">{book.author}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Genre:</span>
                    <span>{book.genre}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Year:</span>
                    <span>{book.publicationYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ISBN:</span>
                    <span className="font-mono">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Copies:</span>
                    <span>{book.availableCopies}/{book.totalCopies}</span>
                  </div>
                  {book.description && (
                    <p className="text-sm text-gray-600 mt-3">{book.description}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(book)}
                    >
                      <ApperIcon name="Edit" size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(book)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;