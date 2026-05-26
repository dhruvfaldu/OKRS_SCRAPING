import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * TableError - Sleek banner alert to show inside data tables when rendering fails
 */
export default function TableError({
    message = "Failed to load table records.",
    onRetry,
}) {
    return (
        <div className="w-full border border-destructive/20 bg-destructive/5 rounded-2xl p-6 text-center animate-in fade-in-50 duration-300">
            <div className="flex flex-col items-center space-y-4">
                {/* Visual Badge */}
                <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
                    <AlertTriangle size={22} />
                </div>

                {/* Info */}
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Data request failure</p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        {message} Our remote API might be temporarily unavailable or requires a verified authentication check.
                    </p>
                </div>

                {/* Retry Trigger */}
                {onRetry && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/30 hover:bg-destructive/10 text-destructive rounded-xl cursor-pointer"
                        onClick={onRetry}
                    >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Reload Grid
                    </Button>
                )}
            </div>
        </div>
    );
}
