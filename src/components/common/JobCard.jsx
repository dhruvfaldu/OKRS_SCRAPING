import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BarChart } from "lucide-react";
import { BsPlayFill } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { deleteJob } from "../../store/slices/jobSlice";
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

  const showActionButton =
    status === "completed" ||
    status === "failed" ||
    status === "running";

  const getActionButton = () => {
    if (status === "running") {
      return (
        <Button
          disabled
          className="flex-1 bg-blue-600 text-white cursor-not-allowed"
        >
          <RotateCw className="w-4 h-4 mr-1 animate-spin" />
          Running...
        </Button>
      );
    }

    if (status === "failed") {
      return (
        <Button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          onClick={() => {
            toast.info(`Retrying "${job?.name}"...`);
          }}
        >
          {/* <RotateCw  className="w-4 h-4 mr-1" /> */}
          Retry
        </Button>
      );
    }

    if (status === "completed") {
      return (
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          onClick={() => {
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
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-foreground text-lg truncate">
            {job?.name || "Amazon Product Scraper"}
          </CardTitle>

          <CardDescription className="flex gap-1 items-center text-muted-foreground text-xs truncate mt-1">
            <div>
              <FaLink />
            </div> {job?.url || "https://amazon.com/..."}
          </CardDescription>
        </div>

        <Badge className={`capitalize px-2.5 py-1 text-xs border ${statusClass}`}>
          {status}
        </Badge>
      </CardHeader>

      {/* Footer */}
      <div className="flex gap-2 px-4 pb-4">
        {showActionButton && getActionButton()}

        {/* Run Button */}
        {/* <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
          disabled={status === "running"}
          onClick={() => {
            // setRunning(true);
            // setTimeout(() => setRunning(false), 600);
            toast.info(`Running "${job?.name}"...`);
          }}
        >
          {status === "running" ? "Running..." : <><BsPlayFill /> Run</>}
        </Button> */}

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