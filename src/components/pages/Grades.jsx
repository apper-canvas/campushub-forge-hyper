import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
  const [data, setData] = useState({
    grades: [],
    courses: [],
    assignments: [],
    courseStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [grades, courses, assignments] = await Promise.all([
        gradeService.getByStudent(1),
        courseService.getEnrolledCourses(1),
        assignmentService.getAll()
      ]);

      // Calculate course-wise statistics
      const courseStats = {};
      courses.forEach(course => {
        const courseGrades = grades.filter(grade => grade.courseId === course.Id);
        if (courseGrades.length > 0) {
          const totalMarks = courseGrades.reduce((sum, grade) => sum + grade.marks, 0);
          const maxMarks = courseGrades.reduce((sum, grade) => sum + (grade.totalMarks || 100), 0);
          const percentage = Math.round((totalMarks / maxMarks) * 100);
          
          courseStats[course.Id] = {
            totalMarks,
            maxMarks,
            percentage,
            gradeCount: courseGrades.length,
            letterGrade: getLetterGrade(percentage)
          };
        }
      });

      setData({
        grades,
        courses,
        assignments,
        courseStats
      });
    } catch (err) {
      console.error("Error loading grades data:", err);
      setError("Failed to load grades data. Please try again.");
      toast.error("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "B-";
    if (percentage >= 60) return "C+";
    if (percentage >= 55) return "C";
    if (percentage >= 50) return "C-";
    return "F";
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 85) return "success";
    if (percentage >= 75) return "primary";
    if (percentage >= 65) return "warning";
    if (percentage >= 50) return "info";
    return "error";
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = data.assignments.find(a => a.Id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };

  const getCourseInfo = (courseId) => {
    return data.courses.find(c => c.Id === courseId);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadGradesData} />;

  const filteredGrades = data.grades.filter(grade => {
    const matchesCourse = selectedCourse === "all" || grade.courseId === parseInt(selectedCourse);
    const matchesType = selectedType === "all" || 
      (selectedType === "assignment" && grade.assignmentId) ||
      (selectedType === "exam" && grade.examType);
    return matchesCourse && matchesType;
  });

  const overallStats = data.courses.length > 0 ? {
    totalGrades: data.grades.length,
    averagePercentage: Math.round(
      Object.values(data.courseStats).reduce((sum, stats) => sum + stats.percentage, 0) / 
      Object.values(data.courseStats).length
    ) || 0,
    gpa: calculateOverallGPA()
  } : { totalGrades: 0, averagePercentage: 0, gpa: 0.0 };

  function calculateOverallGPA() {
    const coursePercentages = Object.values(data.courseStats).map(stats => stats.percentage);
    if (coursePercentages.length === 0) return 0.0;
    
    const totalPoints = coursePercentages.reduce((sum, percentage) => {
      if (percentage >= 90) return sum + 4.0;
      if (percentage >= 85) return sum + 3.7;
      if (percentage >= 80) return sum + 3.3;
      if (percentage >= 75) return sum + 3.0;
      if (percentage >= 70) return sum + 2.7;
      if (percentage >= 65) return sum + 2.3;
      if (percentage >= 60) return sum + 2.0;
      if (percentage >= 55) return sum + 1.7;
      if (percentage >= 50) return sum + 1.0;
      return sum + 0.0;
    }, 0);
    
    return (totalPoints / coursePercentages.length).toFixed(2);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Academic Grades</h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance across all courses
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current GPA</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            {overallStats.gpa}
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 font-display">
              {overallStats.gpa}
            </div>
            <div className="text-sm text-gray-600">Current GPA</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success mb-2 font-display">
              {overallStats.averagePercentage}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" className="w-6 h-6 text-info" />
            </div>
            <div className="text-3xl font-bold text-info mb-2 font-display">
              {overallStats.totalGrades}
            </div>
            <div className="text-sm text-gray-600">Total Grades</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
            <span>Course Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.courses.map(course => {
              const stats = data.courseStats[course.Id];
              if (!stats) return null;
              
              return (
                <div key={course.Id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.code}</h4>
                      <p className="text-sm text-gray-600 truncate">{course.name}</p>
                    </div>
                    <Badge variant={getGradeColor(stats.percentage)}>
                      {stats.letterGrade}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score</span>
                      <span className="font-semibold">{stats.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          stats.percentage >= 85 ? "from-success to-emerald-600" :
                          stats.percentage >= 75 ? "from-primary to-secondary" :
                          stats.percentage >= 65 ? "from-warning to-orange-600" :
                          stats.percentage >= 50 ? "from-info to-blue-600" :
                          "from-error to-red-600"
                        }`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {stats.gradeCount} graded items
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            >
              <option value="all">All Courses</option>
              {data.courses.map(course => (
                <option key={course.Id} value={course.Id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            >
              <option value="all">All Types</option>
              <option value="assignment">Assignments</option>
              <option value="exam">Exams</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      {filteredGrades.length === 0 ? (
        <Empty
          title="No grades found"
          message="No grades match your current filters."
          icon="BarChart3"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="List" className="w-5 h-5 text-primary" />
              <span>Detailed Grades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Course</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Assessment</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Score</th>
                    <th className="text-center py-4 px-2 font-semibold text-gray-900">Grade</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade) => {
                    const course = getCourseInfo(grade.courseId);
                    const percentage = Math.round((grade.marks / (grade.totalMarks || 100)) * 100);
                    const letterGrade = getLetterGrade(percentage);
                    
                    return (
                      <tr key={grade.Id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2">
                          <div>
                            <div className="font-semibold text-gray-900">{course?.code}</div>
                            <div className="text-sm text-gray-600">{course?.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {grade.assignmentId ? getAssignmentTitle(grade.assignmentId) : grade.examType}
                            </div>
                            <div className="text-sm text-gray-600">
                              {grade.assignmentId ? "Assignment" : "Exam"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <div className="font-semibold text-gray-900">
                            {grade.marks}/{grade.totalMarks || 100}
                          </div>
                          <div className="text-sm text-gray-600">{percentage}%</div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <Badge variant={getGradeColor(percentage)}>
                            {letterGrade}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-sm text-gray-600">
                            {format(new Date(grade.gradedDate), "MMM dd, yyyy")}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-sm text-gray-600 truncate max-w-48 block">
                            {grade.feedback || "No feedback"}
                          </span>
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
};

export default Grades;