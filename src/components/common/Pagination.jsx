function Pagination({ page, setPage, hasNextPage, maxpages }) {
  const getPages = () => {
    let pages = [];
    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(maxpages - 1, page + 1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < maxpages - 1) pages.push("...");

    if (maxpages > 1) pages.push(maxpages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between mt-6 px-2">

      {/* LEFT INFO */}
      <p className="text-sm text-muted-foreground hidden sm:block">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{maxpages}</span>
      </p>

      {/* PAGINATION */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* PREVIOUS */}
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1.5 rounded-lg border text-sm transition-all
          ${page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent hover:border-primary"}
          `}
        >
          ← Prev
        </button>

        {/* PAGE NUMBERS */}
        <div className="flex items-center gap-1">
          {pages.map((p, i) => (
            <button
              key={i}
              onClick={() => typeof p === "number" && setPage(p)}
              disabled={typeof p === "string"}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm border transition-all
              ${p === page
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "hover:bg-accent border-border"
                }
              ${typeof p === "string"
                  ? "cursor-default opacity-50"
                  : "cursor-pointer"
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>

        {/* NEXT */}
        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
          className={`px-3 py-1.5 rounded-lg border text-sm transition-all
          ${!hasNextPage
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent hover:border-primary"
            }
          `}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Pagination;