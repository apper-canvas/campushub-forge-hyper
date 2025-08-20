import { forwardRef } from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AnnouncementCard = forwardRef(({ 
  className,
  announcement,
  ...props 
}, ref) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "info";
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "exam":
        return "ClipboardCheck";
      case "holiday":
        return "Calendar";
      case "event":
        return "Star";
      case "deadline":
        return "Clock";
      default:
        return "Bell";
    }
  };

  return (
    <Card 
      ref={ref}
      className={cn("hover:shadow-md transition-all duration-200", className)}
      {...props}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0">
            <ApperIcon 
              name={getTypeIcon(announcement.type)} 
              className="w-5 h-5 text-primary" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                {announcement.title}
              </h4>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <Badge variant={getPriorityColor(announcement.priority)} size="sm">
                  {announcement.priority}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {announcement.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <ApperIcon name="User" className="w-3 h-3" />
                <span>{announcement.sender}</span>
                {announcement.course && (
                  <>
                    <span>•</span>
                    <span>{announcement.course}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-3 h-3" />
                <span>{format(new Date(announcement.createdAt), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;