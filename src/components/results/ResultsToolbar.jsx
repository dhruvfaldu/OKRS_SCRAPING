import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, FileJson, X, TableProperties } from "lucide-react";

export default function ResultsToolbar({ search, setSearch, onExport, view, onViewChange }) {
  const hasSearch = search?.trim().length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left — Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search across all fields..."
          className="h-10 rounded-lg pl-10 pr-9"
        />
        {hasSearch && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right — View toggle + Export */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex rounded-lg border border-border bg-muted p-0.5">
          <button
            onClick={() => onViewChange("table")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <TableProperties className="h-4 w-4" />
            Table
          </button>
          <button
            onClick={() => onViewChange("json")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === "json"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <FileJson className="h-4 w-4" />
            JSON
          </button>
        </div>

        {/* Export */}
        <Button onClick={onExport} size="sm" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}