export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-12 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
    </div>
  )
}

