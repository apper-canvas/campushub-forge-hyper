import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = forwardRef(({ 
  className, 
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}
      {...props}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
});

Error.displayName = "Error";

export default Error;