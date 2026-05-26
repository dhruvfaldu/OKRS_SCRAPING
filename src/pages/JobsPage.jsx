import React, { useEffect } from "react";
import { Plus, BriefcaseBusiness, Activity, Clock3, RotateCw, Sparkles } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import JobCard from "../components/common/JobCard";
import JobCardSkeleton from "../components/loaders/JobCardSkeleton";
import NoDataFound from "../components/error/NoDataFound";
import TableError from "../components/error/TableError";
import Pagination from "../components/common/Pagination";
import { Link, useSearchParams } from "react-router-dom";

/**
 * JobsPage - Upgraded high-fidelity Jobs dashboard list
 */
export default function JobsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page"), 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const setPage = (newPage) => {
        setSearchParams({ page: newPage });
    };

    const dispatch = useDispatch();
    const { items: jobs = [], isLoading, isFetching, error } = useSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    // Stats
    const count = jobs.length;
    const completed = jobs.filter((j) => j?.status === "completed").length;
    const pending = count - completed;

    // Pagination configuration
    const perPage = 9;
    const startIndex = (page - 1) * perPage;
    const paginatedJobs = jobs.slice(startIndex, startIndex + perPage);
    const maxPages = Math.ceil(count / perPage);
    const hasNextPage = page < maxPages;

    return (
        <div className="bg-background text-foreground min-h-screen p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 1. Header Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Glow background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/15 text-primary shrink-0">
                            <BriefcaseBusiness className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Scraper Jobs</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Monitor progress, schedule scraping runs, and view selector tables.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 shrink-0">
                        <button
                            onClick={() => dispatch(fetchJobs())}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                            <RotateCw
                                size={14}
                                className={`transition-transform duration-300 hover:rotate-180 ${isFetching ? "animate-spin" : ""}`}
                            />
                            Refresh Workspaces
                        </button>

                        <Link
                            to="/create"
                            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 hover:scale-102 transition"
                        >
                            <Plus size={14} />
                            Create Scraper
                        </Link>
                    </div>
                </div>

                {/* 2. Stats Dashboard Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Metric Card 1 */}
                    <div className="rounded-2xl border border-border/85 bg-card p-5 shadow-2xs hover:border-primary/30 transition-all flex items-center gap-4 relative group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <BriefcaseBusiness size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Scrapers</p>
                            <p className="text-xl font-bold text-foreground leading-none">{isLoading ? "..." : count}</p>
                        </div>
                    </div>

                    {/* Metric Card 2 */}
                    <div className="rounded-2xl border border-border/85 bg-card p-5 shadow-2xs hover:border-emerald-500/30 transition-all flex items-center gap-4 relative group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Activity size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Completed</p>
                            <p className="text-xl font-bold text-foreground leading-none">{isLoading ? "..." : completed}</p>
                        </div>
                    </div>

                    {/* Metric Card 3 */}
                    <div className="rounded-2xl border border-border/85 bg-card p-5 shadow-2xs hover:border-amber-500/30 transition-all flex items-center gap-4 relative group">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Clock3 size={18} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Deployments Queue</p>
                            <p className="text-xl font-bold text-foreground leading-none">{isLoading ? "..." : pending}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Main Data Content Grid */}
                {error ? (
                    <div className="max-w-xl mx-auto pt-6 animate-in zoom-in-95 duration-300">
                        <TableError
                            message={error}
                            onRetry={() => dispatch(fetchJobs())}
                        />
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))}
                    </div>
                ) : count === 0 ? (
                    <div className="max-w-full mx-auto pt-6 animate-in zoom-in-95 duration-300">
                        <NoDataFound
                            title="No Scraper Jobs Located"
                            description="It looks like you haven't defined any target websites or configuration selector codes yet."
                            actionText="Setup First Scraper Job Now 🚀"
                            actionUrl="/create"
                        />
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-300">

                        {/* The Job Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>

                        {/* Interactive Pagination controls */}
                        {maxPages > 1 && (
                            <div className="flex justify-center pt-2">
                                <Pagination
                                    page={page}
                                    setPage={setPage}
                                    hasNextPage={hasNextPage}
                                    maxpages={maxPages}
                                />
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}