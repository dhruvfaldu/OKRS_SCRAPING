function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-4 animate-pulse w-full">
      
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-4 w-3/4 bg-muted rounded-md" />
          <div className="h-3 w-1/2 bg-muted rounded-md" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-full shrink-0" />
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2">
        <div className="h-9 flex-1 bg-muted rounded-lg" />
        <div className="h-9 flex-1 bg-muted rounded-lg" />
        <div className="h-9 w-9 bg-muted rounded-lg shrink-0" />
      </div>
    </div>
  );
}

export default JobCardSkeleton;