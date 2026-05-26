import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Modernized ErrorMessage component that acts as a sleek card error message or redirects cleanly
 */
export default function ErrorMessage({
  message = "An unexpected error occurred. Please refresh or try again.",
  onRetry,
}) {
  return (
    <div className="bg-destructive/5 border border-destructive/15 text-destructive rounded-2xl px-5 py-4 text-sm flex items-start gap-3 shadow-2xs animate-in fade-in-50 duration-300" role="alert">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <p className="font-semibold text-foreground text-sm">Operation Failed</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Retry Action
          </button>
        )}
      </div>
    </div>
  );
}