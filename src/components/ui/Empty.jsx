import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = forwardRef(({ 
  className, 
  title = "No data available",
  message = "Get started by adding your first item.",
  icon = "Inbox",
  action,
  actionLabel = "Get Started",
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}
      {...props}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
});

Empty.displayName = "Empty";

export default Empty;