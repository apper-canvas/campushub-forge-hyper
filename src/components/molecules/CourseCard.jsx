import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = forwardRef(({ 
  className,
  course,
  onViewDetails,
  onViewAssignments,
  onViewGrades,
  ...props 
}, ref) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-error";
  };

  return (
    <Card 
      ref={ref}
      className={cn("hover:scale-105 transition-all duration-200 group", className)}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {course.name}
            </CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="primary" size="sm">{course.code}</Badge>
              <Badge variant="secondary" size="sm">{course.credits} Credits</Badge>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
            <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-2">
            <ApperIcon name="User" className="w-4 h-4" />
            <span>{course.facultyName}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className={cn("font-semibold", getProgressColor(course.progress))}>
              {course.progress}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{course.attendance}%</div>
              <div className="text-gray-500">Attendance</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{course.assignments}</div>
              <div className="text-gray-500">Assignments</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{course.grade || "N/A"}</div>
              <div className="text-gray-500">Grade</div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails?.(course)}
            >
              <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
              Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewAssignments?.(course)}
            >
              <ApperIcon name="FileText" className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewGrades?.(course)}
            >
              <ApperIcon name="BarChart3" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CourseCard.displayName = "CourseCard";

export default CourseCard;