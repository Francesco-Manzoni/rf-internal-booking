import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import type { BookingListItem } from '../../types/api'

interface StationWeekSummaryProps {
  weekDates: Array<Date>
  bookings: Array<BookingListItem>
}

export const StationWeekSummary = ({
  weekDates,
  bookings,
}: StationWeekSummaryProps) => {
  const { t } = useTranslation()

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{t('station.week_summary.title', 'Week Summary')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {
                bookings.filter((b) => {
                  const startDate = new Date(b.startDate)
                  return weekDates.some(
                    (d) => d.toDateString() === startDate.toDateString(),
                  )
                }).length
              }
            </div>
            <div className="text-sm text-gray-600">
              {t('station.week_summary.pickups', 'Pickups')}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {
                bookings.filter((b) => {
                  const endDate = new Date(b.endDate)
                  return weekDates.some(
                    (d) => d.toDateString() === endDate.toDateString(),
                  )
                }).length
              }
            </div>
            <div className="text-sm text-gray-600">
              {t('station.week_summary.returns', 'Returns')}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(bookings.map((b) => b.customerName)).size}
            </div>
            <div className="text-sm text-gray-600">
              {t('station.week_summary.unique_customers', 'Unique Customers')}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {bookings.length}
            </div>
            <div className="text-sm text-gray-600">
              {t('station.week_summary.total_bookings', 'Total Bookings')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
