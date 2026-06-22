import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Pagination — Universal reusable pagination component.
 *
 * Props:
 *   currentPage   {number}   – Active page (1-indexed). Required.
 *   totalPages    {number}   – Total number of pages. Required.
 *   onPageChange  {function} – Called with the new page number. Required.
 *   totalItems    {number}   – (Optional) Total item count for info text.
 *   pageSize      {number}   – (Optional) Items per page for info text.
 *   showPageInfo  {boolean}  – Show "Page X of Y" label. Default: true.
 *   disabled      {boolean}  – Disable all controls. Default: false.
 */
const Pagination = React.memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  showPageInfo = true,
  disabled = false,
}) {
  // Don't render anything when there is only one page or fewer
  if (!totalPages || totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  /**
   * Build the array of page numbers + ellipsis markers to display.
   * For ≤ 7 pages: show all numbers.
   * For > 7 pages: show first, last, current ± 1, and "…" gaps.
   */
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

    if (currentPage > 4) pages.push("…left");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("…right");

    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  /** Derive a human-readable info string */
  const renderInfo = () => {
    if (totalItems !== undefined && pageSize !== undefined) {
      const from = (currentPage - 1) * pageSize + 1;
      const to = Math.min(currentPage * pageSize, totalItems);
      return (
        <>
          Showing{" "}
          <span className="font-semibold text-foreground">{from}–{to}</span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span>
        </>
      );
    }
    return (
      <>
        Page{" "}
        <span className="font-semibold text-foreground">{currentPage}</span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      {/* Page info label */}
      {showPageInfo && (
        <p className="text-sm text-muted-foreground">{renderInfo()}</p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          disabled={isFirstPage || disabled}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-9 w-9"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page number buttons */}
        {pages.map((p) =>
          typeof p === "string" ? (
            // Ellipsis slot
            <div
              key={p}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={p}
              size="icon"
              variant={p === currentPage ? "default" : "ghost"}
              disabled={disabled}
              onClick={() => onPageChange(p)}
              className="h-9 w-9 font-semibold"
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          disabled={isLastPage || disabled}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-9 w-9"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export default Pagination;