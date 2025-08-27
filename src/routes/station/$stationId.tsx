import { StationCalendarGrid } from '@/components/StationCalendarGrid'
import { StationCalendarGridSkeleton } from '@/components/StationCalendarGridSkeleton'
import { StationHeader } from '@/components/StationHeader'
import { StationHeaderSkeleton } from '@/components/StationHeaderSkeleton'
import { StationMobileCalendar } from '@/components/StationMobileCalendar'
import { StationMobileCalendarSkeleton } from '@/components/StationMobileCalendarSkeleton'
import { StationWeekNavigation } from '@/components/StationWeekNavigation'
import { StationWeekNavigationSkeleton } from '@/components/StationWeekNavigationSkeleton'
import { StationWeekSummary } from '@/components/StationWeekSummary'
import { StationWeekSummarySkeleton } from '@/components/StationWeekSummarySkeleton'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { de, enUS, es, it } from 'react-day-picker/locale'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTranslation } from 'react-i18next'
import { useBookingsByStation, useStation } from '../../hooks/useApi'
import type { BookingListItem } from '../../types/api'

export const Route = createFileRoute('/station/$stationId')({
  component: StationCalendarPage,
})

function StationCalendarPage() {
  const { t, i18n } = useTranslation()
  const { stationId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentWeek, setCurrentWeek] = useState(0)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { data: station } = useStation(stationId)
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useBookingsByStation(stationId)

  // Handle drag and drop reschedule
  const handleReschedule = useCallback(
    (
      booking: BookingListItem,
      newDate: Date,
      rescheduleType: 'pickup' | 'return',
    ) => {
      const newDateString =
        newDate.toISOString().split('T')[0] +
        'T' +
        booking.startDate.split('T')[1]

      let newStartDate = booking.startDate
      let newEndDate = booking.endDate

      if (rescheduleType === 'pickup') {
        newStartDate = newDateString
      } else {
        newEndDate = newDateString
      }

      // Validate that pickup is before return
      if (new Date(newStartDate) > new Date(newEndDate)) {
        alert(
          t(
            'station.reschedule.error.invalid_dates',
            'Pickup date cannot be after return date',
          ),
        )
        return
      }

      // Update TanStack Query cache for station bookings
      queryClient.setQueryData(
        ['bookings', 'station', stationId],
        (oldData: Array<BookingListItem> | undefined) => {
          if (!oldData) return oldData

          return oldData.map((oldBooking) => {
            if (oldBooking.id === booking.id) {
              return {
                ...oldBooking,
                startDate: newStartDate,
                endDate: newEndDate,
              }
            }
            return oldBooking
          })
        },
      )

      // Simulate API call
      console.log('🚀 API Call - Reschedule Booking:', {
        bookingId: booking.id,
        customeremail: `${booking.customerName.toLowerCase().replace(' ', '.')}@example.com`,
        originalStartDate: booking.startDate,
        originalEndDate: booking.endDate,
        newStartDate,
        newEndDate,
        rescheduleType,
        stationId,
        timestamp: new Date().toISOString(),
        apiEndpoint: `PUT /api/bookings/${booking.id}/reschedule`,
        payload: {
          pickupDate: newStartDate,
          returnDate: newEndDate,
          reason: 'Station employee rescheduling via drag-and-drop',
        },
      })
    },
    [stationId, t, queryClient],
  )

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
    t('station.days.monday'),
    t('station.days.tuesday'),
    t('station.days.wednesday'),
    t('station.days.thursday'),
    t('station.days.friday'),
    t('station.days.saturday'),
    t('station.days.sunday'),
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div>
            <StationHeaderSkeleton />
          </div>

          <StationWeekNavigationSkeleton />
          <StationMobileCalendarSkeleton />
          <StationCalendarGridSkeleton />
          <StationWeekSummarySkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg text-red-600">
            {t('station.error_loading', 'Error loading bookings.')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100">
        <div className="container mx-auto px-4 py-4">
          <StationHeader stationId={stationId} />

          <StationWeekNavigation
            weekDates={weekDates}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onDateSelect={handleDateSelect}
          />

          <StationMobileCalendar
            weekDates={weekDates}
            weekDays={weekDays}
            bookings={bookings}
          />

          <StationCalendarGrid
            weekDates={weekDates}
            weekDays={weekDays}
            bookings={bookings}
            onReschedule={handleReschedule}
          />

          <StationWeekSummary weekDates={weekDates} bookings={bookings} />
        </div>
      </div>
    </DndProvider>
  )
}
