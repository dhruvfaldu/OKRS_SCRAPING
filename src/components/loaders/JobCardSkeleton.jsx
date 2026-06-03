import { Skeleton } from "@/components/ui/skeleton";

function JobCardSkeleton() {
  return (
    <>

      <div
        // key={idx}
        className="
            relative overflow-hidden rounded-3xl
            border border-border/60
            bg-card/80 backdrop-blur-xl
            shadow-sm transition-all
          "
      >
        {/* Top Loading Line */}
        <div className="relative h-1 overflow-hidden bg-muted/40">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[loading_1.4s_infinite] rounded-full bg-primary/40" />
        </div>

        {/* Header */}
        <div className="space-y-5 p-5">

          {/* Status */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24 rounded-xl" />

            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Main Content */}
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="relative">
              <Skeleton className="h-12 w-12 rounded-2xl" />

              <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl" />
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col gap-3 pt-1">
              <Skeleton className="h-4 w-[75%] rounded-lg" />

              <Skeleton className="h-3 w-[45%] rounded-lg" />
            </div>
          </div>
        </div>


        {/* Details */}
        {/* <div className="space-y-4 px-5 py-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />

              <Skeleton className="h-3 w-20 rounded-md" />
            </div>

            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />

              <Skeleton className="h-3 w-24 rounded-md" />
            </div>

            <Skeleton className="h-5 w-24 rounded-lg" />
          </div>
        </div> */}

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-border/60 bg-muted/10 p-3">
          <Skeleton className="h-11 flex-1 rounded-2xl" />

          <Skeleton className="h-11 flex-1 rounded-2xl" />

          <Skeleton className="h-11 w-11 rounded-2xl" />
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="
                absolute inset-y-0 -left-[120%]
                w-[60%] skew-x-[-20deg]
                bg-gradient-to-r from-transparent via-white/5 to-transparent
                animate-[shimmer_2s_infinite]
              "
          />
        </div>
      </div>

    </>
  );
}

export default JobCardSkeleton;