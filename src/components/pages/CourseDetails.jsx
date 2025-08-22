import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      const courseId = parseInt(id);
      const [courseData, assignmentsData] = await Promise.all([
        courseService.getById(courseId),
        assignmentService.getByCourse(courseId)
      ]);
      
      setCourse(courseData);
      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error("Error loading course details:", err);
      setError("Failed to load course details. Please try again.");
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCourseDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/courses");
  };

  const handleViewAssignments = () => {
    navigate(`/assignments?course=${course.Id}`);
  };

  const handleViewGrades = () => {
    navigate(`/grades?course=${course.Id}`);
  };

  const getGradeColor = (grade) => {
    if (!grade) return "default";
    if (grade.includes("A")) return "success";
    if (grade.includes("B")) return "primary";
    if (grade.includes("C")) return "warning";
    if (grade.includes("D")) return "info";
    return "error";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "success";
    if (progress >= 60) return "primary";
    if (progress >= 40) return "warning";
    return "error";
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 85) return "success";
    if (attendance >= 75) return "primary";
    if (attendance >= 65) return "warning";
    return "error";
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadCourseDetails} />;
  if (!course) {
    return (
      <Empty
        title="Course not found"
        message="The requested course could not be found."
        icon="BookOpen"
      />
    );
  }

  const upcomingAssignments = assignments.filter(a => new Date(a.dueDate) > new Date()).slice(0, 3);

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
            <span>Back to Courses</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">{course.name}</h1>
            <p className="text-gray-600 mt-1">{course.code} • {course.credits} Credits</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getGradeColor(course.grade)} size="lg">
            Grade: {course.grade || "Not Graded"}
          </Badge>
        </div>
      </div>

      {/* Course Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2 font-display">
              {course.progress}%
            </div>
            <div className="text-sm text-gray-600 mb-3">Course Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${
                  course.progress >= 80 ? "from-success to-emerald-600" :
                  course.progress >= 60 ? "from-primary to-secondary" :
                  course.progress >= 40 ? "from-warning to-orange-600" :
                  "from-error to-red-600"
                }`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Users" className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success mb-2 font-display">
              {course.attendance}%
            </div>
            <div className="text-sm text-gray-600 mb-3">Attendance Rate</div>
            <Badge variant={getAttendanceColor(course.attendance)}>
              {course.attendance >= 85 ? "Excellent" :
               course.attendance >= 75 ? "Good" :
               course.attendance >= 65 ? "Fair" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" className="w-6 h-6 text-info" />
            </div>
            <div className="text-3xl font-bold text-info mb-2 font-display">
              {course.assignments}
            </div>
            <div className="text-sm text-gray-600 mb-3">Total Assignments</div>
            <div className="text-xs text-gray-500">
              {upcomingAssignments.length} upcoming
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty and Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="User" className="w-5 h-5 text-primary" />
              <span>Faculty & Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Instructor</h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{course.facultyName}</div>
                  <div className="text-sm text-gray-600">Course Instructor</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Class Schedule</h4>
              <div className="space-y-2">
                {course.schedule.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <ApperIcon name="Clock" className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{slot}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Syllabus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
              <span>Course Syllabus</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{course.syllabus}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Credits: {course.credits}</span>
                <span>Course Code: {course.code}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Assignments */}
      {upcomingAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
                <span>Upcoming Assignments</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewAssignments}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-orange-500/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{assignment.title}</div>
                      <div className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">
                    {assignment.status || "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleViewAssignments}
          className="flex items-center justify-center space-x-2 h-12"
        >
          <ApperIcon name="FileText" size={18} />
          <span>View Assignments</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleViewGrades}
          className="flex items-center justify-center space-x-2 h-12"
        >
          <ApperIcon name="BarChart3" size={18} />
          <span>View Grades</span>
        </Button>
      </div>
    </div>
  );
};

export default CourseDetails;