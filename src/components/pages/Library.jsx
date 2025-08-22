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
  const [genreFilter, setGenreFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

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
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn?.includes(searchTerm);
    const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && book.availableCopies > 0) ||
                               (availabilityFilter === 'unavailable' && book.availableCopies === 0);
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Library</h1>
          <p className="text-gray-600">Browse and search through our book collection</p>
        </div>
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
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
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
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Books</option>
                <option value="available">Available</option>
                <option value="unavailable">Out of Stock</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Empty message="No books found matching your criteria" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <Card key={book.Id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{book.genre}</Badge>
                    <span className="text-sm text-gray-500">{book.publicationYear}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>ISBN: {book.isbn}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className={`font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                      <p className="text-gray-500">
                        {book.availableCopies}/{book.totalCopies} copies
                      </p>
                    </div>
                    
                    {book.availableCopies > 0 && (
                      <Button size="sm" className="text-xs">
                        <ApperIcon name="Plus" size={12} />
                        Issue
                      </Button>
                    )}
                  </div>
                  
                  {book.description && (
                    <div className="text-sm text-gray-600">
                      <p className="line-clamp-2">{book.description}</p>
                    </div>
                  )}
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