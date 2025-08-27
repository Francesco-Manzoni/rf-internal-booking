import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const StationCalendarGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-12" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="p-3 border rounded-lg">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
)
