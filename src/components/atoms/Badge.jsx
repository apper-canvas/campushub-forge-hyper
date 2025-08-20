import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  size = "md",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-indigo-600/10 text-secondary border border-secondary/20",
    accent: "bg-gradient-to-r from-accent/10 to-orange-500/10 text-accent border border-accent/20",
    success: "bg-gradient-to-r from-success/10 to-emerald-600/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-orange-600/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-600/10 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-blue-600/10 text-info border border-info/20"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;