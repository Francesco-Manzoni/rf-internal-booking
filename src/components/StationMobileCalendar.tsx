import type { BookingListItem } from '../types/api'

interface StationMobileCalendarProps {
  weekDates: Array<Date>
  weekDays: Array<string>
  bookings: Array<BookingListItem>
}

export const StationMobileCalendar = ({
  weekDates,
  weekDays,
  bookings,
}: StationMobileCalendarProps) => {
  // Filter bookings by date
  const getBookingsForDate = (date: Date): Array<BookingListItem> => {
    const dateString = date.toISOString().split('T')[0]
    return bookings.filter((booking) => {
      const startDate = booking.startDate.split('T')[0]
      const endDate = booking.endDate.split('T')[0]
      return startDate === dateString || endDate === dateString
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
    <div className="block md:hidden mb-3">
      {/* Day initials header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            <p className="text-sm font-medium text-gray-500">{day.charAt(0)}</p>
          </div>
        ))}
      </div>

      {/* Mobile calendar dates grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dayBookings = getBookingsForDate(date)
          const isToday = date.toDateString() === new Date().toDateString()

          const hasPickup = dayBookings.some((b) =>
            ['pickup', 'same-day'].includes(getBookingType(b, date)),
          )
          const hasReturn = dayBookings.some((b) =>
            ['return', 'same-day'].includes(getBookingType(b, date)),
          )

          return (
            <div
              key={date.toISOString()}
              className={`flex flex-col items-center p-1 space-y-1 rounded-lg ${
                isToday ? 'bg-blue-100 border border-blue-500' : ''
              }`}
            >
              <span
                className={`text-sm font-medium ${isToday ? 'text-blue-600 font-bold' : 'text-gray-900'}`}
              >
                {date.getDate()}
              </span>
              <div className="flex space-x-1 h-2 items-center">
                {hasPickup && (
                  <div
                    className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                    title="Pickup"
                  ></div>
                )}
                {hasReturn && (
                  <div
                    className="w-1.5 h-1.5 bg-green-600 rounded-full"
                    title="Return"
                  ></div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
