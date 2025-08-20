import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, isAfter, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { bookIssueService } from '@/services/api/bookIssueService';
import { bookService } from '@/services/api/bookService';
import { studentService } from '@/services/api/studentService';

function BookIssues() {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    studentId: '',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [issuesData, booksData, studentsData] = await Promise.all([
        bookIssueService.getAll(),
        bookService.getAll(),
        studentService.getAll()
      ]);
      setIssues(issuesData);
      setBooks(booksData);
      setStudents(studentsData);
    } catch (err) {
      setError('Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const filteredIssues = issues.filter(issue => {
    const book = getBookInfo(issue.bookId);
    const student = getStudentInfo(issue.studentId);
    const matchesSearch = book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book?.isbn?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'issued' && issue.status === 'issued') ||
                         (statusFilter === 'returned' && issue.status === 'returned') ||
                         (statusFilter === 'overdue' && issue.status === 'issued' && isOverdue(issue.dueDate));
    return matchesSearch && matchesStatus;
  });

  function getBookInfo(bookId) {
    return books.find(book => book.Id === bookId);
  }

  function getStudentInfo(studentId) {
    return students.find(student => student.Id === studentId);
  }

  function isOverdue(dueDate) {
    return isAfter(new Date(), parseISO(dueDate));
  }

  function getStatusBadge(issue) {
    if (issue.status === 'returned') {
      return <Badge className="bg-green-100 text-green-800">Returned</Badge>;
    }
    if (isOverdue(issue.dueDate)) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Issued</Badge>;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bookId' || name === 'studentId' ? parseInt(value) : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const book = books.find(b => b.Id === formData.bookId);
      if (!book || book.availableCopies === 0) {
        toast.error('Book is not available for issue');
        return;
      }

      await bookIssueService.create(formData);
      toast.success('Book issued successfully');
      await loadData();
      resetForm();
    } catch (err) {
      toast.error('Failed to issue book');
    }
  }

  async function handleReturn(issue) {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await bookIssueService.returnBook(issue.Id);
        toast.success('Book returned successfully');
        await loadData();
      } catch (err) {
        toast.error('Failed to return book');
      }
    }
  }

  async function handleDelete(issue) {
    if (window.confirm('Are you sure you want to delete this issue record?')) {
      try {
        await bookIssueService.delete(issue.Id);
        toast.success('Issue record deleted successfully');
        await loadData();
      } catch (err) {
        toast.error('Failed to delete issue record');
      }
    }
  }

  function resetForm() {
    setFormData({
      bookId: '',
      studentId: '',
      dueDate: ''
    });
    setShowIssueForm(false);
  }

  // Get default due date (2 weeks from today)
  function getDefaultDueDate() {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  }

  const availableBooks = books.filter(book => book.availableCopies > 0);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Book Issues</h1>
          <p className="text-gray-600">Track book checkouts and returns</p>
        </div>
        <Button 
          onClick={() => setShowIssueForm(true)}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" size={16} />
          Issue Book
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by book title, student name, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="issued">Currently Issued</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issue Book Form */}
      {showIssueForm && (
        <Card>
          <CardHeader>
            <CardTitle>Issue New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
                  <select
                    name="bookId"
                    value={formData.bookId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a book</option>
                    {availableBooks.map(book => (
                      <option key={book.Id} value={book.Id}>
                        {book.title} - {book.author} (Available: {book.availableCopies})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student.Id} value={student.Id}>
                        {student.name} - {student.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || getDefaultDueDate()}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Issue Book</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Issues Table */}
      {filteredIssues.length === 0 ? (
        <Empty message="No book issues found matching your criteria" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssues.map(issue => {
                    const book = getBookInfo(issue.bookId);
                    const student = getStudentInfo(issue.studentId);
                    return (
                      <tr key={issue.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {book?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {book?.author} • {book?.isbn}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student?.name || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {format(parseISO(issue.issueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={isOverdue(issue.dueDate) && issue.status === 'issued' ? 'text-red-600 font-medium' : ''}>
                            {format(parseISO(issue.dueDate), 'MMM dd, yyyy')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(issue)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {issue.status === 'issued' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReturn(issue)}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <ApperIcon name="CheckCircle" size={14} />
                                Return
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(issue)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <ApperIcon name="Trash2" size={14} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BookIssues;