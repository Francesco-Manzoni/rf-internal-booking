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
import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router'
import React, { useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTranslation } from 'react-i18next'
import { useBookingsByStation } from '../../hooks/useApi'
import type { BookingListItem } from '../../types/api'

export const Route = createFileRoute('/station/$stationId')({
  component: StationCalendarPage,
  validateSearch: (search: Record<string, unknown>) => {
    // Accept ?week=number in query
    return {
      week:
        typeof search.week === 'string' && !isNaN(Number(search.week))
          ? search.week
          : undefined,
    }
  },
})

function StationCalendarPage() {
  const { t } = useTranslation()
  const { stationId } = Route.useParams()
  const queryClient = useQueryClient()
  const search = useSearch({ strict: false })
  const weekParam =
    search.week && !isNaN(Number(search.week)) ? parseInt(search.week, 10) : 0
  const [currentWeek, setCurrentWeek] = React.useState<number>(weekParam)

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

  // Calculate current week dates (Monday as first day)
  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    // getDay(): Sunday=0, Monday=1, ..., Saturday=6
    // We want Monday as first day
    const day = today.getDay()
    // Calculate how many days to subtract to get to Monday
    const diffToMonday = (day === 0 ? -6 : 1) - day
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() + diffToMonday + weekOffset * 7)
    startOfWeek.setHours(0, 0, 0, 0)

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

  // Update the URL query param when currentWeek changes
  const navigate = useNavigate()
  useEffect(() => {
    // Only update if different
    if (weekParam !== currentWeek) {
      navigate({
        // @ts-expect-error: week is a valid search param for this route
        search: { ...search, week: String(currentWeek) },
        replace: true,
      })
    }
  }, [currentWeek])

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => prev - 1)
  }

  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev + 1)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selected = new Date(date)
    selected.setHours(0, 0, 0, 0)

    // Align both dates to the start of their week (Monday as start)
    const getMonday = (d: Date) => {
      const day = d.getDay()
      const diff = (day === 0 ? -6 : 1) - day // Monday=1, Sunday=0
      const monday = new Date(d)
      monday.setDate(d.getDate() + diff)
      monday.setHours(0, 0, 0, 0)
      return monday
    }

    const thisMonday = getMonday(today)
    const selectedMonday = getMonday(selected)

    const msPerWeek = 1000 * 60 * 60 * 24 * 7
    const weekOffset = Math.round(
      (selectedMonday.getTime() - thisMonday.getTime()) / msPerWeek,
    )

    setCurrentWeek(weekOffset)
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
          <StationHeader
            stationId={stationId}
            currentWeek={currentWeek}
            onDateSelect={handleDateSelect}
          />

          <StationWeekNavigation
            weekDates={weekDates}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
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
