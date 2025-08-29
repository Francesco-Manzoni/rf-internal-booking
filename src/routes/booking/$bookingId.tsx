import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
  User,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBooking } from '../../hooks/useApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/booking/$bookingId')({
  component: BookingDetailPage,
})

function BookingDetailPage() {
  const { t, i18n } = useTranslation()
  const { bookingId } = Route.useParams()
  const navigate = useNavigate()

  const { data: booking, isLoading, error } = useBooking(bookingId)

  // Helper to get week offset for the booking's start date
  const getWeekOffset = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(dateString)
    date.setHours(0, 0, 0, 0)
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
    const bookingMonday = getMonday(date)
    const msPerWeek = 1000 * 60 * 60 * 24 * 7
    return Math.round(
      (bookingMonday.getTime() - thisMonday.getTime()) / msPerWeek,
    )
  }

  const handleBackToCalendar = () => {
    if (booking) {
      const week = getWeekOffset(booking.startDate)
      navigate({
        to: '/station/$stationId',
        params: { stationId: booking.pickupReturnStationId },
        search: { week: String(week) },
      })
    } else {
      navigate({ to: '/' })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(
      i18n.language === 'de'
        ? 'de-DE'
        : i18n.language === 'es'
          ? 'es-ES'
          : i18n.language === 'it'
            ? 'it-IT'
            : 'en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    )
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return t('booking.duration.one_day', '1 day')
    return t('booking.duration.multiple_days', '{{count}} days', {
      count: diffDays,
    })
  }

  const getBookingStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) {
      return {
        status: 'upcoming',
        label: t('booking.status.upcoming', 'Upcoming'),
        variant: 'default' as const,
      }
    } else if (now >= start && now <= end) {
      return {
        status: 'active',
        label: t('booking.status.active', 'Active'),
        variant: 'destructive' as const,
      }
    } else {
      return {
        status: 'completed',
        label: t('booking.status.completed', 'Completed'),
        variant: 'secondary' as const,
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg">
            {t('booking.loading', 'Loading booking details...')}
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">
              {t(
                'booking.error',
                'Error loading booking details. Please try again.',
              )}
            </div>
            <Button onClick={handleBackToCalendar} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('booking.go_back', 'Go Back')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const bookingStatus = getBookingStatus(booking.startDate, booking.endDate)
  const duration = calculateDuration(booking.startDate, booking.endDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header: back button above, station name with pin, calendar on right */}
        <div className="pb-4">
          <div className="flex w-full mb-1">
            <Button
              variant="outline"
              onClick={handleBackToCalendar}
              size="lg"
              className="shrink-0"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <div className="text-lg">
                {t('booking.back_to_calendar', 'Back to Calendar')}
              </div>
            </Button>
          </div>
          <div className="flex items-center justify-between w-full mt-2 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {t('booking.title', 'Booking Details')}
              </h1>
            </div>
            <Badge
              variant={bookingStatus.variant}
              className="text-sm px-3 py-1"
            >
              {bookingStatus.label}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {t('booking.customer_info.title', 'Customer Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {t('booking.customer_info.name', 'Customer Name')}
                </label>
                <div className="text-lg font-semibold">
                  {booking.customerName}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {t('booking.customer_info.booking_id', 'Booking ID')}
                </label>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {booking.id}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                {t('booking.timeline.title', 'Booking Timeline')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {t('booking.timeline.pickup', 'Pickup Date & Time')}
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {formatDate(booking.startDate)}
                  </span>
                </div>
              </div>

              {/* Return */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {t('booking.timeline.return', 'Return Date & Time')}
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold">
                    {formatDate(booking.endDate)}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {t('booking.timeline.duration', 'Duration')}
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">{duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station Information */}
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                {t('booking.station_info.title', 'Station Information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t(
                      'booking.station_info.station',
                      'Pickup & Return Station',
                    )}
                  </label>
                  <div className="text-lg font-semibold">
                    {booking.pickupReturnStationName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('booking.station_info.station_id', 'Station ID')}:{' '}
                    {booking.pickupReturnStationId}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    {t('booking.station_info.note_title', 'Station Note')}
                  </label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {t(
                      'booking.station_info.note',
                      'All pickups and returns are processed at the same station location. Please ensure the vehicle is returned clean and with a full tank.',
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('booking.actions.title', 'Actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleBackToCalendar}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {t('booking.actions.view_calendar', 'View Station Calendar')}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const bookingInfo = `
${t('booking.actions.copy_details_content', 'Booking Details')}:
- ${t('booking.customer_info.name', 'Customer')}: ${booking.customerName}
- ${t('booking.customer_info.booking_id', 'Booking ID')}: ${booking.id}
- ${t('booking.timeline.pickup', 'Pickup')}: ${formatDate(booking.startDate)}
- ${t('booking.timeline.return', 'Return')}: ${formatDate(booking.endDate)}
- ${t('booking.timeline.duration', 'Duration')}: ${duration}
- ${t('booking.station_info.station', 'Station')}: ${booking.pickupReturnStationName}
                  `.trim()

                  navigator.clipboard
                    .writeText(bookingInfo)
                    .then(() =>
                      alert(
                        t(
                          'booking.actions.copy_success',
                          'Booking details copied to clipboard!',
                        ),
                      ),
                    )
                    .catch(() =>
                      alert(
                        t(
                          'booking.actions.copy_error',
                          'Failed to copy booking details',
                        ),
                      ),
                    )
                }}
              >
                {t('booking.actions.copy_details', 'Copy Details')}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const subject = t(
                    'booking.actions.email_subject',
                    'Booking Confirmation - {{customerName}}',
                    { customerName: booking.customerName },
                  )
                  const body = t(
                    'booking.actions.email_body',
                    `Dear {{customerName}},

Your campervan booking is confirmed:

Booking ID: {{bookingId}}
Pickup: {{pickupDate}}
Return: {{returnDate}}
Duration: {{duration}}
Station: {{stationName}}

Please arrive 15 minutes before your pickup time.

Best regards,
The Roadsurfer Team`,
                    {
                      customerName: booking.customerName,
                      bookingId: booking.id,
                      pickupDate: formatDate(booking.startDate),
                      returnDate: formatDate(booking.endDate),
                      duration: duration,
                      stationName: booking.pickupReturnStationName,
                    },
                  )

                  window.open(
                    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                  )
                }}
              >
                {t('booking.actions.send_email', 'Send Email')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
