import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import CourseCard from "@/components/molecules/CourseCard";
import AnnouncementCard from "@/components/molecules/AnnouncementCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";
import { announcementService } from "@/services/api/announcementService";
import { calendarService } from "@/services/api/calendarService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    courses: [],
    announcements: [],
    upcomingEvents: [],
    pendingAssignments: [],
    stats: {
      totalCourses: 0,
      averageAttendance: 0,
      pendingAssignments: 0,
      upcomingExams: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courses, announcements, upcomingEvents, pendingAssignments] = await Promise.all([
        courseService.getEnrolledCourses(1),
        announcementService.getRecent(5),
        calendarService.getUpcoming(7),
        assignmentService.getPendingAssignments()
      ]);

      // Calculate average attendance
      const attendancePromises = courses.map(course => 
        attendanceService.calculateAttendancePercentage(1, course.Id)
      );
      const attendancePercentages = await Promise.all(attendancePromises);
      const averageAttendance = Math.round(
        attendancePercentages.reduce((sum, pct) => sum + pct, 0) / attendancePercentages.length
      ) || 0;

      const upcomingExams = upcomingEvents.filter(event => event.type === "exam").length;

      setData({
        courses: courses.slice(0, 6),
        announcements,
        upcomingEvents,
        pendingAssignments,
        stats: {
          totalCourses: courses.length,
          averageAttendance,
          pendingAssignments: pendingAssignments.length,
          upcomingExams
        }
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const handleViewCourse = (course) => {
    navigate(`/courses/${course.Id}`);
  };

  const handleViewAssignments = (course) => {
    navigate(`/assignments?course=${course.Id}`);
  };

  const handleViewGrades = (course) => {
    navigate(`/grades?course=${course.Id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Academic Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your academic progress and upcoming activities
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(new Date(), "EEEE, MMMM dd, yyyy")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Courses"
          value={data.stats.totalCourses}
          icon="BookOpen"
          gradient="from-primary to-secondary"
          subtitle="Active this semester"
        />
        <StatCard
          title="Average Attendance"
          value={`${data.stats.averageAttendance}%`}
          icon="UserCheck"
          gradient="from-success to-emerald-600"
          subtitle="Across all courses"
          trend={{ value: 2.5 }}
        />
        <StatCard
          title="Pending Assignments"
          value={data.stats.pendingAssignments}
          icon="FileText"
          gradient="from-warning to-orange-600"
          subtitle="Due this week"
        />
        <StatCard
          title="Upcoming Exams"
          value={data.stats.upcomingExams}
          icon="ClipboardCheck"
          gradient="from-info to-blue-600"
          subtitle="Next 7 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
                <span>My Courses</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/courses")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.courses.map((course) => (
                  <CourseCard
                    key={course.Id}
                    course={course}
                    onViewDetails={handleViewCourse}
                    onViewAssignments={handleViewAssignments}
                    onViewGrades={handleViewGrades}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calendar" className="w-5 h-5 text-accent" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.upcomingEvents.slice(0, 4).map((event) => (
                  <div key={event.Id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      event.type === "exam" ? "bg-error/10 text-error" :
                      event.type === "assignment" ? "bg-warning/10 text-warning" :
                      event.type === "holiday" ? "bg-success/10 text-success" :
                      "bg-info/10 text-info"
                    }`}>
                      <ApperIcon 
                        name={
                          event.type === "exam" ? "ClipboardCheck" :
                          event.type === "assignment" ? "FileText" :
                          event.type === "holiday" ? "Calendar" :
                          "Star"
                        } 
                        className="w-4 h-4" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.date), "MMM dd")} • {event.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate("/calendar")}
                >
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Bell" className="w-5 h-5 text-secondary" />
                <span>Recent Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.announcements.slice(0, 3).map((announcement) => (
                  <AnnouncementCard 
                    key={announcement.Id} 
                    announcement={announcement}
                  />
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate("/announcements")}
                >
                  View All Announcements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;