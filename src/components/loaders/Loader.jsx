import React from "react";

/**
 * Reusable Loader - Premium SaaS micro circular spinner
 */
export default function Loader({ size = "md", className = "" }) {
  const sizeClasses = {
    xs: "h-3 w-3 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-primary/20 border-r-primary border-b-primary border-l-primary ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
