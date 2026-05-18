import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ExternalLink } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────

function isUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

// ── Component ────────────────────────────────────────────

function DataPreview({ value }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground">[]</span>;
    const previewItems = value.slice(0, 1);
    const hasMore = value.length > 1;

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {previewItems.map((item, i) => {
          const display = typeof item === "object" && item !== null ? "{...}" : String(item);
          return (
            <span key={i} className="max-w-[140px] truncate text-xs font-normal">
              {display}
            </span>
          );
        })}
        {hasMore && (
          <Badge variant="outline" className="bg-muted text-xs font-normal text-muted-foreground">
            +{value.length - 1}
          </Badge>
        )}
      </div>
    );
  }

  // Handle Objects
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    if (keys.length === 0) return <span className="text-muted-foreground">{"{}"}</span>;
    const previewKeys = keys.slice(0, 1);
    const hasMore = keys.length > 1;

    return (
      <div className="flex flex-col gap-1.5">
        {previewKeys.map((key) => {
          const val = value[key];
          let displayVal = String(val);
          if (val === null) displayVal = "null";
          else if (Array.isArray(val)) displayVal = "[...]";
          else if (typeof val === "object") displayVal = "{...}";

          return (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                {key}
              </span>
              <span className="truncate max-w-[160px] text-foreground" title={displayVal}>
                {displayVal}
              </span>
            </div>
          );
        })}
        {hasMore && (
          <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider pl-1">
            +{keys.length - 1} more fields
          </span>
        )}
      </div>
    );
  }

  // Handle URLs
  if (isUrl(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <span className="max-w-[240px] truncate">{value}</span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    );
  }

  // Primitives
  const strValue = String(value);
  return (
    <span className="block truncate max-w-[280px] text-sm" title={strValue}>
      {strValue}
    </span>
  );
}

export default function ResultsTable({ data = [], columns = [], onRowClick }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {/* <TableHead className="w-14 text-center font-semibold">#</TableHead> */}
              {columns.map((col) => (
                <TableHead key={col} className="whitespace-nowrap font-semibold capitalize">
                  {col.replace(/_/g, " ")}
                </TableHead>
              ))}
              {/* <TableHead className="w-16 text-right font-semibold">View</TableHead> */}
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(row)}
                className="cursor-pointer transition-colors hover:bg-accent/40"
              >
                {/* Row number */}
                {/* <TableCell className="text-center align-top pt-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                </TableCell> */}

                {/* Data cells */}
                {columns.map((col) => (
                  <TableCell key={col} className="align-top py-3">
                    <DataPreview value={row[col]} />
                  </TableCell>
                ))}

                {/* View button */}
                {/* <TableCell className="text-right align-top pt-3.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick?.(row);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}