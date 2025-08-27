import { DroppableDateCell } from '../DroppableDateCellProps'
import { DraggableBookingCard } from '../DraggableBookingCard'
import { useTranslation } from 'react-i18next'
import type { BookingListItem } from '../../types/api'

interface StationCalendarGridProps {
  weekDates: Array<Date>
  weekDays: Array<string>
  bookings: Array<BookingListItem>
  onReschedule: (
    booking: BookingListItem,
    newDate: Date,
    rescheduleType: 'pickup' | 'return',
  ) => void
}

export const StationCalendarGrid = ({
  weekDates,
  weekDays,
  bookings,
  onReschedule,
}: StationCalendarGridProps) => {
  const { t } = useTranslation()

  // Filter bookings by date
  const getBookingsForDate = (date: Date): Array<BookingListItem> => {
    const dateString = date.toISOString().split('T')[0]
    return bookings.filter((booking) => {
      const startDate = booking.startDate.split('T')[0]
      const endDate = booking.endDate.split('T')[0]
      return startDate === dateString || endDate === dateString
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getBookingType = (booking: BookingListItem, date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    const startDate = booking.startDate.split('T')[0]
    const endDate = booking.endDate.split('T')[0]
    if (startDate === dateString && endDate === dateString) {
      return 'same-day'
    } else if (startDate === dateString) {
      return 'pickup'
    } else if (endDate === dateString) {
      return 'return'
    }
    return 'ongoing'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDates.map((date, index) => {
        const dayBookings = getBookingsForDate(date)
        const isToday = date.toDateString() === new Date().toDateString()

        return (
          <DroppableDateCell
            key={index}
            date={date}
            onDrop={onReschedule}
            isToday={isToday}
          >
            <div className="pb-3">
              <div className="text-sm font-medium">
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-600">{weekDays[index]}</span>
                  <span
                    className={`text-lg ${isToday ? 'text-blue-600 font-bold' : ''}`}
                  >
                    {formatDate(date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {dayBookings.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">
                  {t('station.no_bookings', 'No bookings')}
                </p>
              ) : (
                dayBookings.map((booking) => {
                  const bookingType = getBookingType(booking, date)
                  return (
                    <DraggableBookingCard
                      key={booking.id}
                      booking={booking}
                      bookingType={bookingType}
                      date={date}
                    />
                  )
                })
              )}
            </div>
          </DroppableDateCell>
        )
      })}
    </div>
  )
}
