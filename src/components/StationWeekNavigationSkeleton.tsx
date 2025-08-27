import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const StationWeekNavigationSkeleton = () => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex flex-row items-center justify-between gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardHeader>
  </Card>
)
