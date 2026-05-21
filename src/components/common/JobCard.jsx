import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BarChart, RotateCw } from "lucide-react";
import { BsPlayFill } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { deleteJob, retryJob } from "../../store/slices/jobSlice";
import { toast } from "react-toastify";

function JobCard({ job }) {
  const [deleting, setDeleting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = (job?.status || "pending").toLowerCase();

  const statusClass =
    status === "completed"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
      : status === "running"
        ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
        : status === "failed"
          ? "bg-red-500/10 text-red-600 border-red-500/30"
          : "bg-amber-500/10 text-amber-600 border-amber-500/30";

  const firstLetter = (job?.name || "J").charAt(0).toUpperCase();

  const showActionButton = status === "completed" || status === "failed";

  const getActionButton = () => {

    if (status === "failed") {
      return (
        <Button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          onClick={() => {
            dispatch(retryJob(job.id)).unwrap()
              .then(() => toast.success(`Job "${job?.name}" is being retried`))
              .catch((err) => toast.error(err?.message || `Failed to retry job "${job?.name}"`));
            toast.info(`Retrying "${job?.name}"...`);
          }}
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      );
    }

    if (status === "completed") {
      return (
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          onClick={() => {
            dispatch(retryJob(job.id)).unwrap()
              .then(() => toast.success(`Job "${job?.name}" is being run`))
              .catch((err) => toast.error(err?.message || `Failed to run job "${job?.name}"`));
            toast.info(`Running "${job?.name}"...`);
          }}
        >
          <BsPlayFill className="w-4 h-4" />
          Run Job
        </Button>
      );
    }

    return null;
  };


  return (
    <Card className="bg-card text-card-foreground border border-border hover:border-primary/50 transition-all rounded-2xl shadow-sm hover:shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        {/* Left Side */}
        <div className="flex items-center gap-3 min-w-0 flex-1">

          {/* First Letter Avatar */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl font-medium text-muted-foreground">
            {firstLetter}
          </span>

          {/* Title + URL */}
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg text-foreground">
              {job?.name || "Amazon Product Scraper"}
            </CardTitle>

            <CardDescription className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <FaLink className="shrink-0" />

              <span className="truncate">
                {job?.url || "https://amazon.com/..."}
              </span>
            </CardDescription>
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          className={`shrink-0 capitalize border px-2.5 py-1 text-xs ${statusClass}`}
        >
          {status}
        </Badge>
      </CardHeader>

      {/* //horizontal line */}
      <div className="border-t border-border mx-5" />


      {/* Footer */}
      <div className="flex gap-2 px-4 pb-3">
        {/*Run Action Button */}
        {showActionButton && getActionButton()}

        {/* Results Button */}
        <Button
          variant="secondary"
          className="flex-1 hover:bg-muted cursor-pointer"
          onClick={() => navigate(`/results/${job.id}`)}
        >
          <BarChart /> Results
        </Button>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              disabled={deleting}
            >
              {deleting ? (
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-6 w-6 "></div>
              ) : (
                <RiDeleteBin5Line />
              )}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Job</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this job? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting} className="cursor-pointer">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={deleting}
                onClick={() => {
                  setDeleting(true);

                  dispatch(deleteJob(job.id)).unwrap()
                    .then(() => toast.success("Job deleted successfully"))
                    .catch((err) => toast.error(err?.message || "Failed to delete job"))
                    .finally(() => {
                      setDeleting(false);
                    });
                }}
                className="bg-red-600 cursor-pointer hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </Card>
  );
}

export default JobCard;