import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StationWeekNavigationProps {
  weekDates: Array<Date>
  onPrevWeek: () => void
  onNextWeek: () => void
}

export const StationWeekNavigation = ({
  weekDates,
  onPrevWeek,
  onNextWeek,
}: StationWeekNavigationProps) => {
  const { t } = useTranslation()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-row items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={onPrevWeek}
            size="sm"
            className="flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-0 md:mr-2" />
            <span className="hidden md:inline">
              {t('station.navigation.previous_week', 'Previous Week')}
            </span>
          </Button>
          <CardTitle className="text-lg text-center flex-1">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </CardTitle>
          <Button
            variant="outline"
            onClick={onNextWeek}
            size="sm"
            className="flex items-center justify-center"
          >
            <span className="hidden md:inline">
              {t('station.navigation.next_week', 'Next Week')}
            </span>
            <ArrowRight className="h-4 w-4 ml-0 md:ml-2" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
