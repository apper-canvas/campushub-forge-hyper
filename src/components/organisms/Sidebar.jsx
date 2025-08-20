import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
  const location = useLocation();
  
const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Courses",
      href: "/courses",
      icon: "BookOpen"
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: "UserCheck"
    },
    {
      name: "Grades",
      href: "/grades",
      icon: "BarChart3"
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: "Calendar"
    },
    {
      name: "Announcements",
      href: "/announcements",
      icon: "Bell"
    },
    {
      name: "Library",
      href: "/library",
      icon: "Library"
    },
    {
      name: "Book Issues",
      href: "/book-issues",
      icon: "BookMarked"
    }
  ];

  return (
    <aside className={cn("w-64 bg-white border-r border-gray-200 flex flex-col", className)}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-display">CampusHub</h2>
            <p className="text-xs text-gray-500">College Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                )} 
              />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">John Smith</p>
            <p className="text-xs text-gray-500 truncate">Student ID: CS2021001</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;