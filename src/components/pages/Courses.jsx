import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CourseCard from "@/components/molecules/CourseCard";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getEnrolledCourses(1);
      setCourses(data);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleViewCourse = (course) => {
    navigate(`/courses/${course.Id}`);
  };

  const handleViewAssignments = (course) => {
    navigate(`/assignments?course=${course.Id}`);
  };

  const handleViewGrades = (course) => {
    navigate(`/grades?course=${course.Id}`);
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.facultyName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === "all" || 
                               course.code.startsWith(selectedDepartment);
      
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "code":
          return a.code.localeCompare(b.code);
        case "progress":
          return b.progress - a.progress;
        case "attendance":
          return b.attendance - a.attendance;
        default:
          return 0;
      }
    });

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  const departments = [...new Set(courses.map(course => course.code.substring(0, 2)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your enrolled courses and track progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="lg">
            {courses.length} Enrolled
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search courses, codes, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            >
              <option value="name">Sort by Name</option>
              <option value="code">Sort by Code</option>
              <option value="progress">Sort by Progress</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          title="No courses found"
          message="Try adjusting your search criteria or filters."
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onViewDetails={handleViewCourse}
              onViewAssignments={handleViewAssignments}
              onViewGrades={handleViewGrades}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {filteredCourses.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1 font-display">
                {Math.round(filteredCourses.reduce((sum, course) => sum + course.progress, 0) / filteredCourses.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Progress</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-success/5 to-emerald-600/5 rounded-lg">
              <div className="text-2xl font-bold text-success mb-1 font-display">
                {Math.round(filteredCourses.reduce((sum, course) => sum + course.attendance, 0) / filteredCourses.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Attendance</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-accent/5 to-orange-500/5 rounded-lg">
              <div className="text-2xl font-bold text-accent mb-1 font-display">
                {filteredCourses.reduce((sum, course) => sum + course.credits, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-info/5 to-blue-600/5 rounded-lg">
              <div className="text-2xl font-bold text-info mb-1 font-display">
                {filteredCourses.reduce((sum, course) => sum + course.assignments, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;