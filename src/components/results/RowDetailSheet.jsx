import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Database, X, FileText } from "lucide-react";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function isUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

// ─────────────────────────────────────────────
// Copy Button
// ─────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 shrink-0">
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}

// ─────────────────────────────────────────────
// Formatted Object (Recursive viewer)
// ─────────────────────────────────────────────

function FormattedObject({ data }) {
  if (typeof data !== "object" || data === null) {
    const strValue = String(data);
    if (isUrl(strValue)) {
      return (
        <a
          href={strValue}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 break-all text-primary hover:underline text-sm"
        >
          {strValue}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      );
    }
    return <span className="break-words text-sm text-foreground">{strValue}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <div className="flex flex-col gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex gap-3 rounded-lg border bg-background/50 p-3 shadow-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <FormattedObject data={item} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(data).map(([k, v]) => {
        const isComplex = typeof v === "object" && v !== null;
        return (
          <div key={k} className={`flex ${isComplex ? "flex-col gap-2" : "items-start gap-3"}`}>
            <span className="w-fit rounded bg-muted/60 px-1.5 py-0.5 text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">
              {k}
            </span>
            <div className="min-w-0 flex-1 text-sm">
              {isComplex ? (
                <div className="ml-2 border-l-2 border-muted/60 pl-3">
                  <FormattedObject data={v} />
                </div>
              ) : (
                <FormattedObject data={v} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Primitive Field
// ─────────────────────────────────────────────

function PrimitiveField({ label, value }) {
  const strValue = String(value);
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-start justify-between bg-muted/10 px-4 py-3">
        <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
          </div>
          <div className="mt-1">
            <FormattedObject data={value} />
          </div>
        </div>
        <CopyButton text={strValue} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Array Field
// ─────────────────────────────────────────────

function ArrayField({ label, value }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
        <Badge variant="secondary">{value.length} items</Badge>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 border-b px-4 py-4 transition-colors hover:bg-muted/20 last:border-b-0"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mt-0.5">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <FormattedObject data={item} />
            </div>
            <CopyButton text={typeof item === "object" ? JSON.stringify(item, null, 2) : String(item)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Object Field
// ─────────────────────────────────────────────

function ObjectField({ label, value }) {
  const json = JSON.stringify(value, null, 2);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Object</Badge>
          <CopyButton text={json} />
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto p-5">
        <FormattedObject data={value} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function RowDetailSheet({ row, open, onClose }) {
  if (!row) return null;

  const scrapedData = Object.entries(row);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent side="right" className="w-full bg-background p-0 sm:max-w-xl">
        <div className="flex h-full flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="flex items-start justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold">Row Details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  View full scraped result information
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-muted/10">
            <div className="space-y-6 p-6">
              {scrapedData.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed bg-card">
                  <p className="text-sm text-muted-foreground">No data available in this row.</p>
                </div>
              ) : (
                scrapedData.map(([key, value]) => {
                  const label = key.replace(/_/g, " ");

                  if (Array.isArray(value)) {
                    return <ArrayField key={key} label={label} value={value} />;
                  }

                  if (typeof value === "object" && value !== null) {
                    return <ObjectField key={key} label={label} value={value} />;
                  }

                  return <PrimitiveField key={key} label={label} value={value} />;
                })
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}