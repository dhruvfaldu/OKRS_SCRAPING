import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { RiAlarmWarningLine, RiDeleteBin5Line, RiDeleteBin6Line } from "react-icons/ri";
import { BarChart, RotateCw, Globe, Play, ExternalLink, Calendar, Code } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { deleteJob, retryJob } from "../../store/slices/jobSlice";
import { toast } from "sonner";
import Loader from "../loaders/Loader";

export default function JobCard({ job }) {
  const [deleting, setDeleting] = useState(false);
  const [running, setRunning] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = (job?.status || "pending").toLowerCase();

  const statusColors = {
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
    running: "bg-blue-500/10 text-blue-600 border-blue-500/25",
    failed: "bg-red-500/10 text-red-600 border-red-500/25",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/25",
  };

  const statusClass =
    statusColors[status] || "bg-muted text-muted-foreground border-border";

  const firstLetter = (job?.name || "J").charAt(0).toUpperCase();

  const getCleanDomain = (urlStr) => {
    try {
      const parsed = new URL(urlStr);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "External Link";
    }
  };

  const handleRunOrRetry = () => {
    setRunning(true);

    dispatch(retryJob(job.id))
      .unwrap()
      .then(() => {
        toast.success(`Job "${job?.name}" is now executing!`);
      })
      .catch((err) => {
        toast.error(err?.message || `Failed to trigger "${job?.name}".`);
      })
      .finally(() => {
        setRunning(false);
      });

    toast.info(`Deploying workers for "${job?.name}"...`);
  };

  return (
    <Card className="bg-card border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group">

      {/* Header */}
      <CardHeader className="p-5 space-y-4">

        {/* Status */}
        <div className="flex flex-col sm:flex-row  items-start justify-between gap-2">
          <Badge className="bg-muted text-muted-foreground border border-border hover:bg-muted/80 text-[10px] font-bold uppercase tracking-wider rounded-lg select-none px-2 py-0.5">
            {job?.mode === "full_page" ? "HTML Page" : "Selectors Mode"}
          </Badge>

          <Badge
            className={`capitalize border font-semibold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${statusClass}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${status === "completed"
                  ? "bg-emerald-500"
                  : status === "running"
                    ? "bg-blue-500 animate-ping"
                    : status === "failed"
                      ? "bg-red-500"
                      : "bg-amber-500 animate-pulse"
                }`}
            />
            <span>{status}</span>
          </Badge>
        </div>

        {/* Title + URL */}
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 text-lg font-bold text-primary select-none group-hover:scale-105 transition-transform">
            {firstLetter}
          </span>

          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle
              className="truncate text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors"
              title={job?.name}
            >
              <div className="flex flex-col items-start sm:items-center sm:flex-row justify-between">
                {job?.name || "Target Web Scraper"}
                {job?.mode === "full_page" ? (
                  <span className="text-xs text-muted-foreground">(Full Page)</span>
                ) : (
                  <span className="text-xs text-muted-foreground">(Selectors)</span>
                )}
              </div>
            </CardTitle>

            <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />

              <a
                href={job?.url}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:underline hover:text-foreground inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{getCleanDomain(job?.url)}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* <hr className="border-border/60 mx-5" /> */}

      {/* Details */}
      <div className="px-5 py-4 space-y-2.5 text-xs text-muted-foreground flex-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span>Last trigger</span>
          </span>

          <span className="font-medium text-foreground">
            Just recently
          </span>
        </div>

        {job?.selectors && Array.isArray(job.selectors) && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span>Target fields</span>
            </span>

            <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md border border-border/40 select-none">
              {job.selectors.length} selectors
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 items-center p-3 bg-muted/10">

        {/* Run Button */}
        {running ? (
          <Button disabled className="flex-1 rounded-xl">
            <Loader size="xs" className="mr-2 text-current" />
            Deploying...
          </Button>
        ) : (
          (status === "completed" || status === "failed") && (
            <Button
              className={`flex-1 rounded-xl font-semibold shadow-2xs hover:shadow-md cursor-pointer ${status === "failed"
                ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/10"
                : "bg-primary text-primary-foreground hover:bg-primary/95"
                }`}
              onClick={handleRunOrRetry}
            >
              {status === "failed" ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                  Retry Job
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Run Job
                </>
              )}
            </Button>
          )
        )}

        {/* Results */}
        <Button
          variant="secondary"
          className="flex-1 rounded-xl font-semibold hover:bg-muted cursor-pointer border border-border/80"
          onClick={() => navigate(`/results/${job.id}`)}
        >
          <BarChart className="w-3.5 h-3.5 mr-1.5" />
          Results
        </Button>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={deleting}
              className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10 active:scale-95 disabled:pointer-events-none disabled:opacity-50 ">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <RiDeleteBin6Line
                size={16}
                className="relative z-10 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-red-500"
              />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            className="max-w-md overflow-hidden rounded-[28px] border border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl ">
            {/* Top Gradient */}
            <div className="h-1 w-full bg-gradient-to-r from-red-500/80 via-red-400/60 to-orange-400/70" />

            <div className="p-6">

              {/* Icon */}
              <div className="mb-5 flex  items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 ">
                    <RiDeleteBin6Line
                      size={20}
                      className="text-red-500"
                    />
                  </div>
                </div>

                <AlertDialogHeader className=" text-center">
                  <AlertDialogTitle className="text-xl font-bold tracking-tight text-foreground">
                    Delete Scraper Job?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="mx-auto max-w-xs text-sm leading-6 text-muted-foreground">
                    This will permanently remove your scraper workflow,
                    logs, and generated results.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>


              {/* Footer */}
              <AlertDialogFooter className="mt-7 flex gap-3">
                <AlertDialogCancel
                  disabled={deleting}
                  className="h-11 flex-1 rounded-2xl border border-border bg-background font-semibold transition-all duration-200 hover:bg-muted/50">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={deleting}
                  onClick={(e) => {
                    e.preventDefault();

                    setDeleting(true);

                    dispatch(deleteJob(job.id))
                      .unwrap()
                      .then(() => {
                        toast.success("Scraper deleted successfully");
                      })
                      .catch((err) => {
                        toast.error(
                          err?.message || "Failed to delete workflow"
                        );

                        setDeleting(false);
                      });
                  }}
                  className="h-11 min-w-[140px] rounded-2xl bg-red-600 font-semibold text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20active:scale-[0.98]">
                  {deleting ? (
                    <Loader size="xs" className="text-white" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <RiDeleteBin6Line size={15} />
                      Delete Job
                    </div>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}