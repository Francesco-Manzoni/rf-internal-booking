import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon, // Renamed to avoid conflict
  ChevronLeft,
  User,
  MapPin,
} from 'lucide-react'
import { useState } from 'react'
import { useBookingsByStation, useStation } from '../../hooks/useApi'
import type { BookingListItem } from '../../types/api'

export const Route = createFileRoute('/station/$stationId')({
  component: StationCalendarPage,
})

function StationCalendarPage() {
  const { stationId } = Route.useParams()
  const navigate = useNavigate()
  const [currentWeek, setCurrentWeek] = useState(0)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { data: station } = useStation(stationId)
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useBookingsByStation(stationId)

  // Calculate current week dates
  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7)

    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(currentWeek)
  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

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

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'default'
      case 'return':
        return 'secondary'
      case 'same-day':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'Pickup'
      case 'return':
        return 'Return'
      case 'same-day':
        return 'Same Day'
      default:
        return 'Ongoing'
    }
  }

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => prev - 1)
  }

  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev + 1)
  }

  const handleBackToHome = () => {
    navigate({ to: '/' })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selected = new Date(date)
    selected.setHours(0, 0, 0, 0)

    // Calculate the difference in milliseconds and then in days
    const msPerDay = 1000 * 60 * 60 * 24
    const dayDiff = Math.floor(
      (selected.getTime() - today.getTime()) / msPerDay,
    )

    // Calculate the week offset from the day difference
    const weekOffset = Math.floor(
      (dayDiff - today.getDay() + selected.getDay()) / 7,
    )

    setCurrentWeek(weekOffset)
    setIsCalendarOpen(false) // Close the popover after selection
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg">Loading bookings...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg text-red-600">
            Error loading bookings. Please try again.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <div className="container mx-auto px-4 py-4">
        {/* Header: back button above, station name with pin, calendar on right */}
        <div className="">
          <div className="flex w-full mb-1">
            <Button
              variant="outline"
              onClick={handleBackToHome}
              size="lg"
              className="shrink-0"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <div className="text-lg">Back to Stations</div>
            </Button>
          </div>
          <div className="flex items-center justify-between w-full mt-2 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {station ? station.name : 'Station Calendar'}
              </h1>
            </div>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-blue-100 bg-white hover:bg-blue-100"
                >
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={
                    weekDates[0] // Select the first day of the current week
                  }
                  onSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Week Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-row items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={handlePrevWeek}
                size="sm"
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-0 md:mr-2" />
                <span className="hidden md:inline">Previous Week</span>
              </Button>
              <CardTitle className="text-lg text-center flex-1">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </CardTitle>
              <Button
                variant="outline"
                onClick={handleNextWeek}
                size="sm"
                className="flex items-center justify-center"
              >
                <span className="hidden md:inline">Next Week</span>
                <ArrowRight className="h-4 w-4 ml-0 md:ml-2" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="block md:hidden mb-3">
          {/* Day initials header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((day) => (
              <div key={day} className="py-2">
                <p className="text-sm font-medium text-gray-500">
                  {day.charAt(0)}
                </p>
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

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const dayBookings = getBookingsForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <Card
                key={index}
                className={`min-h-48 ${isToday ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex flex-col items-center text-center">
                      <span className="text-gray-600">{weekDays[index]}</span>
                      <span
                        className={`text-lg ${isToday ? 'text-blue-600 font-bold' : ''}`}
                      >
                        {formatDate(date)}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dayBookings.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center">
                      No bookings
                    </p>
                  ) : (
                    dayBookings.map((booking) => {
                      const bookingType = getBookingType(booking, date)
                      return (
                        <Link
                          key={booking.id}
                          to="/booking/$bookingId"
                          params={{ bookingId: booking.id }}
                          className="block"
                        >
                          <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span className="text-xs font-medium truncate">
                                  {booking.customerName}
                                </span>
                              </div>
                              <Badge
                                variant={getBadgeVariant(bookingType)}
                                className="text-xs"
                              >
                                {getBadgeText(bookingType)}
                              </Badge>
                            </div>
                          </Card>
                        </Link>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Week Summary</CardTitle>
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
                <div className="text-sm text-gray-600">Pickups</div>
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
                <div className="text-sm text-gray-600">Returns</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(bookings.map((b) => b.customerName)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {bookings.length}
                </div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
