import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobResults } from "../store/slices/jobSlice";
import { exportResultsAsJSON } from "../utils/exportResults";
// Result components
import ResultsPageHeader from "../components/results/ResultsPageHeader";
import ResultsToolbar from "../components/results/ResultsToolbar";
import ResultsTable from "../components/results/ResultsTable";
import JsonViewer from "../components/results/JsonViewer";
import RowDetailSheet from "../components/results/RowDetailSheet";
import Pagination from "../components/results/Pagination";
import EmptyState from "../components/results/EmptyState";
import ResultsPageLoader from "../components/results/ResultsPageLoader";
import { Card, CardHeader } from "@/components/ui/card";

const PAGE_SIZE = 10;

export default function ResultsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedJob, isResultsLoading, error } = useSelector((s) => s.jobs);

  // Local state
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("table");
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch results on mount
  useEffect(() => {
    dispatch(fetchJobResults(id));
  }, [dispatch, id]);

  // Derived data
  const job = selectedJob || { id, name: "Loading…", status: "pending" };
  const results = selectedJob?.results || [];

  const columns = useMemo(() => (results.length > 0 ? Object.keys(results[0]) : []), [results]);

  const filteredResults = useMemo(() => {
    if (!search.trim()) return results;
    return results.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [results, search]);

  const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);

  const paginatedData = useMemo(
    () => filteredResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredResults, currentPage]
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ── Loading state ──────────────────────────────────────
  if (isResultsLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ResultsPageLoader />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      {/* Header */}
      <Card className="bg-card/60 border border-border/80  rounded-3xl shadow-sm p-4 sm:p-6 lg:p-8">
        <ResultsPageHeader
          job={job}
          totalRows={results.length}
          totalColumns={columns.length}
        />
      </Card>

      {/* Toolbar — search, view toggle, export */}
      <ResultsToolbar
        search={search}
        setSearch={setSearch}
        view={view}
        onViewChange={setView}
        onExport={() => exportResultsAsJSON(results, `${job.name || "results"}.json`)}
      />

      {/* Content */}
      {results.length === 0 ? (
        <EmptyState />
      ) : view === "json" ? (
        <JsonViewer data={results} />
      ) : (
        <>
          <ResultsTable
            data={paginatedData}
            columns={columns}
            onRowClick={setSelectedRow}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Row detail side panel */}
      <RowDetailSheet
        row={selectedRow}
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}