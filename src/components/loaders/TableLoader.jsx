import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TableLoader - Shimmer skeleton representing modern data tables loading
 */
export default function TableLoader({ rows = 5, columns = 4 }) {
    return (
        <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in-50 duration-300">
            {/* Search and control bar skeleton */}
            <div className="flex items-center justify-between border-b border-border p-4 gap-4 bg-muted/20">
                <Skeleton className="h-9 w-64 rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-xl" />
                    <Skeleton className="h-9 w-32 rounded-xl" />
                </div>
            </div>

            {/* Table grid shimmer */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-accent/10 transition-colors">
                                {Array.from({ length: columns }).map((_, colIndex) => {
                                    // Vary lengths of skeleton blocks slightly for realistic appearance
                                    const widthClass = colIndex === 0
                                        ? "w-28"
                                        : colIndex === columns - 1
                                            ? "w-16"
                                            : "w-36";
                                    return (
                                        <td key={colIndex} className="px-6 py-4">
                                            <Skeleton className={`h-4 ${widthClass} rounded-md`} />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer skeleton */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
                <Skeleton className="h-4 w-32 rounded-md" />
                <div className="flex gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
