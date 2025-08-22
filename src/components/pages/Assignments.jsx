import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("course");
  
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (courseId) {
        const [assignmentsData, courseData] = await Promise.all([
          assignmentService.getByCourse(parseInt(courseId)),
          courseService.getById(parseInt(courseId))
        ]);
        setAssignments(assignmentsData || []);
        setCourse(courseData);
      } else {
        const assignmentsData = await assignmentService.getAll();
        setAssignments(assignmentsData || []);
        setCourse(null);
      }
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError("Failed to load assignments. Please try again.");
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleBack = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate("/courses");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }
    
    try {
      await assignmentService.delete(assignmentId);
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
      toast.success("Assignment deleted successfully");
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error("Failed to delete assignment");
    }
  };

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      const updatedAssignment = await assignmentService.update(assignmentId, { status: newStatus });
      setAssignments(prev => prev.map(a => a.Id === assignmentId ? updatedAssignment : a));
      toast.success(`Assignment marked as ${newStatus}`);
    } catch (err) {
      console.error("Error updating assignment:", err);
      toast.error("Failed to update assignment");
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "success";
      case "submitted": return "info";
      case "in progress": return "warning";
      case "overdue": return "error";
      default: return "secondary";
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !["completed", "submitted"].includes(assignments.find(a => a.dueDate === dueDate)?.status?.toLowerCase());
  };

  // Filter and sort assignments
  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || assignment.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "dueDate":
          aVal = new Date(a.dueDate);
          bVal = new Date(b.dueDate);
          break;
        case "priority":
          const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
          aVal = priorityOrder[a.priority?.toLowerCase()] || 0;
          bVal = priorityOrder[b.priority?.toLowerCase()] || 0;
          break;
        case "status":
          aVal = a.status?.toLowerCase() || "";
          bVal = b.status?.toLowerCase() || "";
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              {course ? `${course.name} - Assignments` : "All Assignments"}
            </h1>
            <p className="text-gray-600 mt-1">
              {course ? `${course.code} • ${filteredAndSortedAssignments.length} assignments` : `${filteredAndSortedAssignments.length} total assignments`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="submitted">Submitted</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-full flex items-center justify-center space-x-2"
              >
                <ApperIcon name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} size={16} />
                <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      {filteredAndSortedAssignments.length === 0 ? (
        <Empty
          title="No assignments found"
          message={searchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "No assignments available"}
          icon="FileText"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedAssignments.map((assignment) => (
            <Card key={assignment.Id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                      <Badge variant={getStatusVariant(assignment.status)} size="sm">
                        {assignment.status || "Pending"}
                      </Badge>
                      {assignment.priority && (
                        <Badge variant={getPriorityVariant(assignment.priority)} size="sm">
                          {assignment.priority} Priority
                        </Badge>
                      )}
                      {isOverdue(assignment.dueDate) && (
                        <Badge variant="error" size="sm">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    {assignment.description && (
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={16} />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      {assignment.points && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Award" size={16} />
                          <span>{assignment.points} points</span>
                        </div>
                      )}
                      {assignment.submissionType && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="FileText" size={16} />
                          <span>{assignment.submissionType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    {assignment.status !== "completed" && assignment.status !== "submitted" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusUpdate(assignment.Id, "completed")}
                          className="flex items-center space-x-1"
                        >
                          <ApperIcon name="Check" size={14} />
                          <span>Complete</span>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusUpdate(assignment.Id, "submitted")}
                          className="flex items-center space-x-1"
                        >
                          <ApperIcon name="Send" size={14} />
                          <span>Submit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(assignment.Id, "in progress")}
                          className="flex items-center space-x-1"
                        >
                          <ApperIcon name="Clock" size={14} />
                          <span>In Progress</span>
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Assignment details coming soon")}
                      className="flex items-center space-x-1"
                    >
                      <ApperIcon name="Eye" size={14} />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAssignment(assignment.Id)}
                      className="flex items-center space-x-1 text-error border-error hover:bg-error hover:text-white"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredAndSortedAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-primary" />
              <span>Assignment Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedAssignments.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {filteredAndSortedAssignments.filter(a => ["completed", "submitted"].includes(a.status?.toLowerCase())).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {filteredAndSortedAssignments.filter(a => a.status?.toLowerCase() === "in progress").length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center p-4 bg-info/10 rounded-lg">
                <div className="text-2xl font-bold text-info">
                  {filteredAndSortedAssignments.filter(a => ["pending", ""].includes(a.status?.toLowerCase() || "")).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-error/10 rounded-lg">
                <div className="text-2xl font-bold text-error">
                  {filteredAndSortedAssignments.filter(a => isOverdue(a.dueDate)).length}
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assignments;