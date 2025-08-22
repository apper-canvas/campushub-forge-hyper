import { useState, useContext } from "react";
import { useSelector } from 'react-redux';
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick, className }) => {
const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const notifications = [
    {
      Id: 1,
      title: "Assignment Due Tomorrow",
      message: "Data Structures assignment due at 11:59 PM",
      time: "2 hours ago",
      type: "assignment"
    },
    {
      Id: 2,
      title: "Exam Schedule Updated",
      message: "Mid-term exam moved to next Friday",
      time: "5 hours ago",
      type: "exam"
    },
    {
      Id: 3,
      title: "New Announcement",
      message: "Holiday on Monday - Classes canceled",
      time: "1 day ago",
      type: "announcement"
    }
  ];

  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900 font-display">
              Good Morning, John!
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back to your academic dashboard
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Bell" className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-error to-red-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.Id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <ApperIcon 
                            name={notification.type === "assignment" ? "FileText" : notification.type === "exam" ? "ClipboardCheck" : "Bell"} 
                            className="w-4 h-4 text-primary" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <button className="w-full text-sm text-primary hover:text-secondary font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
<div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span>Logout</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {isAuthenticated && user ? `${user.firstName || 'User'} ${user.lastName || ''}`.trim() : 'John Smith'}
                </p>
                <p className="text-xs text-gray-500">
                  {isAuthenticated && user?.accounts?.[0]?.companyName || 'Computer Science'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;