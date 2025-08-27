import { Skeleton } from '@/components/ui/skeleton'

export const StationMobileCalendarSkeleton = () => (
  <div className="block md:hidden mb-3">
    {/* Day initials header skeleton */}
    <div className="grid grid-cols-7 gap-1 text-center mb-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="py-2">
          <Skeleton className="h-4 w-4 rounded mx-auto" />
        </div>
      ))}
    </div>

    {/* Mobile calendar dates grid skeleton */}
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center p-1 space-y-1 rounded-lg"
        >
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-2 w-4" />
        </div>
      ))}
    </div>
  </div>
)
