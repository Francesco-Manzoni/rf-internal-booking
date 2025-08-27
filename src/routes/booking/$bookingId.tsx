import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
  User,
} from 'lucide-react'
import { useBooking } from '../../hooks/useApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/booking/$bookingId')({
  component: BookingDetailPage,
})

function BookingDetailPage() {
  const { bookingId } = Route.useParams()
  const navigate = useNavigate()

  const { data: booking, isLoading, error } = useBooking(bookingId)

  const handleBackToCalendar = () => {
    if (booking) {
      navigate({
        to: '/station/$stationId',
        params: { stationId: booking.pickupReturnStationId },
      })
    } else {
      navigate({ to: '/' })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day'
    return `${diffDays} days`
  }

  const getBookingStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) {
      return {
        status: 'upcoming',
        label: 'Upcoming',
        variant: 'default' as const,
      }
    } else if (now >= start && now <= end) {
      return {
        status: 'active',
        label: 'Active',
        variant: 'destructive' as const,
      }
    } else {
      return {
        status: 'completed',
        label: 'Completed',
        variant: 'secondary' as const,
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg">Loading booking details...</div>
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
              Error loading booking details. Please try again.
            </div>
            <Button onClick={handleBackToCalendar} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
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
              <div className="text-lg">Back to Calendar</div>
            </Button>
          </div>
          <div className="flex items-center justify-between w-full mt-2 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                Booking Details
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
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Customer Name
                </label>
                <div className="text-lg font-semibold">
                  {booking.customerName}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Booking ID
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
                Booking Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Pickup Date & Time
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
                  Return Date & Time
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
                  Duration
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
                Station Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Pickup & Return Station
                  </label>
                  <div className="text-lg font-semibold">
                    {booking.pickupReturnStationName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Station ID: {booking.pickupReturnStationId}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Station Note
                  </label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    All pickups and returns are processed at the same station
                    location. Please ensure the vehicle is returned clean and
                    with a full tank.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleBackToCalendar}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                View Station Calendar
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const bookingInfo = `
Booking Details:
- Customer: ${booking.customerName}
- Booking ID: ${booking.id}
- Pickup: ${formatDate(booking.startDate)}
- Return: ${formatDate(booking.endDate)}
- Duration: ${duration}
- Station: ${booking.pickupReturnStationName}
                  `.trim()

                  navigator.clipboard
                    .writeText(bookingInfo)
                    .then(() => alert('Booking details copied to clipboard!'))
                    .catch(() => alert('Failed to copy booking details'))
                }}
              >
                Copy Details
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const subject = `Booking Confirmation - ${booking.customerName}`
                  const body = `Dear ${booking.customerName},

Your campervan booking is confirmed:

Booking ID: ${booking.id}
Pickup: ${formatDate(booking.startDate)}
Return: ${formatDate(booking.endDate)}
Duration: ${duration}
Station: ${booking.pickupReturnStationName}

Please arrive 15 minutes before your pickup time.

Best regards,
The Roadsurfer Team`

                  window.open(
                    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                  )
                }}
              >
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
