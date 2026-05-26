import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import { Plus, BriefcaseBusiness, Activity, Clock3, Play, BarChart, ArrowRight, Zap, History, Sparkles } from "lucide-react";
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { toast } from "sonner";
import Loader from "../components/loaders/Loader.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: jobs = [], isLoading } = useSelector((state) => state.jobs);
    const { user } = useSelector((state) => state.auth);

    const [jobStatusMap, setJobStatusMap] = useLocalStorage("jobStatus", {});
    const [lastRunJobId, setLastRunJobId] = useLocalStorage("lastRunJobId", null);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const count = jobs.length;
    // TODO: When backend is available, remove useLocalStorage and uncomment the below code
    // const completedCount = jobs.filter((job) => job?.status === "completed").length;
    const completedCount = jobs.filter((job) => (jobStatusMap[job.id] || job?.status || "pending").toLowerCase() === "completed").length;

    const pendingCount = count - completedCount;

    const recentJobs = jobs.slice(0, 3);
    const lastJob = jobs[0];

    const [runningLast, setRunningLast] = useState(false);

    const handleRunLast = () => {
        if (lastJob) {
            // TODO: When backend is available, remove useLocalStorage and uncomment the old code

            // setRunningLast(true);
            // setTimeout(() => setRunningLast(false), 600);


            setRunningLast(true);
            setJobStatusMap({ ...jobStatusMap, [lastJob.id]: "running" });
            setLastRunJobId(lastJob.id);

            const delay = Math.random() * 2000 + 1000; // 1–3 sec realistic delay

            setTimeout(() => {
                setJobStatusMap((prev) => ({
                    ...prev,
                    [lastJob.id]: "completed",
                }));
                setRunningLast(false);
            }, delay);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good evening";
    };

    return (
        <div className="bg-background text-foreground min-h-screen p-5 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* 1. Header Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    {/* Decorative blurred backgrounds */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold select-none">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>Professional Workspace Enabled</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                            {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">{user?.name || "Dhruv"}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                            Monitor scraper metrics, schedule crawling configurations, and export real-time selector tables from one central dashboard.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0 flex items-center gap-3">
                        <Link
                            to="/create"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 px-5 py-3 rounded-2xl text-sm font-semibold shadow-md shadow-primary/15 hover:scale-102 hover:shadow-lg transition-all duration-200"
                        >
                            <Plus size={16} />
                            Create Scraper Job
                        </Link>
                    </div>
                </div>

                {/* 2. Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Stat Card 1 */}
                    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex items-center justify-between relative overflow-hidden group">
                        <div className="space-y-2 relative z-10">
                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Total Workspaces</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-foreground">{isLoading ? <Loader size="sm" /> : count}</h3>
                                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">+10%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300">
                            <BriefcaseBusiness size={20} />
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 flex items-center justify-between relative overflow-hidden group">
                        <div className="space-y-2 relative z-10">
                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Successful Runs</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-foreground">{isLoading ? <Loader size="sm" /> : completedCount}</h3>
                                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">98.2% Success</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300">
                            <Activity size={20} />
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300 flex items-center justify-between relative overflow-hidden group sm:col-span-2 lg:col-span-1">
                        <div className="space-y-2 relative z-10">
                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Pending In Queue</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-foreground">{isLoading ? <Loader size="sm" /> : pendingCount}</h3>
                                <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">Next run in 2m</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300">
                            <Clock3 size={20} />
                        </div>
                    </div>
                </div>

                {/* 3. Quick Actions */}
                {/* <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <Zap size={20} className="text-primary" /> Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Link to="/create" className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary/50 hover:bg-accent py-4 rounded-xl text-sm font-medium transition-all group shadow-sm hover:shadow-md">
                            <Plus size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            Create New Job
                        </Link>
                        <button onClick={handleRunLast} disabled={runningLast} className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary/50 hover:bg-accent py-4 rounded-xl text-sm font-medium transition-all group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                            <Play size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            {runningLast ? "Running..." : "Run Last Job"}
                        </button>
                        <Link to={lastJob ? `/results/${lastJob.id}` : "/jobs"} className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary/50 hover:bg-accent py-4 rounded-xl text-sm font-medium transition-all group shadow-sm hover:shadow-md">
                            <BarChart size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            View Latest Results
                        </Link>
                    </div>
                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 4. Recent Activity */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <History size={20} className="text-primary" /> Recent Activity
                        </h2>
                        <div className="bg-card border border-border rounded-2xl flex-1 p-2 shadow-sm">
                            {recentJobs.length > 0 ? (
                                <ul className="divide-y divide-border">
                                    {recentJobs.map((job, idx) => (
                                        <li
                                            key={idx}
                                            className="group relative overflow-hidden rounded-2xl border border-transparent bg-background/40 mb-2 p-4 transition-all duration-300 hover:border-border hover:bg-accent/20 hover:shadow-sm"
                                        >
                                            <div className="flex items-start gap-4">

                                                {/* Status Indicator */}
                                                <div className="relative mt-1 flex shrink-0">
                                                    <span className="absolute inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-primary/40" />

                                                    <span
                                                        className={`relative h-2.5 w-2.5 rounded-full ${(jobStatusMap[job.id] || job.status || "pending").toLowerCase() ===
                                                            "completed"
                                                            ? "bg-emerald-500"
                                                            : "bg-primary"
                                                            }`}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 space-y-2">
                                                    <p className="text-sm leading-6 text-foreground">
                                                        Job{" "}
                                                        <span className="font-semibold text-primary">
                                                            {job.name}
                                                        </span>{" "}
                                                        was{" "}
                                                        <span
                                                            className={`font-medium ${(jobStatusMap[job.id] || job.status || "pending").toLowerCase() ===
                                                                "completed"
                                                                ? "text-emerald-500"
                                                                : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {(jobStatusMap[job.id] || job.status || "pending").toLowerCase() ===
                                                                "completed"
                                                                ? "completed successfully"
                                                                : "created"}
                                                        </span>
                                                    </p>

                                                    {/* Footer */}
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />

                                                        <span>
                                                            {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                                                        </span>

                                                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />

                                                        <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide">
                                                            Activity Log
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-14 text-center">
                                    <div className="mb-4 rounded-full bg-muted p-4">
                                        <Clock3 className="h-6 w-6 text-muted-foreground" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-foreground">
                                        No Recent Activity
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                        Your recent scraper activity will appear here once you start using the platform.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 5. Recent Jobs Table/List */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <BriefcaseBusiness size={20} className="text-primary" /> Recent Jobs
                            </h2>
                            <Link to="/jobs" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="bg-card border border-border rounded-2xl flex-1 overflow-hidden shadow-sm">
                            {isLoading ? (
                                <div className="flex h-[320px] flex-col items-center justify-center gap-4">
                                    <Loader size="lg" />

                                    <div className="space-y-1 text-center">
                                        <h3 className="text-sm font-medium text-foreground">
                                            Loading Jobs
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Fetching your latest scraping jobs...
                                        </p>
                                    </div>
                                </div>
                            ) : recentJobs.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/30 text-muted-foreground border-b border-border">
                                            <tr>
                                                <th className="px-5 py-4 font-medium">Job Name</th>
                                                <th className="px-5 py-4 font-medium">Status</th>
                                                <th className="px-5 py-4 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {recentJobs.map((job) => (
                                                <tr key={job.id} className="hover:bg-accent/30 transition-colors">
                                                    <td className="px-5 py-4 font-medium text-foreground truncate max-w-[150px]">{job.name}</td>
                                                    <td className="px-5 py-4">
                                                        {/* TODO: When backend is available, uncomment below and remove the jobStatusMap logic */}
                                                        {/* <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${(job.status || "pending").toLowerCase() === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                                                            (job.status || "pending").toLowerCase() === "running" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" :
                                                                (job.status || "pending").toLowerCase() === "failed" ? "bg-red-500/10 text-red-600 border-red-500/30" :
                                                                    "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                                            }`}>
                                                            {job.status || "pending"}
                                                        </span> */}
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${(jobStatusMap[job.id] || job.status || "pending").toLowerCase() === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                                                            (jobStatusMap[job.id] || job.status || "pending").toLowerCase() === "running" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" : (
                                                                (jobStatusMap[job.id] || job.status || "pending").toLowerCase() === "failed" ? "bg-red-500/10 text-red-700 border-red-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30")

                                                            }`}>
                                                            {jobStatusMap[job.id] || job.status || "pending"}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <button
                                                            onClick={() => navigate(`/results/${job.id}`)}
                                                            className="text-primary hover:text-primary/80 font-medium text-xs transition-colors"
                                                        >
                                                            Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center px-6 py-14 text-center">
                                    <div className="mb-4 rounded-2xl bg-muted p-4">
                                        <BriefcaseBusiness className="h-7 w-7 text-muted-foreground" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-foreground">
                                        No Jobs Created
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                        Start by creating your first scraping job to track, manage, and monitor scraper activity from one place.
                                    </p>

                                    <Link
                                        to="/create"
                                        className="mt-6 inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                    >
                                        Create First Job
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;