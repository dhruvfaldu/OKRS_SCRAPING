import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Columns3, Clock, CheckCircle2, Loader2,AlertCircle, Clock3, } from "lucide-react";

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  running: {
    label: "Running",
    icon: Loader2,
    className: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    spin: true,
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    className: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

export default function ResultsPageHeader({ job, totalRows, totalColumns }) {
  const navigate = useNavigate();
  const status = (job?.status || "pending").toLowerCase();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/jobs")}
        className="gap-1.5 text-sm p-0 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-6 w-6" />
        Back to Jobs
      </Button>

      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left — title */}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">
            {job?.name || "Untitled Job"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Job ID: <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">{job?.id}</code>
          </p>
        </div>

        {/* Right — stat badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <Badge variant="outline" className={`gap-1.5 rounded-full px-3 py-1 font-medium ${config.className}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${config.spin ? "animate-spin" : ""}`} />
            {config.label}
          </Badge>

          {/* Rows */}
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 font-medium">
            <Database className="h-3.5 w-3.5" />
            {totalRows.toLocaleString()} rows
          </Badge>

          {/* Columns */}
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 font-medium">
            <Columns3 className="h-3.5 w-3.5" />
            {totalColumns} fields
          </Badge>

          {/* Duration */}
          {job?.duration != null && (
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {job.duration}s
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
