import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { courseService } from "@/services/api/courseService";

const Attendance = () => {
  const [data, setData] = useState({
    attendanceRecords: [],
    courses: [],
    monthlyStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState("all");

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceRecords, courses] = await Promise.all([
        attendanceService.getByStudent(1),
        courseService.getEnrolledCourses(1)
      ]);

      // Calculate monthly stats for each course
      const monthlyStats = {};
      for (const course of courses) {
        const courseAttendance = attendanceRecords.filter(record => 
          record.courseId === course.Id
        );
        const presentCount = courseAttendance.filter(record => 
          record.status === "present" || record.status === "late"
        ).length;
        const totalClasses = courseAttendance.length;
        const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
        
        monthlyStats[course.Id] = {
          present: presentCount,
          absent: totalClasses - presentCount,
          total: totalClasses,
          percentage
        };
      }

      setData({
        attendanceRecords,
        courses,
        monthlyStats
      });
    } catch (err) {
      console.error("Error loading attendance data:", err);
      setError("Failed to load attendance data. Please try again.");
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const getAttendanceForDate = (date, courseId = null) => {
    return data.attendanceRecords.find(record => {
      const recordDate = parseISO(record.date);
      const matchesDate = isSameDay(recordDate, date);
      const matchesCourse = !courseId || record.courseId === courseId;
      return matchesDate && matchesCourse;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "late":
        return "warning";
      case "absent":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return "CheckCircle";
      case "late":
        return "Clock";
      case "absent":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadAttendanceData} />;

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredCourses = selectedCourse === "all" 
    ? data.courses 
    : data.courses.filter(course => course.Id === parseInt(selectedCourse));

  const overallStats = data.courses.length > 0 ? {
    totalPresent: Object.values(data.monthlyStats).reduce((sum, stats) => sum + stats.present, 0),
    totalAbsent: Object.values(data.monthlyStats).reduce((sum, stats) => sum + stats.absent, 0),
    totalClasses: Object.values(data.monthlyStats).reduce((sum, stats) => sum + stats.total, 0),
    averagePercentage: Math.round(
      Object.values(data.monthlyStats).reduce((sum, stats) => sum + stats.percentage, 0) / data.courses.length
    )
  } : { totalPresent: 0, totalAbsent: 0, totalClasses: 0, averagePercentage: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Attendance Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor your class attendance and maintain academic requirements
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Overall Attendance</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            {overallStats.averagePercentage}%
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success mb-2 font-display">
              {overallStats.totalPresent}
            </div>
            <div className="text-sm text-gray-600">Classes Attended</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-error/10 to-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="XCircle" className="w-6 h-6 text-error" />
            </div>
            <div className="text-3xl font-bold text-error mb-2 font-display">
              {overallStats.totalAbsent}
            </div>
            <div className="text-sm text-gray-600">Classes Missed</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Calendar" className="w-6 h-6 text-info" />
            </div>
            <div className="text-3xl font-bold text-info mb-2 font-display">
              {overallStats.totalClasses}
            </div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-all duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 font-display">
              {overallStats.averagePercentage}%
            </div>
            <div className="text-sm text-gray-600">Average Attendance</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
            <input
              type="month"
              value={format(selectedMonth, "yyyy-MM")}
              onChange={(e) => setSelectedMonth(new Date(e.target.value))}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            />
          </div>
          
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
        </div>
      </div>

      {/* Course-wise Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="lg:col-span-2">
            <Empty
              title="No courses found"
              message="You don't have any enrolled courses to track attendance."
              icon="BookOpen"
            />
          </div>
        ) : (
          filteredCourses.map(course => (
            <Card key={course.Id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.code}</h3>
                      <p className="text-sm text-gray-500 font-normal">{course.name}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      data.monthlyStats[course.Id]?.percentage >= 80 ? "success" :
                      data.monthlyStats[course.Id]?.percentage >= 60 ? "warning" : "error"
                    }
                  >
                    {data.monthlyStats[course.Id]?.percentage || 0}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-success font-display">
                      {data.monthlyStats[course.Id]?.present || 0}
                    </div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-error font-display">
                      {data.monthlyStats[course.Id]?.absent || 0}
                    </div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-info font-display">
                      {data.monthlyStats[course.Id]?.total || 0}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>

                {/* Calendar View */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {daysInMonth.map(date => {
                    const attendance = getAttendanceForDate(date, course.Id);
                    return (
                      <div
                        key={date.toISOString()}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                          ${attendance 
                            ? attendance.status === "present" 
                              ? "bg-success text-white" 
                              : attendance.status === "late"
                              ? "bg-warning text-white"
                              : "bg-error text-white"
                            : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center">
                <ApperIcon name="XCircle" className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Circle" className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-gray-600">No Class</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;