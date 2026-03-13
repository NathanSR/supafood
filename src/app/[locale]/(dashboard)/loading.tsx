export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5" />
        ))}
      </div>
      
      {/* Charts/Tables Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="h-[400px] bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5" />
        <div className="h-[400px] bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5" />
      </div>
    </div>
  );
}
