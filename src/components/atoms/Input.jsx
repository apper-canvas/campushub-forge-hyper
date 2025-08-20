import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm",
          "placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-error focus:border-error focus:ring-error/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;