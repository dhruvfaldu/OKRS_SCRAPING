function NoSearchResults({ search }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Database className="h-7 w-7 text-muted-foreground" />
            </div>

            <h3 className="text-lg font-semibold">No Results Found {search}</h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                This scraping job hasn't generated any data yet. Once the job runs,
                extracted records will appear here.
            </p>
        </div>
    )
}

export default NoSearchResults