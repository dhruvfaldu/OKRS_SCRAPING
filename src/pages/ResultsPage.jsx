import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResultsTable from "../components/common/ResultsTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";
import { BiTable } from "react-icons/bi";
import { LuFileJson2 } from "react-icons/lu";


const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { items: jobs = [] } = useSelector((state) => state.jobs);

  const [view, setView] = useState("table");

  const toggleBase = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer";

  const job = jobs.find((job) => job.id === id);

  const jobName = job ? job.name : "Unknown Job";

  return (
    <div className="bg-background text-foreground min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

          <div>
            <button
              onClick={() => navigate("/jobs")}
              className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-3 transition-colors"
            >
              ← Back to Jobs
            </button>

            <h1 className="text-3xl font-bold">Results</h1>

            <div className="flex items-center justify-center gap-2">
              <h3>{jobName}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Job ID:{" "}
                <code className="text-primary">{id}</code>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">

            {/* Toggle */}
            <div className="flex bg-muted border border-border rounded-xl p-1">
              <button
                onClick={() => setView("table")}
                className={`${toggleBase} ${view === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <BiTable size={16} /> Table
                </div>
              </button>

              <button
                onClick={() => setView("json")}
                className={`${toggleBase} ${view === "json"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
              >
               <div className="flex items-center justify-center gap-1">
                  <LuFileJson2 size={16} /> JSON
                </div>
              </button>

            </div>

            {/* Download */}
            <button
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/80 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            >
              ⬇ Download JSON
            </button>

          </div>
        </div>

        {/* Results Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">

          {view === "table" ? (
            <ResultsTable />
          ) : (
            <div className="p-5">

              <pre className="text-sm text-muted-foreground bg-background rounded-xl p-5 overflow-auto max-h-[600px] border border-border font-mono leading-relaxed">
                {JSON.stringify({}, null, 2)}
              </pre>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ResultsPage;