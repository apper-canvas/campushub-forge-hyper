import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = forwardRef(({ 
  className,
  title,
  value,
  subtitle,
  icon,
  gradient = "from-primary to-secondary",
  trend,
  ...props 
}, ref) => {
  return (
    <Card 
      ref={ref}
      className={cn("hover:scale-105 transition-all duration-200", className)}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10`}>
            <ApperIcon name={icon} className={`w-6 h-6 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center space-x-1 text-sm font-medium",
              trend.value > 0 ? "text-success" : "text-error"
            )}>
              <ApperIcon 
                name={trend.value > 0 ? "TrendingUp" : "TrendingDown"} 
                className="w-4 h-4" 
              />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-display`}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-700">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500">
              {subtitle}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = "StatCard";

export default StatCard;