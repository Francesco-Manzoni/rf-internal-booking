import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  User,
} from 'lucide-react'
import { useBookingsByStation, useStation } from '../../hooks/useApi'
import type { BookingListItem } from '../../types/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/station/$stationId')({
  component: StationCalendarPage,
})

function StationCalendarPage() {
  const { stationId } = Route.useParams()
  const navigate = useNavigate()
  const [currentWeek, setCurrentWeek] = useState(0)

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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToHome} size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Stations
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {station ? station.name : 'Station Calendar'}
              </h1>
              <p className="text-gray-600">Manage pickups and returns</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* Week Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevWeek} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Week
              </Button>
              <CardTitle className="text-lg">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </CardTitle>
              <Button variant="outline" onClick={handleNextWeek} size="sm">
                Next Week
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
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
