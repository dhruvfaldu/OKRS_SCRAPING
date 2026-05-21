import React from "react";
import Loader from "./Loader";

/**
 * ButtonLoader - Micro inline loader for buttons to show active status
 */
export default function ButtonLoader({ text = "Please wait", className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center gap-2 font-medium ${className}`}>
      <Loader size="sm" className="text-current" />
      <span>{text}...</span>
    </span>
  );
}
