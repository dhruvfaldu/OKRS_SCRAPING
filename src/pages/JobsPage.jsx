import JobCardSkeleton from "../components/loaders/JobCardSkeleton";
import Pagination from "../components/common/Pagination";
import { Plus, BriefcaseBusiness, Activity, Clock3, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import JobCard from "../components/common/JobCard";
import { Link, useSearchParams } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

function JobsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page"), 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const setPage = (newPage) => {
        setSearchParams({ page: newPage });
    };

    const dispatch = useDispatch();
    const { items: jobs = [], isLoading, isFetching } = useSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    // Stats
    const count = jobs.length;

    // TODO: When backend is available, remove useLocalStorage and uncomment the below code
    const completed = jobs.filter((j) => j?.status === "completed").length;

    const pending = count - completed;

    // Pagination
    const perPage = 9;
    const startIndex = (page - 1) * perPage;
    const paginatedJobs = jobs.slice(startIndex, startIndex + perPage);
    const maxPages = Math.ceil(count / perPage);
    const hasNextPage = page < maxPages;

    return (
        <div className="p-5 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <BriefcaseBusiness className="w-7 h-7 text-primary" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold leading-tight">Jobs</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage and monitor your scraping jobs
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => dispatch(fetchJobs())}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        <RotateCw
                            size={16}
                            className={isFetching ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90"
                    >
                        <Plus size={16} />
                        New Job
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Total Jobs</p>
                    <div className="flex gap-2">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex justify-center items-center">
                            <BriefcaseBusiness size={18} className="text-primary" />
                        </div>
                        <span className="mt-1 text-xl font-semibold">{count}</span>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Completed Jobs</p>
                    <div className="flex gap-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-500 flex justify-center items-center">
                            <Activity size={18} className="text-emerald-500" />
                        </div>
                        <span className="mt-1 text-xl font-semibold">{completed}</span>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Total Jobs</p>
                    <div className="flex gap-2">
                        <div className="w-9 h-9 rounded-full bg-amber-500/10 flex justify-center items-center">
                            <BriefcaseBusiness size={18} className="text-amber-500" />
                        </div>
                        <span className="mt-1 text-xl font-semibold">{pending}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <JobCardSkeleton key={i} />
                    ))}
                </div>
            ) : count === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <h2 className="text-lg font-semibold mb-2">No jobs created yet</h2>
                    <p className="text-sm text-muted-foreground mb-5">
                        Start by creating your first scraping workflow.
                    </p>
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                        <Plus size={16} />
                        Create First Job
                    </Link>
                </div>
            ) : (
                <>
                    {/* Job Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {paginatedJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {maxPages > 1 && (
                        <Pagination
                            page={page}
                            setPage={setPage}
                            hasNextPage={hasNextPage}
                            maxpages={maxPages}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default JobsPage;