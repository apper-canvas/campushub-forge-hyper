import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AnnouncementCard from "@/components/molecules/AnnouncementCard";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { announcementService } from "@/services/api/announcementService";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error loading announcements:", err);
      setError("Failed to load announcements. Please try again.");
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await announcementService.markAsRead(id);
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.Id === id 
            ? { ...announcement, isRead: true }
            : announcement
        )
      );
      toast.success("Announcement marked as read");
    } catch (err) {
      console.error("Error marking announcement as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || announcement.type === selectedType;
    const matchesPriority = selectedPriority === "all" || announcement.priority === selectedPriority;
    const matchesReadStatus = !showUnreadOnly || !announcement.isRead;
    
    return matchesSearch && matchesType && matchesPriority && matchesReadStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadAnnouncements} />;

  const unreadCount = announcements.filter(a => !a.isRead).length;
  const priorityStats = {
    high: announcements.filter(a => a.priority === "high").length,
    medium: announcements.filter(a => a.priority === "medium").length,
    low: announcements.filter(a => a.priority === "low").length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Announcements</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with important college and course announcements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="error" size="lg">
            {unreadCount} Unread
          </Badge>
          <Badge variant="primary" size="lg">
            {announcements.length} Total
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-error font-display">{priorityStats.high}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-error/10 to-red-600/10 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-warning font-display">{priorityStats.medium}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-warning/10 to-orange-500/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Bell" className="w-5 h-5 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Priority</p>
              <p className="text-2xl font-bold text-info font-display">{priorityStats.low}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-info/10 to-blue-600/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Info" className="w-5 h-5 text-info" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-error font-display">{unreadCount}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-error/10 to-red-600/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Mail" className="w-5 h-5 text-error" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            >
              <option value="all">All Types</option>
              <option value="exam">Exam</option>
              <option value="holiday">Holiday</option>
              <option value="event">Event</option>
              <option value="deadline">Deadline</option>
              <option value="announcement">General</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  announcements.forEach(announcement => {
                    if (!announcement.isRead) {
                      handleMarkAsRead(announcement.Id);
                    }
                  });
                }}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Empty
          title={showUnreadOnly ? "No unread announcements" : "No announcements found"}
          message={showUnreadOnly 
            ? "You're all caught up! No unread announcements." 
            : "Try adjusting your search criteria or filters."
          }
          icon="Bell"
        />
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map(announcement => (
            <div 
              key={announcement.Id} 
              className={`relative ${!announcement.isRead ? "ring-2 ring-primary/20" : ""}`}
              onClick={() => !announcement.isRead && handleMarkAsRead(announcement.Id)}
            >
              <AnnouncementCard announcement={announcement} />
              {!announcement.isRead && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-error to-red-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnreadOnly(true)}
            >
              <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
              Show Unread ({unreadCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPriority("high")}
            >
              <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
              High Priority ({priorityStats.high})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedType("exam")}
            >
              <ApperIcon name="ClipboardCheck" className="w-4 h-4 mr-2" />
              Exam Notifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedPriority("all");
                setShowUnreadOnly(false);
              }}
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;