import { MapPin, TrendingDown, TrendingUp } from 'lucide-react'
import type { Station } from '../../types/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

interface StationWithStats extends Station {
  weeklyStats: {
    pickups: number
    returns: number
    total: number
  }
}

interface StationCardProps {
  station: StationWithStats
  onClick: (stationId: string) => void
  isSelected?: boolean
}

export function StationCard({
  station,
  onClick,
  isSelected = false,
}: StationCardProps) {
  const { t } = useTranslation()
  return (
    <Card
      className={`
        mx-2
        cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] p-1
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'hover:bg-gray-50/50'}
      `}
      onClick={() => onClick(station.id)}
    >
      <CardContent className="p-2">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="h-5 w-5 text-red-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-xl">
              {station.name}
            </h3>

            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-500 text-xs font-medium">
                {t('stationCard.this_week', 'This week:')}
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-gray-600">
                  {t('stationCard.pickups', {
                    count: station.weeklyStats.pickups,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-gray-600">
                  {t('stationCard.returns', {
                    count: station.weeklyStats.returns,
                  })}
                </span>
              </div>
            </div>

            {station.weeklyStats.total > 0 && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {t('stationCard.total', { count: station.weeklyStats.total })}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StationCardSkeleton() {
  return (
    <Card className="animate-pulse" data-testid="station-card-skeleton">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-9 h-9 rounded-lg" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>

              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
