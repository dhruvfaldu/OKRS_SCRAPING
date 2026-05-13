import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import { Plus, BriefcaseBusiness, Activity, Clock3, Play, BarChart, ArrowRight, Zap, History } from "lucide-react";
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: jobs = [], isLoading } = useSelector((state) => state.jobs);
    const { user } = useSelector((state) => state.auth);

    // const [jobStatusMap, setJobStatusMap] = useLocalStorage("jobStatus", {});
    // const [lastRunJobId, setLastRunJobId] = useLocalStorage("lastRunJobId", null);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const count = jobs.length;
    // TODO: When backend is available, remove useLocalStorage and uncomment the below code
    const completedCount = jobs.filter((job) => job?.status === "completed").length;
    // const completedCount = jobs.filter((job) => (jobStatusMap[job.id] || job?.status || "pending").toLowerCase() === "completed").length;

    const pendingCount = count - completedCount;

    const recentJobs = jobs.slice(0, 3);
    const lastJob = jobs[0];

    const [runningLast, setRunningLast] = useState(false);

    const handleRunLast = () => {
        if (lastJob) {
            // TODO: When backend is available, remove useLocalStorage and uncomment the old code

            setRunningLast(true);
            setTimeout(() => setRunningLast(false), 600);


            // setRunningLast(true);
            // setJobStatusMap({ ...jobStatusMap, [lastJob.id]: "running" });
            // setLastRunJobId(lastJob.id);

            // const delay = Math.random() * 2000 + 1000; // 1–3 sec realistic delay

            // setTimeout(() => {
            //     setJobStatusMap((prev) => ({
            //         ...prev,
            //         [lastJob.id]: "completed",
            //     }));
            //     setRunningLast(false);
            // }, delay);
        }
    };

    return (
        <div className="bg-background text-foreground min-h-screen p-5 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* 1. Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 border border-border rounded-2xl p-6 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            👋 Welcome back, <span className="text-primary">{user?.name || "Dhruv"}</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Here's what's happening with your scraping jobs today.
                        </p>
                    </div>
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md shrink-0"
                    >
                        <Plus size={18} />
                        Create Job
                    </Link>
                </div>

                {/* 2. Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/30 transition-all flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BriefcaseBusiness size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                            <h3 className="text-2xl font-bold">{count}</h3>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-emerald-500/30 transition-all flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed Runs</p>
                            <h3 className="text-2xl font-bold">{completedCount}</h3>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-amber-500/30 transition-all flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                            <Clock3 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">In Queue</p>
                            <h3 className="text-2xl font-bold">{pendingCount}</h3>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Actions */}
                <div>
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
                </div>

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
                                        <li key={idx} className="p-4 hover:bg-accent/30 transition-colors flex items-start gap-4 rounded-xl">
                                            <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-primary shrink-0"></div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {/* TODO: When backend is available, uncomment below and remove the jobStatusMap logic */}
                                                    Job <span className="font-bold text-primary">{job.name}</span> was {job.status === 'completed' ? 'completed successfully' : 'created'}
                                                    {/* Job <span className="font-bold text-primary">{job.name}</span> was {(jobStatusMap[job.id] || job.status || "pending").toLowerCase() === 'completed' ? 'completed successfully' : 'created'} */}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">Recently</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No recent activity found.
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
                                <div className="p-8 text-center text-muted-foreground text-sm">Loading jobs...</div>
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
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${(job.status || "pending").toLowerCase() === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                                                            (job.status || "pending").toLowerCase() === "running" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" :
                                                                "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                                            }`}>
                                                            {job.status || "pending"}
                                                        </span>
                                                        {/* <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${(jobStatusMap[job.id] || job.status || "pending").toLowerCase() === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
                                                            (jobStatusMap[job.id] || job.status || "pending").toLowerCase() === "running" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" :
                                                                "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                                            }`}>
                                                            {jobStatusMap[job.id] || job.status || "pending"}
                                                        </span> */}
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
                                <div className="p-8 text-center flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <p className="text-sm mb-4">No jobs created yet.</p>
                                    <Link to="/create" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
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