import { Skeleton } from '@/components/ui/skeleton'

export const StationHeaderSkeleton = () => (
  <>
    <div className="flex w-full mb-1">
      <Skeleton className="h-10 w-40" />
    </div>
    <div className="flex items-center justify-between w-full mt-2 mb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-10 w-10 rounded-md" />
    </div>
  </>
)
