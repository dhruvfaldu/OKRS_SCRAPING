// components/loaders/ResultsPageLoader.jsx

import { Skeleton } from "@/components/ui/skeleton";

const ResultsPageLoader = () => {
    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    {/* Left Section */}
                    <div className="space-y-3">
                        {/* Back Button */}
                        <Skeleton className="h-4 w-28 rounded-md" />

                        {/* Title */}
                        <Skeleton className="h-9 w-40 rounded-lg" />

                        {/* Job Name + ID */}
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-44 rounded-md" />
                            <Skeleton className="h-4 w-36 rounded-md" />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex gap-3 flex-wrap">
                        {/* Toggle Buttons */}
                        <div className="flex bg-muted border border-border rounded-xl p-1 gap-1">
                            <Skeleton className="h-10 w-28 rounded-lg" />
                            <Skeleton className="h-10 w-28 rounded-lg" />
                        </div>

                        {/* Download Button */}
                        <Skeleton className="h-10 w-36 rounded-xl" />
                    </div>
                </div>

                {/* Results Card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="border-b border-border p-4">
                        <div className="grid grid-cols-4 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 gap-4 items-center"
                            >
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPageLoader;